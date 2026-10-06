import type { ComponentPropsWithoutRef, ElementType } from "react";

type ContainerProps<T extends ElementType> = {
  as?: T;
  size?: "default" | "narrow";
} & ComponentPropsWithoutRef<T>;

export function Container<T extends ElementType = "div">({ as, size = "default", className = "", ...props }: ContainerProps<T>) {
  const Component = as ?? "div";
  const width = size === "narrow" ? "max-w-4xl" : "max-w-7xl";
  return <Component className={`mx-auto w-full ${width} px-5 sm:px-8 ${className}`} {...props} />;
}
