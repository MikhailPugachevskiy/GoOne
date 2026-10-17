import { cautiousInputs, defaultInputs } from "./model";
import type { Inputs } from "./model";

interface ControlsProps {
    inputs: Inputs;
    onChange: (change: Partial<Inputs>) => void;
    onPreset: (inputs: Inputs) => void;
}

/* Three sliders and two presets; every slider shows its current value next to the label */
export function Controls({ inputs, onChange, onPreset }: ControlsProps) {
    return (
        <div className="calc-controls">
            <div className="calc-field">
                <div className="calc-field-head">
                    <label htmlFor="calc-fee">Fee per ride from 2021</label>
                    <output htmlFor="calc-fee">€{inputs.fee.toFixed(4)}</output>
                </div>
                <input
                    id="calc-fee"
                    type="range"
                    min={0.005}
                    max={0.02}
                    step={0.0005}
                    value={inputs.fee}
                    onChange={(event) => onChange({ fee: Number(event.target.value) })}
                />
                <p className="calc-help">Pitch range: €0.010 to €0.015</p>
            </div>

            <div className="calc-field">
                <div className="calc-field-head">
                    <label htmlFor="calc-volume">Rides with Go One vs. plan</label>
                    <output htmlFor="calc-volume">{Math.round(inputs.volume * 100)}%</output>
                </div>
                <input
                    id="calc-volume"
                    type="range"
                    min={0.4}
                    max={1.5}
                    step={0.05}
                    value={inputs.volume}
                    onChange={(event) => onChange({ volume: Number(event.target.value) })}
                />
                <p className="calc-help">100% is the ride volume in the pitch</p>
            </div>

            <div className="calc-field">
                <div className="calc-field-head">
                    <label htmlFor="calc-costs">Costs vs. plan</label>
                    <output htmlFor="calc-costs">{Math.round(inputs.costs * 100)}%</output>
                </div>
                <input
                    id="calc-costs"
                    type="range"
                    min={0.7}
                    max={1.3}
                    step={0.05}
                    value={inputs.costs}
                    onChange={(event) => onChange({ costs: Number(event.target.value) })}
                />
                <p className="calc-help">Estimated from the profit chart, see the note below</p>
            </div>

            <div className="calc-presets">
                <button type="button" className="btn btn-ghost" onClick={() => onPreset(defaultInputs)}>
                    Pitch plan
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => onPreset(cautiousInputs)}>
                    Cautious example
                </button>
            </div>
        </div>
    );
}
