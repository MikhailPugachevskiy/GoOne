import { useMemo, useState } from "react";
import { Chart } from "./Chart";
import { Controls } from "./Controls";
import { ResultTable } from "./ResultTable";
import { calculate, defaultInputs, formatEuro, fundingTotal } from "./model";
import type { Inputs } from "./model";

/* Interactive break-even calculator: three sliders change the pitch plan, results update at once */
export function Calculator() {
    const [inputs, setInputs] = useState<Inputs>(defaultInputs);
    const { years, summary } = useMemo(() => calculate(inputs), [inputs]);

    const shortfall = summary.lowestCash < 0;
    const fundingText = shortfall
        ? `The two rounds (${formatEuro(fundingTotal)}) fall short: cash is ${formatEuro(summary.lowestCash)} at the end of ${summary.lowestCashYear}.`
        : `The two rounds (${formatEuro(fundingTotal)}) cover the losses. The lowest year-end cash is ${formatEuro(summary.lowestCash)} in ${summary.lowestCashYear}.`;

    return (
        <div className="calc-layout">
            <Controls
                inputs={inputs}
                onChange={(change) => setInputs((current) => ({ ...current, ...change }))}
                onPreset={setInputs}
            />

            <div className="calc-results">
                <div className="calc-stats" role="status">
                    <div className="calc-stat">
                        <p className="calc-stat-label">Break-even</p>
                        <p className="calc-stat-value">
                            {summary.breakEvenYear !== null ? summary.breakEvenYear : "Not by 2023"}
                        </p>
                    </div>
                    <div className="calc-stat">
                        <p className="calc-stat-label">Gross profit 2023</p>
                        <p className="calc-stat-value">{formatEuro(summary.lastProfit)}</p>
                    </div>
                    <div className="calc-stat" data-state={shortfall ? "gap" : "ok"}>
                        <p className="calc-stat-label">Lowest year-end cash</p>
                        <p className="calc-stat-value">{formatEuro(summary.lowestCash)}</p>
                    </div>
                </div>

                <p className="calc-verdict" data-state={shortfall ? "gap" : "ok"}>
                    {fundingText}
                </p>

                <div className="calc-legend" aria-hidden="true">
                    <span>
                        <span className="calc-swatch calc-swatch-pos" /> Gross profit
                    </span>
                    <span>
                        <span className="calc-swatch calc-swatch-neg" /> Loss
                    </span>
                    <span>
                        <span className="calc-swatch calc-swatch-line" /> Cash incl. funding
                    </span>
                </div>

                <Chart years={years} />
                <ResultTable years={years} />

                <p className="calc-note">
                    Simplified model. Revenue follows the pitch plan (fee times rides). Costs are not stated in the
                    deck: they are estimated from the gross-profit chart on slide 13. Funding: €200,000 in Q3 2019
                    and €200,000 in Q2 2020. Cash is shown at year end, so lows within a year are not visible.
                </p>
            </div>
        </div>
    );
}
