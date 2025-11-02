import React from "react";
import type { OfferVM } from "./ResultsGrid";
import "./Results.css";
import { toUAH, formatUAH, formatDateUA } from "../../app/utils";

export default function ResultCard({ offer }: { offer: OfferVM }) {
    const uah = formatUAH(toUAH(offer.price, "usd"));
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
                        <div className="card__metaValue">{formatDateUA(offer.startDate)}</div>
                    </div>
                )}
                <div className="card__price">{uah}</div>
                <a
                    className="card__link"
                    href={`#/tour?priceId=${offer.id}&hotelId=${offer.hotelId}`}
                >
                    Відкрити ціну
                </a>
            </div>
        </article>
    );
}
