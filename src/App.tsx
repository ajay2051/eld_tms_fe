import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/home.tsx";
import LoginPage from "./pages/login.tsx";
import Navbar from "./components/navbar.tsx";
import UserVerified from "./pages/user_verified.tsx";
import NotFound from "./pages/not_found.tsx";


// Routes where Navbar and Footer should NOT appear
const BARE_ROUTES = ["/login"];

function Layout() {
    const { pathname } = useLocation();
    const isBare = BARE_ROUTES.includes(pathname);

    return (
        <>
            {!isBare && <Navbar />}
            <Routes>
                <Route path="/"      element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/verified" element={<UserVerified />} />


                <Route path="*"        element={<NotFound />}     />
            </Routes>
            {/*{!isBare && <Footer />}*/}
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Layout />
        </BrowserRouter>
    );
}

export default App;