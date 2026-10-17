import { AddIcon } from "@sanity/icons/Add";
import { LaunchIcon } from "@sanity/icons/Launch";
import { RefreshIcon } from "@sanity/icons/Refresh";
import { Box, Button, Card, Container, Flex, Grid, Heading, Spinner, Stack, Text } from "@sanity/ui";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useClient } from "sanity";
import { IntentLink } from "sanity/router";
import { mergeSections, sectionDefinitions, sectionGroups, sectionKeys } from "@/lib/content/sections";

/**
 * "Tableau de bord", the Studio's first screen: what needs attention (new quote requests), what
 * is shown on the site (sections, packages, prices, Meta Pixel) and shortcuts to every editor.
 * Read-only: every change still happens in the documents, with their "Publier" button.
 */

type Quote = { _id: string; name?: string; eventType?: string; pack?: string; receivedAt?: string; status?: string; date?: string };
type Category = { _id: string; key: string; label?: string; hideFormulas?: boolean; showPrices?: boolean; pricingStyle?: string; visible: number; total: number };
type Data = {
  newQuotes: number;
  monthQuotes: number;
  latest: Quote[];
  posts: number;
  drafts: number;
  projects: number;
  testimonials: number;
  settings: Record<string, unknown> | null;
  categories: Category[];
};

const query = `{
  "newQuotes": count(*[_type == "quoteRequest" && status == "new"]),
  "monthQuotes": count(*[_type == "quoteRequest" && receivedAt >= $monthStart]),
  "latest": *[_type == "quoteRequest"] | order(receivedAt desc)[0...6]{ _id, name, eventType, pack, receivedAt, status, date },
  "posts": count(*[_type == "post" && !(_id in path("drafts.**"))]),
  "drafts": count(*[_type == "post" && _id in path("drafts.**")]),
  "projects": count(*[_type == "project" && !(_id in path("drafts.**"))]),
  "testimonials": count(*[_type == "testimonial" && !(_id in path("drafts.**"))]),
  "settings": *[_id == "siteSettings"][0],
  "categories": *[_type == "eventCategory" && !(_id in path("drafts.**"))] | order(_id asc){
    _id, key, "label": label.fr, hideFormulas, showPrices, pricingStyle,
    "visible": count(formulas[hidden != true && (defined(priceEur) || defined(priceGbp) || defined(priceMad) || onRequest == true)]),
    "total": count(formulas)
  }
}`;

const categoryOrder = ["wedding", "privateParty", "birthday", "festival", "seminar"];

const statusLabels: Record<string, { label: string; tone: Tone }> = {
  new: { label: "Nouvelle", tone: "primary" },
  inProgress: { label: "En cours", tone: "caution" },
  quoted: { label: "Devis envoyé", tone: "default" },
  won: { label: "Confirmée", tone: "positive" },
  lost: { label: "Sans suite", tone: "critical" },
};

function formatDate(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

/** A whole card that opens a document in the editor. */
function EditCard({ id, type, children, tone = "default" }: { id: string; type: string; children: ReactNode; tone?: "default" | "primary" }) {
  return (
    <Card
      as={IntentLink}
      intent="edit"
      params={{ id, type }}
      padding={4}
      radius={3}
      shadow={1}
      tone={tone}
      style={{ textDecoration: "none", display: "block" }}
    >
      {children}
    </Card>
  );
}

type Tone = "primary" | "caution" | "positive" | "critical" | "default";

/** Small coloured label (status, visibility). */
function Pill({ tone = "default", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <Card tone={tone} paddingX={2} paddingY={1} radius={5} border style={{ display: "inline-block" }}>
      <Text size={1} weight="medium">
        {children}
      </Text>
    </Card>
  );
}

function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <Card padding={4} radius={3} shadow={1}>
      <Stack gap={3}>
        <Text size={1} muted weight="medium">
          {label}
        </Text>
        <Text size={4} weight="bold">
          {value}
        </Text>
        {hint && (
          <Text size={1} muted>
            {hint}
          </Text>
        )}
      </Stack>
    </Card>
  );
}

function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <Flex align="center" justify="space-between" gap={3}>
      <Heading as="h2" size={2}>
        {children}
      </Heading>
      {action}
    </Flex>
  );
}

