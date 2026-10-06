"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/shared/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  spotlightSize?: number;
}

export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(106, 171, 240, 0.15)",
  spotlightSize = 320,
  ...props
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0, opacity: 0 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, opacity: 1 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setPos((p) => ({ ...p, opacity: 0 }))}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-white border border-black/8 shadow-sm transition-all duration-200 hover:shadow-md",
        className
      )}
      {...props}
    >
      <div
        style={{
          position: "absolute",
          left: pos.x - spotlightSize / 2,
          top: pos.y - spotlightSize / 2,
          width: spotlightSize,
          height: spotlightSize,
          background: `radial-gradient(circle at center, ${spotlightColor}, transparent 70%)`,
          opacity: pos.opacity,
          transition: "opacity 0.25s ease",
          pointerEvents: "none",
          borderRadius: "50%",
          zIndex: 1,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
