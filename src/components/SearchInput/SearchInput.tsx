import React, { useEffect, useRef, useState } from "react";
import { Input } from "../UI/Input";
import SearchDropdown from "./SearchDropdown";
import { useStore } from "../../app/store";
import type { CountriesMap } from "../../app/types";
import "./SearchInput.css";

export default function SearchInput() {
    const {
        countries, loadCountries, query, setQuery,
        geo, searchGeo, select, lastGeoQuery, selected
    } = useStore();

    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<number | null>(null);

    useEffect(() => { loadCountries(); }, [loadCountries]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        setQuery(v);
        setOpen(true);

        if (debounceRef.current !== null) {
            window.clearTimeout(debounceRef.current);
        }

        debounceRef.current = window.setTimeout(() => {
            searchGeo(v);
        }, 200);
    };

    const onFocus = async () => {
        setOpen(true);
        if (selected?.type === "country") {
            return;
        }
        if (query) {
            await searchGeo(query);
        } else if (lastGeoQuery) {
            await searchGeo(lastGeoQuery);
        }
    };

    const clearQuery = () => {
        setQuery("");
        setOpen(true);
    };

    const countriesFallback = countries
        ? Object.values(countries as CountriesMap).map(c => ({ id: c.id, name: c.name, flag: c.flag }))
        : [];

    const pick = (type: "country"|"city"|"hotel", id: string, label: string) => {
        select({ type, id, label });
        setOpen(false);
        inputRef.current?.blur();
    };

    return (
        <div className="search">
            <div className="search__inputWrap">
                <Input
                    ref={inputRef}
                    placeholder="Куди поїхати?"
                    value={query}
                    onChange={onChange}
                    onFocus={onFocus}
                    onClick={onFocus}
                    className="search__input"
                />
                {query && (
                    <button className="search__clear" onClick={clearQuery} aria-label="Очистити">
                        ×
                    </button>
                )}
            </div>

            <SearchDropdown
                open={open}
                items={geo}
                countriesFallback={countriesFallback}
                onPick={pick}
                query={query}
            />
        </div>
    );
}
