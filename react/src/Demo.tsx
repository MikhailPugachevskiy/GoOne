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