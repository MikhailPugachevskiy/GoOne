/* Shared motion for every chapter page: scroll reveal for cards and count-up for big numbers */
function initMotion(): void {
    /* Respect users who prefer less motion, and skip browsers without the needed API */
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
        return;
    }

    /* Count-up: only values with exactly one number of 10 or more are animated (e.g. 40.4%, 1,250+, N = 104) */
    const numberPattern = /\d[\d,]*(?:\.\d+)?/g;

    const prepareCounter = (el: HTMLElement): (() => void) | null => {
        const text = el.textContent ?? "";
        const matches = text.match(numberPattern);
        if (!matches || matches.length !== 1) {
            return null;
        }

        const token = matches[0];
        const target = parseFloat(token.replace(/,/g, ""));
        if (target < 10) {
            return null;
        }

        /* Keep the text around the number (for example "N = " or "%") and its number format */
        const position = text.indexOf(token);
        const prefix = text.slice(0, position);
        const suffix = text.slice(position + token.length);
        const decimals = token.includes(".") ? token.split(".")[1].length : 0;
        const useGrouping = token.includes(",");

        const format = (value: number): string =>
            value.toLocaleString("en-US", {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
                useGrouping
            });

        /* Fixed-width digits stop the text from jittering while it counts */
        el.style.fontVariantNumeric = "tabular-nums";
        el.textContent = prefix + format(0) + suffix;

        return (): void => {
            const duration = 1400;
            const began = performance.now();

            const step = (now: number): void => {
                const progress = Math.min((now - began) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = progress < 1 ? prefix + format(target * eased) + suffix : text;
                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            };

            requestAnimationFrame(step);
        };
    };

    /* Each counter starts once, when its number is mostly visible */
    const counters = new Map<Element, () => void>();
    document.querySelectorAll<HTMLElement>(".proof-value").forEach((el) => {
        const start = prepareCounter(el);
        if (start) {
            counters.set(el, start);
        }
    });

    const counterObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }
                counters.get(entry.target)?.();
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.6 }
    );
    counters.forEach((_start, el) => counterObserver.observe(el));

    /* Scroll reveal: cards stay hidden until they enter the viewport, then fade up once */
    const cards = document.querySelectorAll<HTMLElement>(".proof-card, .teaser-card, .founder-chip");
    cards.forEach((card) => {
        card.style.opacity = "0";
    });

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                const card = entry.target as HTMLElement;

                /* Stagger cards in the same row or grid by their position, capped so late cards do not wait long */
                const siblings = card.parentElement ? Array.from(card.parentElement.children) : [card];
                const delay = Math.min(siblings.indexOf(card), 4) * 90;

                /* The Web Animations API leaves no leftover styles, so the CSS hover effects keep working */
                card.animate(
                    [
                        { opacity: 0, transform: "translateY(18px)" },
                        { opacity: 1, transform: "translateY(0)" }
                    ],
                    { duration: 600, delay, easing: "ease-out", fill: "backwards" }
                );
                card.style.opacity = "";
                observer.unobserve(card);
            });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    cards.forEach((card) => revealObserver.observe(card));
}

initMotion();
