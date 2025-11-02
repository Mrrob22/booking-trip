import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import HomePage from "../pages/HomePage";
// import TourPage from "../pages/TourPage";

const router = createBrowserRouter([
    // { path: "/", element: <HomePage /> },
    // { path: "/tour/:priceId/:hotelId", element: <TourPage /> },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
