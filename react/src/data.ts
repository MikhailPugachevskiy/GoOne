* Sample data for the Go One demo: providers, bikes and the five product steps */

export type ProviderId = "nextbike" | "callabike" | "mobike" | "limebike";
export type PayMethod = "card" | "paypal";

export interface Provider {
    id: ProviderId;
    name: string;
    color: string;
    /* Sample price for 30 minutes in euros, not a real tariff */
    pricePer30: number;
}

export interface Bike {
    id: string;
    provider: ProviderId;
    x: number;
    y: number;
    /* Distance from the rider in metres, calculated from the map position */
    distance: number;
}

export const providers: Provider[] = [
    { id: "nextbike", name: "Nextbike", color: "#3b82f6", pricePer30: 1.0 },
    { id: "callabike", name: "Call a Bike", color: "#ef4444", pricePer30: 1.2 },
    { id: "mobike", name: "Mobike", color: "#f97316", pricePer30: 0.75 },
    { id: "limebike", name: "LimeBike", color: "#84cc16", pricePer30: 1.5 }
];

export function providerById(id: ProviderId): Provider {
    const provider = providers.find((item) => item.id === id);
    if (!provider) {
        throw new Error(`Unknown provider: ${id}`);
    }
    return provider;
}