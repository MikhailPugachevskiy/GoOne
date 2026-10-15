import { providers } from "./data";
import type { ProviderId } from "./data";

interface FilterBarProps {
    selected: ProviderId[];
    lowestPrice: boolean;
    onToggleProvider: (id: ProviderId) => void;
    onClearProviders: () => void;
    onToggleLowest: () => void;
}

/* Provider chips plus the lowest-price toggle; an empty selection means all providers */
export function FilterBar({
    selected,
    lowestPrice,
    onToggleProvider,
    onClearProviders,
    onToggleLowest
}: FilterBarProps) {
    return (
        <div className="demo-filters" role="group" aria-label="Filters">
            <button
                type="button"
                className="demo-chip"
                aria-pressed={selected.length === 0}
                onClick={onClearProviders}
            >
                All providers
            </button>
            {providers.map((provider) => (
                <button
                    key={provider.id}
                    type="button"
                    className="demo-chip"
                    aria-pressed={selected.includes(provider.id)}
                    onClick={() => onToggleProvider(provider.id)}
                >
                    <span className="demo-dot" style={{ background: provider.color }} />
                    {provider.name}
                </button>
            ))}
            <button
                type="button"
                className="demo-chip"
                aria-pressed={lowestPrice}
                onClick={onToggleLowest}
            >
                Lowest price
            </button>
        </div>
    );
}
