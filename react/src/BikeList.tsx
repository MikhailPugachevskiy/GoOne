import { formatPrice, providerById } from "./data";
import type { Bike } from "./data";

interface BikeListProps {
    /* Already sorted: by distance, or by price when the lowest-price filter is on */
    bikes: Bike[];
    selectedId: string | null;
    lowestPrice: boolean;
    onSelect: (id: string) => void;
}

/* The five best matches as a list, so the choice also works without the map */
export function BikeList({ bikes, selectedId, lowestPrice, onSelect }: BikeListProps) {
    return (
        <div>
            <h3 className="demo-list-title">{lowestPrice ? "Cheapest bikes" : "Nearest bikes"}</h3>
            <ul className="demo-list">
                {bikes.slice(0, 5).map((bike) => {
                    const provider = providerById(bike.provider);
                    return (
                        <li key={bike.id}>
                            <button
                                type="button"
                                className="demo-row"
                                aria-pressed={bike.id === selectedId}
                                onClick={() => onSelect(bike.id)}
                            >
                                <span className="demo-dot" style={{ background: provider.color }} />
                                <span className="demo-row-name">{provider.name}</span>
                                <span>{bike.distance} m</span>
                                <span>{formatPrice(provider.pricePer30)}</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
