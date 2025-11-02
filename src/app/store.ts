import { create } from "zustand";
import type { CountriesMap, GeoResponse, PricesMap, HotelsMap, StartSearchResponse } from "./types";
import { unwrap } from "../api/http";
import {
    getCountries, searchGeo, startSearchPrices, getSearchPrices,
    stopSearchPrices, getHotels
} from "../api/api";
import { includesNormalized } from "./utils";

type GeoType = "country" | "city" | "hotel";

type Selected = { type: GeoType; id: string; label: string } | null;

type SearchState = {
    countries?: CountriesMap;
    query: string;
    selected: Selected;
    lastGeoQuery: string;
    geoReqSeq: number;
    activeToken?: string;
    isSearching: boolean;
    isCancelling: boolean;
    error?: string;
    pricesByCountry: Record<string, PricesMap>;
    hotelsCache: Record<string, HotelsMap>;
    geo?: GeoResponse;
    loadCountries(): Promise<void>;
    setQuery(s: string): void;
    searchGeo(query: string): Promise<void>;
    select(entity: { type: GeoType; id: string; label: string }): void;
    submit(): Promise<void>;
    cancelActive(): Promise<void>;
    ensureHotels(countryId: string): Promise<HotelsMap>;
};

export const useStore = create<SearchState>((set, get) => ({
    countries: undefined,
    query: "",
    selected: null,
    activeToken: undefined,
    isSearching: false,
    isCancelling: false,
    error: undefined,
    pricesByCountry: {},
    hotelsCache: {},
    geo: undefined,
    lastGeoQuery: "",
    geoReqSeq: 0,

    async loadCountries() {
        const data = await unwrap<CountriesMap>(await getCountries());
        set({ countries: data });
    },

    setQuery(s) {
        set({ query: s });
    },

    async searchGeo(q) {
        const reqId = get().geoReqSeq + 1;
        set({ geoReqSeq: reqId });
        const data = await unwrap<GeoResponse>(await searchGeo(q));
        if (get().geoReqSeq === reqId) {
            const filtered: GeoResponse = {};
            if (q) {
                for (const k of Object.keys(data)) {
                    const e: any = data[k];
                    if (e?.name && includesNormalized(e.name, q)) {
                        filtered[k] = e;
                    }
                }
            }
            set({
                geo: q ? filtered : data,
                lastGeoQuery: q
            });
        }
    },

    select({ type, id, label }) {
        set({ selected: { type, id, label }, query: label, geo: undefined });
    },

    async ensureHotels(countryId) {
        const { hotelsCache } = get();
        if (hotelsCache[countryId]) return hotelsCache[countryId];

        const data = await unwrap<HotelsMap>(await getHotels(countryId));
        set({ hotelsCache: { ...get().hotelsCache, [countryId]: data } });
        return data;
    },

    async cancelActive() {
        const token = get().activeToken;
        if (!token) return;
        set({ isCancelling: true, error: undefined });
        try {
            await unwrap(await stopSearchPrices(token));
        } catch {

        } finally {
            set({ isCancelling: false, activeToken: undefined, isSearching: false });
        }
    },

    async submit() {
        const sel = get().selected;
        set({ error: undefined });
        if (!sel || sel.type !== "country") {
            set({ error: "Оберіть країну для пошуку турів." });
            return;
        }
        if (get().activeToken) {
            await get().cancelActive();
        }

        set({ isSearching: true, error: undefined });

        let start: StartSearchResponse;
        try {
            start = await unwrap<StartSearchResponse>(await startSearchPrices(sel.id));
        } catch (e: any) {
            set({ isSearching: false, error: e?.message || "Помилка запуску пошуку" });
            return;
        }

        const token = start.token;
        set({ activeToken: token });

        const waitUntil = async (iso: string) => {
            const ms = Math.max(0, new Date(iso).getTime() - Date.now());
            await new Promise(res => setTimeout(res, ms));
        };

        let retriesLeft = 2;
        while (true) {
            if (get().activeToken !== token) return;

            await waitUntil(start.waitUntil);

            try {
                const { prices } = await unwrap<{ prices: PricesMap }>(await getSearchPrices(token));
                set({
                    pricesByCountry: {
                        ...get().pricesByCountry,
                        [sel.id]: prices
                    },
                    isSearching: false
                });
                return;
            } catch (e: any) {
                const status = e?.status;
                const payload = e?.payload;
                if (status === 425 && payload?.waitUntil) {
                    start.waitUntil = payload.waitUntil;
                    continue;
                }
                if (retriesLeft > 0) {
                    retriesLeft -= 1;
                    await new Promise(res => setTimeout(res, 600));
                    continue;
                }
                set({ isSearching: false, error: e?.message || "Сталася помилка під час пошуку" });
                return;
            }
        }
    },
}));
