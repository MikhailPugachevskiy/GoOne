/* Break-even model for the Go One pitch: yearly revenue, costs, gross profit and cash including both funding rounds */

export interface Inputs {
    /* Fee per booked ride from 2021 on (Version 2.0), in euros */
    fee: number;
    /* Ride volume compared with the pitch plan, 1 = plan */
    volume: number;
    /* Costs compared with the plan, 1 = plan */
    costs: number;
}

export interface YearResult {
    year: number;
    revenue: number;
    costs: number;
    profit: number;
    /* Sum of all gross profits up to and including this year */
    cumulative: number;
    /* Cumulative gross profit plus the funding received by the end of this year */
    cash: number;
}

export interface Summary {
    breakEvenYear: number | null;
    lowestCash: number;
    lowestCashYear: number;
    lastProfit: number;
}

export const defaultInputs: Inputs = { fee: 0.015, volume: 1, costs: 1 };

/* An example scenario for comparison, not part of the pitch: the plan fee, but only 80% of the planned rides */
export const cautiousInputs: Inputs = { fee: 0.015, volume: 0.8, costs: 1 };

/* Funding rounds from the pitch: EUR 200,000 in Q3 2019 and EUR 200,000 in Q2 2020 */
const funding: Record<number, number> = { 2019: 200000, 2020: 200000 };
export const fundingTotal = 400000;

/*
 * Plan values per year. Revenue and fees come from the pitch (slide 13).
 * Costs are NOT stated in the deck: they are estimated as revenue minus the gross profit
 * read off the chart, so the default scenario reproduces the chart (about -120k, -275k, +20k, +190k, +630k).
 */
const plan = [
    { year: 2019, revenue: 0, fee: 0, cost: 120000 },
    { year: 2020, revenue: 104509, fee: 0.01, cost: 380000 },
    { year: 2021, revenue: 523555, fee: 0.015, cost: 503000 },
    { year: 2022, revenue: 989268, fee: 0.015, cost: 799000 },
    { year: 2023, revenue: 1930974, fee: 0.015, cost: 1301000 }
];

export function calculate(inputs: Inputs): { years: YearResult[]; summary: Summary } {
    let cumulative = 0;
    let raised = 0;

    const years: YearResult[] = plan.map((item) => {
        /* The number of rides follows from the plan revenue and the plan fee */
        const rides = item.fee > 0 ? item.revenue / item.fee : 0;
        /* The MVP years keep the plan fee; the fee slider applies from Version 2.0 on */
        const fee = item.year <= 2020 ? item.fee : inputs.fee;
        const revenue = Math.round(rides * inputs.volume * fee);
        const costs = Math.round(item.cost * inputs.costs);
        const profit = revenue - costs;

        cumulative += profit;
        raised += funding[item.year] ?? 0;

        return { year: item.year, revenue, costs, profit, cumulative, cash: cumulative + raised };
    });

    const lowest = years.reduce((best, item) => (item.cash < best.cash ? item : best));
    const breakEven = years.find((item) => item.profit >= 0);

    return {
        years,
        summary: {
            breakEvenYear: breakEven ? breakEven.year : null,
            lowestCash: lowest.cash,
            lowestCashYear: lowest.year,
            lastProfit: years[years.length - 1].profit
        }
    };
}

export function formatEuro(value: number): string {
    const sign = value < 0 ? "−" : "";
    return `${sign}€${Math.abs(Math.round(value)).toLocaleString("en-US")}`;
}

/* Short axis label: €0, €500k, €1M, €1.5M */
export function formatThousands(value: number): string {
    if (value === 0) {
        return "€0";
    }
    const sign = value < 0 ? "−" : "";
    const absolute = Math.abs(value);
    if (absolute >= 1000000) {
        return `${sign}€${Number((absolute / 1000000).toFixed(2))}M`;
    }
    return `${sign}€${Math.round(absolute / 1000)}k`;
}