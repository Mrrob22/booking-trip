import React from "react";
import { createRoot } from "react-dom/client";
import SearchOnlyDemo from "../src/pages/SearchOnlyDemo";
import TourPage from "../src/pages/TourPage";
import "./index.css";

function useHashRoute() {
    const [hash, setHash] = React.useState(window.location.hash);

    React.useEffect(() => {
        const onHash = () => setHash(window.location.hash);
        window.addEventListener("hashchange", onHash);
        return () => window.removeEventListener("hashchange", onHash);
    }, []);
    const route = hash.replace(/^#/, "");
    const [path, queryString] = route.split("?");
    const qs = new URLSearchParams(queryString || "");
    return { path: path || "/", qs };
}

function App() {
    const {path, qs} = useHashRoute();
    if (path === "/tour") {
        const priceId = qs.get("priceId") || "";
        const hotelId = qs.get("hotelId") || "";
        return  <div className="container">
                    <TourPage priceId={priceId} hotelId={hotelId}/>
                </div>

    }
    return  <div className="container">
                <SearchOnlyDemo/>
            </div>
    }

createRoot(document.getElementById("root")!).render(<App/>);
