import React from "react";
import { unwrap } from "../api/http";
import { getHotel, getPrice } from "../api/api";
import { toUAH, formatUAH, formatDateUA } from "../app/utils";
import "./tour.css";

type Props = { priceId: string; hotelId: string };

const serviceIcons: Record<string, string> = {
    wifi: "📶",
    aquapark: "🏊",
    pool: "🏊",
    swimming_pool: "🏊",
    parking: "🅿️",
    laundry: "🧺",
    tennis_court: "🎾",
    meal: "🍽️",
    food: "🍽️",
};

export default function TourPage({ priceId, hotelId }: Props) {
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string>();
    const [hotel, setHotel] = React.useState<any>();
    const [price, setPrice] = React.useState<any>();

    React.useEffect(() => {
        let alive = true;
        (async () => {
            setLoading(true);
            setError(undefined);
            try {
                const [h, p] = await Promise.all([
                    unwrap<any>(await getHotel(Number(hotelId))),
                    unwrap<any>(await getPrice(priceId)),
                ]);
                if (!alive) return;
                setHotel(h);
                setPrice(p);
            } catch (e: any) {
                if (!alive) return;
                setError(e?.message || "Не вдалося завантажити тур");
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, [priceId, hotelId]);

    if (loading) return <div className="tourWrap">
        <div className="loader">Завантаження…</div>
    </div>;
    if (error) return <div className="tourWrap">
        <div className="alert error">{error}</div>
    </div>;
    if (!hotel || !price) return <div className="tourWrap">
        <div className="empty">Немає даних по туру.</div>
    </div>;

    const currency = (price.currency || "usd").toLowerCase();
    const total = Number(price.amount ?? price.price ?? 0);

    const totalUAH = formatUAH(toUAH(total, currency));

    const services: Record<string, string> = hotel.services || {};
    const serviceEntries = Object.entries(services);

    return (
        <div className="tourWrap">
            <button className="btnGhost" onClick={() => history.back()}>← Назад</button>

            <article className="tourCard">
                <header className="tourHeader">
                    <h1 className="tourTitle">{hotel.name}</h1>
                    <div className="tourLocation">
                        <span className="tourLocIcon" aria-hidden>📍</span>
                        <span>{hotel.countryName}{hotel.cityName ? `, ${hotel.cityName}` : ""}</span>
                    </div>
                </header>

                <div className="tourImage">
                    {hotel.img ? (
                        <img src={hotel.img} alt={hotel.name} />
                    ) : (
                        <div className="tourImage--ph" />
                    )}
                </div>

                {hotel.description && (
                    <section className="tourSection">
                        <h3 className="tourSectionTitle">Опис</h3>
                        <p className="tourText">{hotel.description}</p>
                    </section>
                )}

                {serviceEntries.length > 0 && (
                    <section className="tourSection">
                        <h3 className="tourSectionTitle">Сервіси</h3>
                        <ul className="services">
                            {serviceEntries.map(([key, val]) => (
                                <li key={key} className="serviceTag">
                                    <span className="serviceIcon" aria-hidden>
                                        {serviceIcons[key] || "•"}
                                    </span>
                                    <span>
                                        {key.replace(/_/g, " ")}{val && val !== "yes" && val !== "true" ? `: ${val}` : ""}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                <hr className="tourDivider" />

                <section className="tourBottom">
                    <div className="tourDates">
                        <span className="tourDateIcon" aria-hidden>📅</span>
                        <div>
                            <div className="tourDateLabel">Старт туру</div>
                            <div className="tourDateValue">{formatDateUA(price.startDate)}</div>
                        </div>
                    </div>

                    <div className="tourPrice">{totalUAH}</div>

                    <a className="btnPrimary" href={price.url || "#"} target="_blank" rel="noreferrer">
                        Відкрити ціну
                    </a>
                </section>
            </article>
        </div>
    );
}