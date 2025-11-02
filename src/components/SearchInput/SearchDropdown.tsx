import React from "react";
import type { GeoResponse } from "../../app/types";
import { includesNormalized } from "../../app/utils";
import "./SearchDropdown.css";

type Props = {
    open: boolean;
    items?: GeoResponse | null;
    countriesFallback?: { id: string; name: string; flag?: string }[];
    query?: string;
    onPick: (type: "country" | "city" | "hotel", id: string, label: string) => void;
};

export default function SearchDropdown({
                                           open,
                                           items,
                                           countriesFallback,
                                           query = "",
                                           onPick
                                       }: Props) {
    if (!open) return null;

    const merged: Array<{ id: string; type: "country" | "city" | "hotel"; label: string }> = [];

    if (items) {
        for (const k of Object.keys(items)) {
            const e: any = items[k];
            if (e?.name) {
                merged.push({
                    id: String(e.id),
                    type: e.type,
                    label: e.name,
                });
            }
        }
    }

    if (countriesFallback) {
        for (const c of countriesFallback) {
            merged.push({
                id: c.id,
                type: "country",
                label: c.name,
            });
        }
    }

    const dedup = new Map<string, typeof merged[0]>();
    merged.forEach(e => dedup.set(`${e.type}-${e.id}`, e));

    const filtered = Array.from(dedup.values())
        .filter(e => query ? includesNormalized(e.label, query) : true)
        .sort((a, b) => a.label.localeCompare(b.label));

    if (!filtered.length) return null;

    return (
        <div className="dropdown">
            {filtered.map(e => (
                <button
                    key={`${e.type}-${e.id}`}
                    className="dropdown__item"
                    onClick={() => onPick(e.type, e.id, e.label)}
                >
                <span className="dropdown__icon">
                {e.type === "country" ? "🌍" : e.type === "city" ? "📍" : "🏨"}
                </span>
                <span className="dropdown__label">{e.label}</span>
                </button>
            ))}
        </div>
    );
}
