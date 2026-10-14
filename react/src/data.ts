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

/* Map space: the rider stands in the middle, one map unit is about 0.9 m */
export const MAP = { width: 360, height: 300, user: { x: 180, y: 150 }, metersPerUnit: 0.9 };

const rawBikes: Array<{ provider: ProviderId; x: number; y: number }> = [
    { provider: "limebike", x: 205, y: 125 },
    { provider: "nextbike", x: 120, y: 200 },
    { provider: "mobike", x: 235, y: 170 },
    { provider: "callabike", x: 150, y: 95 },
    { provider: "nextbike", x: 290, y: 110 },
    { provider: "limebike", x: 60, y: 130 },
    { provider: "mobike", x: 90, y: 60 },
    { provider: "callabike", x: 300, y: 220 },
    { provider: "nextbike", x: 200, y: 260 },
    { provider: "limebike", x: 320, y: 40 },
    { provider: "mobike", x: 40, y: 230 },
    { provider: "callabike", x: 250, y: 45 },
    { provider: "limebike", x: 150, y: 230 },
    { provider: "nextbike", x: 330, y: 170 },
    { provider: "mobike", x: 180, y: 40 },
    { provider: "callabike", x: 90, y: 160 }
];

export const bikes: Bike[] = rawBikes.map((bike, index) => ({
    id: `${bike.provider}-${index + 1}`,
    provider: bike.provider,
    x: bike.x,
    y: bike.y,
    distance: Math.round(
        Math.hypot(bike.x - MAP.user.x, bike.y - MAP.user.y) * MAP.metersPerUnit
    )
}));

export function bikePrice(bike: Bike): number {
    return providerById(bike.provider).pricePer30;
}

export function formatPrice(value: number): string {
    return `€${value.toFixed(2)}`;
}

/* Small deterministic hash, used for the demo lock code and QR pattern */
export function hashString(text: string): number {
    let hash = 7;
    for (let i = 0; i < text.length; i += 1) {
        hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
    }
    return hash;
}

/* The five steps of the product flow, with the same wording as the page copy */
export const steps = [
    { title: "Overview", text: "All available bikes from partner providers appear in your area on one map." },
    { title: "Filters", text: "Narrow the map by a specific operator or by the lowest price before you walk." },
    { title: "Choose", text: "Select the bike that is closest, cheapest, or from the brand you already trust." },
    { title: "Pay", text: "Checkout stays inside Go One. Pay by credit card or PayPal with the same account." },
    { title: "Unlock", text: "Scan the QR code on the bike and receive a numerical lock code to start the ride." }
];