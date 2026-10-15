import { steps } from "./data";

interface StepperProps {
    current: number;
    locked: boolean;
    onSelect: (step: number) => void;
}

/* The five product steps. Finished steps can be clicked to go back; the current step shows its description */
export function Stepper({ current, locked, onSelect }: StepperProps) {
    return (
        <ol className="demo-steps" aria-label="Steps">
            {steps.map((step, index) => {
                const number = index + 1;
                const isCurrent = number === current;
                const state = isCurrent ? "current" : number < current ? "done" : "todo";
                const canGoBack = number < current && current < 5 && !locked;

                return (
                    <li key={step.title} className="demo-step" data-state={state}>
                        <button
                            type="button"
                            className="demo-step-button"
                            disabled={!canGoBack}
                            aria-current={isCurrent ? "step" : undefined}
                            onClick={() => onSelect(number)}
                        >
                            <span className="demo-step-number">{number}</span>
                            <span className="demo-step-title">{step.title}</span>
                            <span className="demo-step-text">{step.text}</span>
                        </button>
                    </li>
                );
            })}
        </ol>
    );
}
