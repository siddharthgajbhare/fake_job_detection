import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, BrainCircuit, Lock, ChevronRight, Activity } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import { useAuth } from '../context/AuthContext';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100
        }
    }
};

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] text-center px-4">

            {/* Hero Section */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-5xl mx-auto mt-20"
            >
                <motion.div variants={itemVariants} className="mb-6 flex justify-center">
                    <span className="px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium tracking-wide flex items-center gap-2">
                        <Activity size={14} className="animate-pulse" />
                        AI-POWERED FRAUD DETECTION
                    </span>
                </motion.div>

                <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-tight">
                    Detect <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-glow">Fake Jobs</span>
                    <br /> With Precision
                </motion.h1>

                <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                    Protect your career with our state-of-the-art Bi-LSTM neural network.
                    Analyze job descriptions in real-time and uncover hidden fraud patterns.
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-24">
                    <Link to={user ? "/dashboard" : "/register"} className="glass-btn group flex items-center gap-3 text-lg">
                        {user ? "Go to Dashboard" : "Start Detection Free"}
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to={user ? "/dashboard" : "/login"} className="px-8 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-gray-300 hover:text-white font-medium text-lg">
                        {user ? "New Analysis" : "View Live Demo"}
                    </Link>
                </motion.div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mb-20 px-4"
            >
                <GlassCard className="flex flex-col items-start text-left h-full">
                    <div className="p-3 rounded-lg bg-blue-500/20 mb-4">
                        <BrainCircuit size={32} className="text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white">Bi-LSTM Neural Core</h3>
                    <p className="text-gray-400 leading-relaxed">
                        Our advanced Deep Learning model understands context and semantics, not just keywords, to catch sophisticated scams.
                    </p>
                </GlassCard>

                <GlassCard className="flex flex-col items-start text-left h-full">
                    <div className="p-3 rounded-lg bg-cyan-500/20 mb-4">
                        <ShieldCheck size={32} className="text-cyan-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white">98.5% Accuracy</h3>
                    <p className="text-gray-400 leading-relaxed">
                        Trained on a massive dataset of real and fake job postings to ensure you never miss a red flag.
                    </p>
                </GlassCard>

                <GlassCard className="flex flex-col items-start text-left h-full">
                    <div className="p-3 rounded-lg bg-purple-500/20 mb-4">
                        <Lock size={32} className="text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white">Private & Secure</h3>
                    <p className="text-gray-400 leading-relaxed">
                        Your data is processed anonymously and incorrectly. Just print safe results. Zero data retention policy.
                    </p>
                </GlassCard>
            </motion.div>

            {/* Stats/Social Proof (Visual Filler) */}
            <div className="w-full max-w-4xl border-t border-white/10 pt-10 mb-20 flex justify-between items-center text-gray-500 text-sm font-mono uppercase tracking-widest">
                <span>Processed 1M+ Jobs</span>
                <span>•</span>
                <span>Real-time Analysis</span>
                <span>•</span>
                <span>Global Coverage</span>
            </div>
        </div>
    );
};

export default Home;
