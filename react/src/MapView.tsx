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

            {bikes.map((bike) => {
                const provider = providerById(bike.provider);
                const isSelected = bike.id === selectedId;
                const isCheapest = cheapestIds !== null && cheapestIds.has(bike.id);
                const dimmed = cheapestIds !== null && !isCheapest;
                const label = `${provider.name} bike, ${bike.distance} metres away, ${formatPrice(provider.pricePer30)} per 30 minutes`;

                return (
                    <g
                        key={bike.id}
                        className="demo-marker"
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSelected}
                        aria-label={label}
                        opacity={dimmed ? 0.3 : 1}
                        onClick={() => onSelect(bike.id)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                onSelect(bike.id);
                            }
                        }}
                    >
                        <title>{label}</title>
                        <circle cx={bike.x} cy={bike.y} r="16" fill="transparent" />
                        <circle
                            className="demo-marker-dot"
                            cx={bike.x}
                            cy={bike.y}
                            r={isSelected ? 12 : 9}
                            fill={provider.color}
                            stroke={isSelected ? "var(--ink)" : isCheapest ? "var(--accent)" : "#062016"}
                            strokeWidth={isSelected ? 3.5 : isCheapest ? 3 : 2}
                        />
                    </g>
                );
            })}
        </svg>
    );
}