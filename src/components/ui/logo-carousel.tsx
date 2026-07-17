"use client";
import React, { useEffect, useRef, useState, type SVGProps } from "react";

type Logo = {
  name: string;
  id: number;
  img: React.ComponentType<SVGProps<SVGSVGElement>>;
};

type LogoColumnProps = {
  logos: Logo[];
  index: number;
  currentTime: number;
};

function LogoColumn({ logos, index, currentTime }: LogoColumnProps) {
  const CYCLE_DURATION = 2000;
  const LOGO_DURATION  = 3000;
  const columnDelay    = index * 200;
  const adjustedTime   = (currentTime + columnDelay) % (LOGO_DURATION * logos.length);
  const currentIndex   = Math.floor(adjustedTime / LOGO_DURATION);
  const progress       = (adjustedTime % LOGO_DURATION) / LOGO_DURATION;

  const isEntering  = progress < CYCLE_DURATION / (2 * LOGO_DURATION);
  const isLeaving   = progress > 1 - CYCLE_DURATION / (2 * LOGO_DURATION);
  const isVisible   = !isEntering && !isLeaving;

  const opacity = isEntering
    ? progress / (CYCLE_DURATION / (2 * LOGO_DURATION))
    : isLeaving
    ? (1 - progress) / (CYCLE_DURATION / (2 * LOGO_DURATION))
    : 1;

  const translateY = isEntering
    ? (1 - opacity) * 20
    : isLeaving
    ? -opacity * 20 + 20
    : 0;

  const currentLogo = logos[currentIndex % logos.length];
  const LogoComponent = currentLogo.img;

  return (
    <div className="relative h-14 w-24 overflow-hidden flex items-center justify-center">
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          transition: isVisible ? "none" : "opacity 0.3s, transform 0.3s",
        }}
        className="flex items-center justify-center"
      >
        <LogoComponent
          className="h-8 w-auto max-w-[80px] object-contain"
          style={{ filter: "grayscale(100%) brightness(0.4) contrast(1.2)" }}
        />
      </div>
    </div>
  );
}

type LogoCarouselProps = {
  columnCount?: number;
  logos: Logo[];
};

export function LogoCarousel({ columnCount = 4, logos }: LogoCarouselProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentTime(prev => prev + 100);
    }, 100);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const columns = Array.from({ length: columnCount }, (_, i) => {
    const start = Math.floor((i * logos.length) / columnCount);
    const end   = Math.floor(((i + 1) * logos.length) / columnCount);
    return logos.slice(start, end);
  });

  return (
    <div className="flex items-center justify-center gap-8">
      {columns.map((colLogos, i) => (
        <LogoColumn key={i} logos={colLogos} index={i} currentTime={currentTime} />
      ))}
    </div>
  );
}
