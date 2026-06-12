import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/home.tsx";
import LoginPage from "./pages/login.tsx";
import Navbar from "./components/navbar.tsx";
import UserVerified from "./pages/user_verified.tsx";
import NotFound from "./pages/not_found.tsx";
import RegisterPage from "./pages/register.tsx";
import ForgotPasswordConfirmPage from "./pages/forgot_password_confirm.tsx";
import ForgotPasswordPage from "./pages/forgot_password.tsx";
import RoutePage from "./pages/routecreate.tsx";
import DriverLogPage from "./pages/driverlog.tsx";
import Dashboard from "./pages/dashboard.tsx";
import StartTrial from "./pages/trial.tsx";
import FleetTrackingPage from "./pages/fleet_tracking.tsx";
import ELDCompliancePage from "./pages/eld_compliance.tsx";
import LoadManagementPage from "./pages/load_management.tsx";
import OwnerOperatorsPage from "./pages/owner_operators.tsx";
import FleetsPage from "./pages/fleets.tsx";
import BrokersPage from "./pages/brokers.tsx";
import DocumentationPage from "./pages/docs.tsx";
import BlogPage from "./pages/blog.tsx";
import SupportPage from "./pages/support.tsx";
import AboutPage from "./pages/about.tsx";
import CareersPage from "./pages/careers.tsx";
import ContactPage from "./pages/contact.tsx";
import PrivacyPolicyPage from "./pages/privacy.tsx";
import TermsOfServicePage from "./pages/terms.tsx";


// Routes where Navbar and Footer should NOT appear
const BARE_ROUTES = ["/login", "/register", "/forgot-password",
    "/forgot-password-confirm", "/route", "/driver-log", "/dashboard", "/eld-compliance"];

function Layout() {
    const { pathname } = useLocation();
    const isBare = BARE_ROUTES.includes(pathname);

    return (
        <>
            {!isBare && <Navbar />}
            <Routes>
                <Route path="/"      element={<Home />}/>
                <Route path="/login" element={<LoginPage />}/>
                <Route path="/register"  element={<RegisterPage />}/>
                <Route path="/verified" element={<UserVerified />}/>
                <Route path="/forgot-password" element={<ForgotPasswordPage />}/>
                <Route path="/forgot-password-confirm"  element={<ForgotPasswordConfirmPage />}/>
                <Route path="/forgot-password-confirm/" element={<ForgotPasswordConfirmPage />}/>
                <Route path="/route"                    element={<RoutePage />} />
                <Route path="/driver-log"               element={<DriverLogPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/start-trial"              element={<StartTrial />} />
                <Route path="/fleet-tracking"              element={<FleetTrackingPage />} />
                <Route path="/eld-compliance"              element={<ELDCompliancePage />} />
                <Route path="/load-management"              element={<LoadManagementPage />} />
                <Route path="/owner-operators" element={<OwnerOperatorsPage />} />
                <Route path="/fleets" element={<FleetsPage />} />
                <Route path="/brokers" element={<BrokersPage />} />
                <Route path="/docs" element={<DocumentationPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsOfServicePage />} />

                <Route path="*"        element={<NotFound />}/>
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