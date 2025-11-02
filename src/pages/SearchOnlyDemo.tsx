import React, {useEffect, useMemo, useState} from "react";
import SearchInput from "../components/SearchInput/SearchInput";
import ResultsGrid from "../components/Results/ResultsGrid";
import { useStore } from "../app/store";
import "../index.css";

export default function SearchOnlyDemo() {
    const {
        selected, submit, isSearching, isCancelling, cancelActive, error,
        pricesByCountry, ensureHotels, hotelsCache
    } = useStore();

    const [isLoadingHotels, setIsLoadingHotels] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await submit();
    };

    const currentCountryId =
        selected?.type === "country" ? selected.id : undefined;

    const currentPrices = useMemo(() => {
        if (!currentCountryId) return undefined;
        return pricesByCountry[currentCountryId];
    }, [currentCountryId, pricesByCountry]);

    useEffect(() => {
        const run = async () => {
            if (!currentCountryId) return;
            if (!currentPrices || Object.keys(currentPrices).length === 0) return;
            if (hotelsCache[currentCountryId]) return;
            setIsLoadingHotels(true);
            try {
                await ensureHotels(currentCountryId);
            } finally {
                setIsLoadingHotels(false);
            }
        };
        run();
    }, [currentCountryId, currentPrices, hotelsCache, ensureHotels]);

    const viewOffers = useMemo(() => {
        if (!currentCountryId || !currentPrices) return [];
        const hotels = hotelsCache[currentCountryId] ?? {};
        return Object.values(currentPrices as any).map((p: any) => {
            const h = hotels[p?.hotelID] as any;
            return {
                id: String(p?.id ?? p?.hotelID),
                hotelId: String(p?.hotelID),
                hotelName: h?.name ?? "Готель",
                country: h?.countryName ?? "",
                city: h?.cityName ?? "",
                startDate: p?.startDate ?? p?.start_date ?? "",
                price: Number(p?.amount ?? p?.price ?? 0),
                image: h?.img ?? "",
                url: p?.url ?? p?.deeplink ?? "#",
            };
        });
    }, [currentCountryId, currentPrices, hotelsCache]);

    const hasResults = viewOffers.length > 0;

    return (
        <form onSubmit={onSubmit} className="searchForm">
            <SearchInput/>
            <div className="actionsRow">
                <button
                    type="submit"
                    className="btnPrimary"
                    disabled={isSearching || isCancelling}
                >
                    {isCancelling ? "Скасовуємо…" : isSearching ? "Шукаємо..." : "Знайти"}
                </button>
                {(isSearching || isCancelling) && (
                    <button
                        type="button"
                        className="btnGhost"
                        onClick={cancelActive}
                        disabled={isCancelling}
                        title="Скасувати активний пошук"
                    >
                        {isCancelling ? "Скасовуємо..." : "Скасувати"}
                    </button>
                )}
                <button
                    type="button"
                    className="btnSecondary"
                    onClick={async () => {
                        await cancelActive();
                        await submit();
                    }}
                    disabled={isCancelling || isSearching}
                    title="Перезапустити пошук із поточними параметрами"
                >
                    Перезапустити
                </button>
            </div>
            {(isSearching || isLoadingHotels) && (
                <div className="loader">Зачекайте, триває пошук...</div>
            )}
            {error && !isSearching && (
                <div className="alert error">{error}</div>
            )}
            {!isSearching && !error && currentCountryId && (
                <>
                    {hasResults ? (
                        <ResultsGrid items={viewOffers}/>
                    ) : (
                        <div className="empty">За вашим запитом турів не знайдено.</div>
                    )}
                </>
            )}
        </form>
    );
}
