import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MovieDetail from "./pages/MovieDetail";
import Trending from "./pages/Trending";
import Profile from "./pages/Profile";
import { useAuth } from "./context/AuthContext";
import "./App.css";

function AppContent() {
    const { loading } = useAuth();

    if (loading) {
        return <div className="loading-screen">Loading...</div>;
    }

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/trending" element={<Trending />} />
                <Route path="/search" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/movie/:id" element={<MovieDetail />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <AppContent />
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
