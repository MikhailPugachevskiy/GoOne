import { useMemo } from "react";
import { hashString, providerById } from "./data";
import type { Bike } from "./data";

interface UnlockProps {
    bike: Bike;
    onReset: () => void;
}

const GRID = 21;
const QUIET = 2;

/* Seeded random numbers, so the same bike always shows the same demo QR pattern */
function mulberry32(seed: number): () => number {
    let state = seed;
    return () => {
        state = (state + 0x6d2b79f5) >>> 0;
        let t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/* Position inside one of the three 7x7 corner squares, or null for the data area */
function finderLocal(x: number, y: number): { lx: number; ly: number } | null {
    const origins = [
        { ox: 0, oy: 0 },
        { ox: GRID - 7, oy: 0 },
        { ox: 0, oy: GRID - 7 }
    ];
    for (const { ox, oy } of origins) {
        const lx = x - ox;
        const ly = y - oy;
        if (lx >= 0 && lx < 7 && ly >= 0 && ly < 7) {
            return { lx, ly };
        }
    }
    return null;
}

function buildCells(seed: number): Array<{ x: number; y: number }> {
    const random = mulberry32(seed);
    const cells: Array<{ x: number; y: number }> = [];

    for (let y = 0; y < GRID; y += 1) {
        for (let x = 0; x < GRID; x += 1) {
            const finder = finderLocal(x, y);
            const filled = finder
                ? finder.lx === 0 ||
                finder.lx === 6 ||
                finder.ly === 0 ||
                finder.ly === 6 ||
                (finder.lx >= 2 && finder.lx <= 4 && finder.ly >= 2 && finder.ly <= 4)
                : random() > 0.5;
            if (filled) {
                cells.push({ x, y });
            }
        }
    }
    return cells;
}