import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, Home, LogIn, UserPlus, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = user ? [
        { path: '/', label: 'Home', icon: Home },
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ] : [
        { path: '/', label: 'Home', icon: Home },
        { path: '/login', label: 'Login', icon: LogIn },
        { path: '/register', label: 'Register', icon: UserPlus },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-4 bg-dark/50 backdrop-blur-md border-b border-white/10' : 'py-6 bg-transparent'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="p-2 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg group-hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-shadow duration-300">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:from-cyan-400 group-hover:to-blue-400 transition-all duration-300">
                        FakeJob<span className="text-cyan-500">Detector</span>
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${isActive
                                        ? 'text-cyan-400 bg-white/10 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="font-medium">{link.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-glow"
                                            className="absolute inset-0 rounded-full bg-cyan-400/20 blur-sm -z-10"
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                    {user && (
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="font-medium">Logout</span>
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
