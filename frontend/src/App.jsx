import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ThreeBackground from './components/ThreeBackground';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <div className="relative min-h-screen">
            {/* <ThreeBackground /> */}
            <Navbar />
            <div className="pt-24 px-4 container mx-auto">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Route>
                </Routes>
            </div>
        </div>
    );
}

export default App;


