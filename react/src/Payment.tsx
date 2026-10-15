import { bikePrice, formatPrice, providerById } from "./data";
import type { Bike, PayMethod } from "./data";

interface PaymentProps {
    bike: Bike;
    method: PayMethod;
    paying: boolean;
    onMethod: (method: PayMethod) => void;
    onPay: () => void;
    onBack: () => void;
}

const options: Array<{ id: PayMethod; label: string }> = [
    { id: "card", label: "Credit card" },
    { id: "paypal", label: "PayPal" }
];

/* Step 4: one checkout inside Go One, no extra account at the provider */
export function Payment({ bike, method, paying, onMethod, onPay, onBack }: PaymentProps) {
    const provider = providerById(bike.provider);
    const price = formatPrice(bikePrice(bike));

    return (
        <div className="demo-view">
            <h3>Pay with your Go One account</h3>
            <p className="demo-summary">
                {provider.name} bike, {bike.distance} m away: <strong>{price}</strong> for 30 minutes
            </p>
            <fieldset className="demo-pay-options">
                <legend>Payment method</legend>
                {options.map((option) => (
                    <label key={option.id} className="demo-pay-option">
                        <input
                            type="radio"
                            name="pay-method"
                            value={option.id}
                            checked={method === option.id}
                            onChange={() => onMethod(option.id)}
                        />
                        <span>{option.label}</span>
                    </label>
                ))}
            </fieldset>
            <p className="demo-insight">
                One account for every provider: no separate {provider.name} sign-up needed.
            </p>
            <div className="demo-actions">
                <button type="button" className="btn btn-primary" disabled={paying} onClick={onPay}>
                    {paying ? "Processing…" : `Pay ${price}`}
                </button>
                <button type="button" className="btn btn-ghost" disabled={paying} onClick={onBack}>
                    Choose another bike
                </button>
            </div>
        </div>
    );
}
