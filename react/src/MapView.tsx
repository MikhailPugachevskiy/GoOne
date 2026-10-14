import { MAP, formatPrice, providerById } from "./data";
import type { Bike } from "./data";

interface MapViewProps {
    bikes: Bike[];
    selectedId: string | null;
    /* Ids of the cheapest visible bikes while the lowest-price filter is on, otherwise null */
    cheapestIds: Set<string> | null;
    onSelect: (id: string) => void;
}

/* A stylised street map drawn as SVG; every bike is a keyboard-reachable button */
export function MapView({ bikes, selectedId, cheapestIds, onSelect }: MapViewProps) {
    return (
        <svg
            className="demo-map"
            viewBox={`0 0 ${MAP.width} ${MAP.height}`}
            role="group"
            aria-label="Map of nearby shared bikes"
        >
            <rect width={MAP.width} height={MAP.height} fill="var(--bg-elevated)" />
            <rect x="215" y="195" width="110" height="80" rx="10" fill="rgba(31, 143, 90, 0.35)" />
            <g stroke="rgba(125, 255, 179, 0.14)" strokeWidth="6" fill="none" strokeLinecap="round">
                <path d="M0 80 H360" />
                <path d="M0 215 H360" />
                <path d="M105 0 V300" />
                <path d="M265 0 V300" />
                <path d="M0 290 L360 20" strokeWidth="3" />
            </g>

            <circle cx={MAP.user.x} cy={MAP.user.y} r="18" fill="rgba(125, 255, 179, 0.16)" />
            <circle
                cx={MAP.user.x}
                cy={MAP.user.y}
                r="6"
                fill="var(--accent)"
                stroke="var(--ink)"
                strokeWidth="2"
            />
            <text x={MAP.user.x} y={MAP.user.y + 32} textAnchor="middle" fontSize="11" fill="var(--ink)">
                You
            </text>