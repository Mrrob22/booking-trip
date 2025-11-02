import React from "react";
import SearchInput from "../components/SearchInput/SearchInput";
import { useStore } from "../app/store";
import "../index.css";

export default function SearchOnlyDemo() {
    const { selected } = useStore();

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submit", selected);
    };

    return (
        <form onSubmit={onSubmit} className="searchForm">
            <SearchInput />
            <button type="submit" className="btnPrimary">Знайти</button>
        </form>
    );
}
