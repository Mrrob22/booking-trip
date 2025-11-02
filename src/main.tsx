import React from "react";
import ReactDOM from "react-dom/client";
// import AppRouter from "./app/router";
import SearchOnlyDemo from "./pages/SearchOnlyDemo";
import "./index.css";


ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <div className="container">
            <h2 className="title">Пошук турів (Завдання 1)</h2>
            <SearchOnlyDemo/>
        </div>
        {/*<AppRouter />*/}
    </React.StrictMode>
);
