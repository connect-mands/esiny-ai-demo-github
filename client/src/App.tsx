import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ReportPage from "./pages/Report";
import { ToastContainer } from "react-toastify";

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/report/:id" element={<ReportPage />} />
            </Routes>
            <ToastContainer />
        </>

    )
}

export default App