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