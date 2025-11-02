import React from "react";
import SearchInput from "../components/SearchInput/SearchInput";
import { useStore } from "../app/store";
import "../index.css";

export default function SearchOnlyDemo() {
    const {
        selected, submit, isSearching, isCancelling, cancelActive, error, pricesByCountry
    } = useStore();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await submit();
    };

    const currentCountryId = selected?.type === "country" ? selected.id : undefined;
    const currentPrices = currentCountryId ? pricesByCountry[currentCountryId] : undefined;
    const hasResults = !!currentPrices && Object.keys(currentPrices).length > 0;

    return (
        <form onSubmit={onSubmit} className="searchForm">
            <SearchInput />

            <div className="actionsRow">
                <button type="submit" className="btnPrimary" disabled={isSearching || isCancelling}>
                    {isSearching ? "Шукаємо..." : "Знайти"}
                </button>

                {isSearching && (
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
            </div>
            {isSearching && <div className="loader">Зачекайте, триває пошук...</div>}
            {error && !isSearching && (
                <div className="alert error">{error}</div>
            )}
            {!isSearching && !error && currentCountryId && !hasResults && (
                <div className="empty">За вашим запитом турів не знайдено.</div>
            )}
            {!isSearching && !error && hasResults && (
                <div className="ok">
                    <strong>Знайдено тури:</strong>
                    <div>Кількість пропозицій: {Object.keys(currentPrices!).length}</div>
                </div>
            )}
        </form>
    );
}
