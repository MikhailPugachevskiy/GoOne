import { useEffect, useMemo, useState } from "react";
import { bikePrice, bikes, formatPrice, providerById, steps } from "./data";
import type { Bike, PayMethod, ProviderId } from "./data";
import { BikeList } from "./BikeList";
import { FilterBar } from "./FilterBar";
import { MapView } from "./MapView";
import { Payment } from "./Payment";
import { Stepper } from "./Stepper";
import { Unlock } from "./Unlock";

function closest(list: Bike[]): Bike {
    return list.reduce((best, bike) => (bike.distance < best.distance ? bike : best));
}

/* The interactive Go One demo: map, filters, choice, payment and unlock, all with sample data */
export function Demo() {
    const [selectedProviders, setSelectedProviders] = useState<ProviderId[]>([]);
    const [lowestPrice, setLowestPrice] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [step, setStep] = useState(1);
    const [payMethod, setPayMethod] = useState<PayMethod>("card");
    const [paying, setPaying] = useState(false);

    /* Bikes that pass the provider filter; an empty selection means all providers */
    const visibleBikes = useMemo(
        () =>
            bikes.filter(
                (bike) => selectedProviders.length === 0 || selectedProviders.includes(bike.provider)
            ),
        [selectedProviders]
    );

    const sortedBikes = useMemo(
        () =>
            [...visibleBikes].sort((a, b) =>
                lowestPrice
                    ? bikePrice(a) - bikePrice(b) || a.distance - b.distance
                    : a.distance - b.distance
            ),
        [visibleBikes, lowestPrice]
    );

    const cheapestIds = useMemo(() => {
        if (!lowestPrice) {
            return null;
        }
        const lowest = Math.min(...visibleBikes.map(bikePrice));
        return new Set(visibleBikes.filter((bike) => bikePrice(bike) === lowest).map((bike) => bike.id));
    }, [lowestPrice, visibleBikes]);

    const selectedBike = bikes.find((bike) => bike.id === selectedId) ?? null;
    const closestAll = closest(bikes);
    const closestVisible = closest(visibleBikes);
    const filterActive = selectedProviders.length > 0;

    /* Payment takes a moment, then the flow moves on to the unlock step */
    useEffect(() => {
        if (!paying) {
            return undefined;
        }
        const timer = window.setTimeout(() => {
            setPaying(false);
            setStep(5);
        }, 900);
        return () => window.clearTimeout(timer);
    }, [paying]);

    const applyProviders = (next: ProviderId[]) => {
        setSelectedProviders(next);
        if (selectedBike && next.length > 0 && !next.includes(selectedBike.provider)) {
            /* The chosen bike is filtered out, so the choice starts again */
            setSelectedId(null);
            setStep(2);
        } else if (step === 1) {
            setStep(2);
        }
    };

    const toggleProvider = (id: ProviderId) => {
        applyProviders(
            selectedProviders.includes(id)
                ? selectedProviders.filter((item) => item !== id)
                : [...selectedProviders, id]
        );
    };

    const toggleLowest = () => {
        setLowestPrice((value) => !value);
        if (step === 1) {
            setStep(2);
        }
    };

    const selectBike = (id: string) => {
        setSelectedId(id);
        setStep(3);
    };

    const goToStep = (target: number) => {
        if (target >= step || paying) {
            return;
        }
        setStep(target);
        if (target < 3) {
            setSelectedId(null);
        }
    };

    const reset = () => {
        setSelectedProviders([]);
        setLowestPrice(false);
        setSelectedId(null);
        setStep(1);
        setPayMethod("card");
        setPaying(false);
    };

    const hint =
        step === 1
            ? "Every dot is a bike from a different provider. Tap a filter or pick a bike."
            : "Pick a bike on the map or from the list.";

    return (
        <div className="demo-layout">
            <p className="demo-sr-only" role="status">
                {`Step ${step} of ${steps.length}: ${steps[step - 1].title}`}
            </p>

            <Stepper current={step} locked={paying} onSelect={goToStep} />

            <div className="demo-panel">
                <p className="demo-note">Sample data, not live bikes</p>

                {step <= 3 && (
                    <>
                        <p className="demo-hint">{hint}</p>
                        <FilterBar
                            selected={selectedProviders}
                            lowestPrice={lowestPrice}
                            onToggleProvider={toggleProvider}
                            onClearProviders={() => applyProviders([])}
                            onToggleLowest={toggleLowest}
                        />
                        <MapView
                            bikes={visibleBikes}
                            selectedId={selectedId}
                            cheapestIds={cheapestIds}
                            onSelect={selectBike}
                        />
                        <p className="demo-insight">
                            {filterActive && closestVisible.distance !== closestAll.distance ? (
                                <>
                                    Closest bike in this filter: <strong>{closestVisible.distance} m</strong>.
                                    Closest from any provider: <strong>{closestAll.distance} m</strong>.
                                </>
                            ) : (
                                <>
                                    Closest bike: <strong>{closestVisible.distance} m</strong> (
                                    {providerById(closestVisible.provider).name}).
                                </>
                            )}
                        </p>
                        <BikeList
                            bikes={sortedBikes}
                            selectedId={selectedId}
                            lowestPrice={lowestPrice}
                            onSelect={selectBike}
                        />
                        {selectedBike && step === 3 && (
                            <div className="demo-actions">
                                <p className="demo-summary">
                                    Selected: {providerById(selectedBike.provider).name}, {selectedBike.distance} m,{" "}
                                    {formatPrice(bikePrice(selectedBike))}
                                </p>
                                <button type="button" className="btn btn-primary" onClick={() => setStep(4)}>
                                    Continue to payment
                                </button>
                            </div>
                        )}
                    </>
                )}

                {step === 4 && selectedBike && (
                    <Payment
                        bike={selectedBike}
                        method={payMethod}
                        paying={paying}
                        onMethod={setPayMethod}
                        onPay={() => setPaying(true)}
                        onBack={() => setStep(3)}
                    />
                )}

                {step === 5 && selectedBike && <Unlock bike={selectedBike} onReset={reset} />}
            </div>
        </div>
    );
}