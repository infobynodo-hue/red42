"use client";
import { cn } from "@/lib/utils";
import React from "react";

type GradientHeadingProps = {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "pink";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
};

const sizeClasses: Record<NonNullable<GradientHeadingProps["size"]>, string> = {
  xs:  "text-xs",
  sm:  "text-sm",
  md:  "text-base",
  lg:  "text-2xl",
  xl:  "text-4xl font-bold tracking-tight",
  xxl: "text-5xl font-extrabold tracking-tight",
};

const gradients: Record<NonNullable<GradientHeadingProps["variant"]>, string> = {
  default:   "from-[#D00000] via-[#FF2222] to-[#FF9999]",
  secondary: "from-[#888888] via-[#aaaaaa] to-[#cccccc]",
  pink:      "from-[#D00000] via-[#FF4444] to-[#FF9999]",
};

export function GradientHeading({
  children,
  variant = "default",
  size = "xl",
  className,
  as: Tag = "h2",
}: GradientHeadingProps) {
  return (
    <Tag
      className={cn(
        "bg-gradient-to-r bg-clip-text text-transparent",
        gradients[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </Tag>
  );
}
