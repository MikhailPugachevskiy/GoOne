import { formatEuro, formatThousands } from "./model";
import type { YearResult } from "./model";

interface ChartProps {
    years: YearResult[];
}

const WIDTH = 480;
const HEIGHT = 300;
const MARGIN = { top: 14, right: 12, bottom: 30, left: 52 };

/* Picks a round tick step (1, 2, 5 times a power of ten) so the axis has about five labels */
function niceStep(range: number): number {
    const raw = range / 5;
    const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
    const normalized = raw / magnitude;
    const factor = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
    return factor * magnitude;
}

/* Bars: gross profit per year. Line: cash position at year end, including both funding rounds */
export function Chart({ years }: ChartProps) {
    const values = years.flatMap((item) => [item.profit, item.cash]);
    const low = Math.min(0, ...values);
    const high = Math.max(0, ...values);
    const step = niceStep(high - low);
    const axisMin = Math.floor(low / step) * step;
    const axisMax = Math.ceil(high / step) * step;

    const ticks: number[] = [];
    for (let tick = axisMin; tick <= axisMax + step / 2; tick += step) {
        ticks.push(tick);
    }

    const plotWidth = WIDTH - MARGIN.left - MARGIN.right;
    const plotHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
    const band = plotWidth / years.length;
    const barWidth = band * 0.5;

    const yOf = (value: number): number =>
        MARGIN.top + ((axisMax - value) / (axisMax - axisMin)) * plotHeight;
    const xCenter = (index: number): number => MARGIN.left + band * index + band / 2;

    const linePoints = years.map((item, index) => `${xCenter(index)},${yOf(item.cash)}`).join(" ");
    const summary = years
        .map((item) => `${item.year}: gross profit ${formatEuro(item.profit)}, cash ${formatEuro(item.cash)}`)
        .join("; ");

    return (
        <svg
            className="calc-chart"
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            role="img"
            aria-label={`Gross profit per year and cash position. ${summary}`}
        >
            {ticks.map((tick) => (
                <g key={tick}>
                    <line
                        className={tick === 0 ? "calc-zero" : "calc-grid"}
                        x1={MARGIN.left}
                        x2={WIDTH - MARGIN.right}
                        y1={yOf(tick)}
                        y2={yOf(tick)}
                    />
                    <text className="calc-axis-text" x={MARGIN.left - 8} y={yOf(tick) + 4} textAnchor="end">
                        {formatThousands(tick)}
                    </text>
                </g>
            ))}

            {years.map((item, index) => {
                const top = yOf(Math.max(item.profit, 0));
                const bottom = yOf(Math.min(item.profit, 0));
                return (
                    <rect
                        key={item.year}
                        className={item.profit >= 0 ? "calc-bar-pos" : "calc-bar-neg"}
                        x={xCenter(index) - barWidth / 2}
                        y={top}
                        width={barWidth}
                        height={Math.max(bottom - top, 1)}
                        rx="3"
                    />
                );
            })}

            <polyline className="calc-line" points={linePoints} />
            {years.map((item, index) => (
                <circle key={item.year} className="calc-dot" cx={xCenter(index)} cy={yOf(item.cash)} r="4" />
            ))}

            {years.map((item, index) => (
                <text
                    key={item.year}
                    className="calc-axis-text"
                    x={xCenter(index)}
                    y={HEIGHT - 8}
                    textAnchor="middle"
                >
                    {item.year}
                </text>
            ))}
        </svg>
    );
}