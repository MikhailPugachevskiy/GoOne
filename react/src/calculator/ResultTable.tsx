import { formatEuro } from "./model";
import type { YearResult } from "./model";

interface ResultTableProps {
    years: YearResult[];
}

/* The numbers behind the chart, also the text alternative for screen readers */
export function ResultTable({ years }: ResultTableProps) {
    return (
        <details className="calc-details">
            <summary>Show the numbers</summary>
            <div className="calc-table-wrap">
                <table className="calc-table">
                    <caption className="demo-sr-only">Yearly results of the selected scenario</caption>
                    <thead>
                        <tr>
                            <th scope="col">Year</th>
                            <th scope="col">Revenue</th>
                            <th scope="col">Costs</th>
                            <th scope="col">Gross profit</th>
                            <th scope="col">Cash incl. funding</th>
                        </tr>
                    </thead>
                    <tbody>
                        {years.map((item) => (
                            <tr key={item.year}>
                                <th scope="row">{item.year}</th>
                                <td>{formatEuro(item.revenue)}</td>
                                <td>{formatEuro(item.costs)}</td>
                                <td>{formatEuro(item.profit)}</td>
                                <td>{formatEuro(item.cash)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </details>
    );
}
