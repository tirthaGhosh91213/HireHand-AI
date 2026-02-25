"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SpotlightGridProps {
    className?: string;
    spotlightColor?: string;
    gridColor?: string;
    dotSize?: number;
    gap?: number;
}

export function SpotlightGrid({
    className,
    spotlightColor = "rgba(79, 70, 229, 0.15)",
    dotSize = 1,
    gap = 24,
}: SpotlightGridProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            setMousePosition({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            });
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener("mousemove", handleMouseMove);
            container.addEventListener("mouseenter", () => setIsHovered(true));
            container.addEventListener("mouseleave", () => setIsHovered(false));
        }

        return () => {
            if (container) {
                container.removeEventListener("mousemove", handleMouseMove);
                container.removeEventListener("mouseenter", () => setIsHovered(true));
                container.removeEventListener("mouseleave", () => setIsHovered(false));
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={cn(
                "absolute inset-0 overflow-hidden pointer-events-none",
                className
            )}
        >
            <div
                className="absolute inset-0 bg-dot-grid opacity-100"
                style={{
                    backgroundSize: `${gap}px ${gap}px`,
                }}
            />
            <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                    opacity: isHovered ? 1 : 0,
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${spotlightColor}, transparent 40%)`,
                }}
            />
        </div>
    );
}
