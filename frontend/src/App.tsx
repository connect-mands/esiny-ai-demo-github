import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ReportPage from "./pages/Report";
import { Toaster } from "sonner";

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/report/:id" element={<ReportPage />} />
            </Routes>
            <Toaster position="top-center" richColors/>
        </>

    )
}

export default App