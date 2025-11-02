import React from "react";
import type { OfferVM } from "./ResultsGrid";
import "./Results.css";

function formatDate(s: string) {
    if (!s) return "";
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return s;
    return d.toLocaleDateString("uk-UA");
}
function formatMoney(n: number) {
    try {
        return new Intl.NumberFormat("uk-UA", {
            style: "currency",
            currency: "UAH",
            maximumFractionDigits: 0,
        }).format(n);
    } catch {
        return `${(n ?? 0).toLocaleString("uk-UA")} грн`;
    }
}

export default function ResultCard({ offer }: { offer: OfferVM }) {
    return (
        <article className="card">
            {offer.image ? (
                <img src={offer.image} className="card__img" alt={offer.hotelName} />
            ) : (
                <div className="card__img card__img--placeholder" />
            )}
            <div className="card__body">
                <h3 className="card__title">{offer.hotelName}</h3>
                <div className="card__location">
                    <span className="card__flag" aria-hidden>🌍</span>
                    <span>
                        {offer.country}{offer.city ? `, ${offer.city}` : ""}
                    </span>
                </div>
                {offer.startDate && (
                    <div className="card__meta">
                        <div className="card__metaLabel">Старт туру</div>
                        <div className="card__metaValue">{formatDate(offer.startDate)}</div>
                    </div>
                )}
                <div className="card__price">{formatMoney(offer.price)}</div>
                <a className="card__link" href={offer.url || "#"} target="_blank" rel="noreferrer">
                    Відкрити ціну
                </a>
            </div>
        </article>
    );
}