export function Dashboard() {
  const client = useClient({ apiVersion: "2026-01-01" });
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    client
      .fetch<Data>(query, { monthStart })
      .then((result) => {
        setData(result);
        setError(false);
      })
      .catch(() => setError(true));
  }, [client]);

  useEffect(() => {
    load();
  }, [load]);

  const siteUrl = typeof window === "undefined" ? "/fr" : `${window.location.origin}/fr`;

  if (!data) {
    return (
      <Flex align="center" justify="center" padding={6}>
        {error ? <Text>Impossible de charger le tableau de bord. Rechargez la page.</Text> : <Spinner muted />}
      </Flex>
    );
  }

  const sections = mergeSections(data.settings);
  const pixelId = typeof data.settings?.metaPixelId === "string" ? data.settings.metaPixelId : "";
  const pixelOn = data.settings?.metaPixelEnabled === true && /^\d{10,20}$/.test(pixelId);
  const categories = [...data.categories].sort((a, b) => categoryOrder.indexOf(a.key) - categoryOrder.indexOf(b.key));

  return (
    <Box padding={[4, 5, 6]} style={{ overflowY: "auto", height: "100%" }}>
      <Container width={4}>
        <Stack gap={6}>
          <Flex align={["flex-start", "center"]} justify="space-between" gap={4} wrap="wrap">
            <Stack gap={3}>
              <Heading as="h1" size={4}>
                Tableau de bord
              </Heading>
              <Text muted size={2}>
                Tout votre site Yeaf Events en un coup d&apos;œil. Cliquez sur une carte pour modifier, puis sur « Publier ».
              </Text>
            </Stack>
            <Flex gap={2}>
              <Button icon={RefreshIcon} mode="ghost" text="Actualiser" onClick={load} />
              <Button as="a" href={siteUrl} target="_blank" rel="noopener noreferrer" icon={LaunchIcon} tone="primary" text="Voir le site" />
            </Flex>
          </Flex>

          <Grid gridTemplateColumns={[1, 2, 4]} gap={4}>
            <Stat label="Nouvelles demandes" value={data.newQuotes} hint="À traiter" />
            <Stat label="Demandes ce mois-ci" value={data.monthQuotes} />
            <Stat label="Articles de blog" value={data.posts} hint={data.drafts ? `${data.drafts} brouillon(s) à publier` : "Aucun brouillon"} />
            <Stat label="Réalisations · Témoignages" value={`${data.projects} · ${data.testimonials}`} />
          </Grid>

          <Stack gap={4}>
            <SectionTitle>Dernières demandes de devis</SectionTitle>
            {data.latest.length === 0 ? (
              <Card padding={4} radius={3} border>
                <Text muted>Aucune demande pour l&apos;instant. Elles arriveront ici dès qu&apos;un client enverra le formulaire.</Text>
              </Card>
            ) : (
              <Stack gap={2}>
                {data.latest.map((quote) => {
                  const status = statusLabels[quote.status ?? "new"] ?? statusLabels.new!;
                  return (
                    <EditCard key={quote._id} id={quote._id} type="quoteRequest">
                      <Flex align="center" gap={3} wrap="wrap">
                        <Box flex={1} style={{ minWidth: 200 }}>
                          <Stack gap={2}>
                            <Text weight="semibold">{quote.name ?? "Sans nom"}</Text>
                            <Text size={1} muted>
                              {[quote.eventType, quote.pack, quote.date && `le ${new Date(quote.date).toLocaleDateString("fr-FR")}`].filter(Boolean).join(" · ")}
                            </Text>
                          </Stack>
                        </Box>
                        <Text size={1} muted>
                          {formatDate(quote.receivedAt)}
                        </Text>
                        <Pill tone={status.tone}>
                          {status.label}
                        </Pill>
                      </Flex>
                    </EditCard>
                  );
                })}
              </Stack>
            )}
          </Stack>

          <Stack gap={4}>
            <SectionTitle>Votre site</SectionTitle>
            <Grid gridTemplateColumns={[1, 2, 3]} gap={4}>
              <EditCard id="homePage" type="homePage">
                <Stack gap={3}>
                  <Text weight="semibold">Page d&apos;accueil</Text>
                  <Text size={1} muted>
                    Titre, textes, photos, « Quelques moments », appel final.
                  </Text>
                </Stack>
              </EditCard>
              <EditCard id="siteSettings" type="siteSettings">
                <Stack gap={3}>
                  <Text weight="semibold">Sections du site</Text>
                  <Text size={1} muted>
                    {sectionKeys.filter((key) => sections[key]).length} sections affichées sur {sectionKeys.length}. Afficher ou masquer chaque bloc.
                  </Text>
                </Stack>
              </EditCard>
              <EditCard id="siteSettings" type="siteSettings" tone={pixelOn ? "primary" : "default"}>
                <Stack gap={3}>
                  <Flex align="center" gap={2}>
                    <Text weight="semibold">Meta Pixel</Text>
                    <Pill tone={pixelOn ? "positive" : "default"}>{pixelOn ? "Actif" : "Inactif"}</Pill>
                  </Flex>
                  <Text size={1} muted>
                    {pixelOn ? `ID ${pixelId}` : "Onglet « Publicité (Meta Pixel) » : cochez « Activer » et collez l'ID."}
                  </Text>
                </Stack>
              </EditCard>
            </Grid>
            <Card padding={4} radius={3} border>
              <Stack gap={3}>
                <Text size={1} weight="semibold">
                  Sections masquées
                </Text>
                <Flex gap={2} wrap="wrap">
                  {sectionKeys.filter((key) => !sections[key]).length === 0 ? (
                    <Text size={1} muted>
                      Toutes les sections sont affichées.
                    </Text>
                  ) : (
                    sectionKeys
                      .filter((key) => !sections[key])
                      .map((key) => (
                        <Pill key={key}>
                          {sectionGroups[sectionDefinitions[key].group].split(" (")[0]} · {sectionDefinitions[key].title}
                        </Pill>
                      ))
                  )}
                </Flex>
              </Stack>
            </Card>
          </Stack>

          <Stack gap={4}>
            <SectionTitle>Types d&apos;événement et formules</SectionTitle>
            <Grid gridTemplateColumns={[1, 2, 3]} gap={4}>
              {categories.map((category) => {
                const services = category.pricingStyle === "services";
                const summary = category.hideFormulas
                  ? "Section formules masquée"
                  : `${category.visible} ${services ? "prestation(s)" : "formule(s)"} affichée(s)${category.total > category.visible ? ` · ${category.total - category.visible} cachée(s)` : ""}`;
                return (
                  <EditCard key={category._id} id={category._id} type="eventCategory">
                    <Stack gap={3}>
                      <Text weight="semibold">{category.label ?? category.key}</Text>
                      <Text size={1} muted>
                        {summary}
                      </Text>
                      <Flex gap={2} wrap="wrap">
                        <Pill tone={category.hideFormulas ? "critical" : "positive"}>{category.hideFormulas ? "Masquées" : "Visibles"}</Pill>
                        {!services && <Pill tone={category.showPrices ? "primary" : "default"}>{category.showPrices ? "Prix affichés" : "Prix masqués"}</Pill>}
                        {services && <Pill>Prestations</Pill>}
                      </Flex>
                    </Stack>
                  </EditCard>
                );
              })}
            </Grid>
          </Stack>

          <Stack gap={4}>
            <SectionTitle>Ajouter du contenu</SectionTitle>
            <Flex gap={3} wrap="wrap">
              {[
                { type: "post", label: "Nouvel article de blog" },
                { type: "project", label: "Nouvelle réalisation" },
                { type: "testimonial", label: "Nouveau témoignage" },
              ].map((item) => (
                <Button
                  key={item.type}
                  as={IntentLink}
                  intent="create"
                  params={{ type: item.type }}
                  icon={AddIcon}
                  mode="ghost"
                  text={item.label}
                />
              ))}
            </Flex>
          </Stack>

          <Card padding={4} radius={3} tone="primary">
            <Text size={1}>
              Astuce : une modification n&apos;apparaît sur le site qu&apos;après « Publier ». Elle est visible en quelques secondes (jusqu&apos;à une heure si le
              webhook Sanity n&apos;inclut pas ce type de document).
            </Text>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
