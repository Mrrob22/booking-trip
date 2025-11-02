import React from "react";
import ResultCard from "./ResultCard";
import "./Results.css";

export type OfferVM = {
    id: string;
    hotelId: string;
    hotelName: string;
    country: string;
    city: string;
    startDate: string;
    price: number;
    image?: string;
    url?: string;
};

export default function ResultsGrid({ items }: { items: OfferVM[] }) {
    return (
        <div className="resultsWrap">
            <div className="resultsGrid">
                {items.map((o) => (
                    <ResultCard key={`${o.hotelId}-${o.id}`} offer={o} />
                ))}
            </div>
        </div>
    );
}