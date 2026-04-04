import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import GlassCard from '../components/ui/GlassCard';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Trash2, CheckCircle, AlertTriangle, Info, ShieldAlert, Cpu, Activity } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [requirements, setRequirements] = useState('');
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const { data } = await client.get('/predict/history');
            setHistory(data);
        } catch (error) {
            console.error("Failed to fetch history");
        }
    };

    const handlePredict = async () => {
        if (!jobDescription.trim()) return;
        setLoading(true);
        setPrediction(null);
        try {
            const { data } = await client.post('/predict/', { 
                job_description: jobDescription,
                job_title: jobTitle,
                requirements: requirements
            });
            setPrediction(data);
            await fetchHistory(); // Refresh history
        } catch (error) {
            console.error("Prediction failed");
        }
        setLoading(false);
    };

    const getConfidenceColor = (level) => {
        switch(level) {
            case 'HIGH': return 'text-green-400 border-green-500/30 bg-green-500/10';
            case 'MEDIUM': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
            case 'LOW': return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
            default: return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
        }
    }

    return (
        <div className="min-h-screen p-4 pt-28 md:pt-32 max-w-7xl mx-auto pb-12">
            <Navbar />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Prediction Section */}
                <div className="space-y-6">
                    <GlassCard className="p-6 md:p-8">
                        <div className="flex items-center gap-2 mb-6">
                            <Cpu className="text-cyan-400" size={24} />
                            <h2 className="text-xl md:text-2xl font-bold">Smart Job Analysis</h2>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1 block">Job Title</label>
                                <input
                                    type="text"
                                    className="w-full glass-input p-3 rounded-xl text-sm md:text-base mb-2"
                                    placeholder="e.g., Senior Java Developer"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1 block">Job Description</label>
                                <textarea
                                    className="w-full glass-input p-4 rounded-xl min-h-[120px] resize-none text-sm md:text-base"
                                    placeholder="Paste the main job description here..."
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1 block">Requirements (Optional)</label>
                                <textarea
                                    className="w-full glass-input p-4 rounded-xl min-h-[100px] resize-none text-sm md:text-base"
                                    placeholder="Paste job requirements/skills here..."
                                    value={requirements}
                                    onChange={(e) => setRequirements(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handlePredict}
                            disabled={loading || !jobDescription}
                            className={`w-full glass-btn py-3 md:py-4 rounded-xl mt-6 flex items-center justify-center gap-2 ${loading ? 'opacity-70' : ''}`}
                        >
                            {loading ? <Loader2 className="animate-spin text-cyan-400" /> : 'Run Neural Analysis'}
                        </button>
                    </GlassCard>

                    <AnimatePresence>
                        {prediction && (
                            <GlassCard className={`p-6 md:p-8 border-l-4 ${prediction.prediction_result === 'Fake' ? 'border-red-500' : prediction.prediction_result === 'Unknown' ? 'border-gray-500' : prediction.prediction_result === 'Invalid' ? 'border-purple-500' : 'border-green-500'}`}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-4 rounded-2xl ${prediction.prediction_result === 'Fake' ? 'bg-red-500/20 text-red-400' : prediction.prediction_result === 'Unknown' ? 'bg-gray-500/20 text-gray-400' : prediction.prediction_result === 'Invalid' ? 'bg-purple-500/20 text-purple-400' : 'bg-green-500/20 text-green-400'}`}>
                                                {prediction.prediction_result === 'Fake' ? <ShieldAlert size={40} /> : prediction.prediction_result === 'Unknown' ? <AlertTriangle size={40} /> : prediction.prediction_result === 'Invalid' ? <Info size={40} /> : <CheckCircle size={40} />}
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
                                                    {prediction.prediction_result === 'Fake' ? 'Likely Fake' : prediction.prediction_result === 'Unknown' ? 'System Offline' : prediction.prediction_result === 'Invalid' ? 'Unrecognized Format' : 'Likely Real'}
                                                </h3>
                                                <div className={`mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${getConfidenceColor(prediction.confidence_level)}`}>
                                                    {prediction.confidence_level} CONFIDENCE
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right w-full md:w-auto">
                                            <p className="text-xs text-gray-400 mb-1">Signal strength</p>
                                            <div className="w-full md:w-32 bg-white/5 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-1000 ${prediction.prediction_result === 'Fake' ? 'bg-red-500' : prediction.prediction_result === 'Unknown' || prediction.prediction_result === 'Invalid' ? 'bg-gray-500' : 'bg-green-500'}`}
                                                    style={{ width: `${prediction.confidence_score * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {prediction.explanation && prediction.explanation.length > 0 && (
                                        <div className="mt-6 pt-6 border-t border-white/10">
                                            <h4 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2 leading-none">
                                                <Info size={16} className="text-cyan-400" />
                                                WHY THIS RESULT?
                                            </h4>
                                            <ul className="space-y-2">
                                                {prediction.explanation.map((reason, idx) => (
                                                    <li key={idx} className="text-sm text-gray-400 bg-white/5 p-3 rounded-lg border border-white/5 flex items-start gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                                                        {reason}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </motion.div>
                            </GlassCard>
                        )}
                    </AnimatePresence>
                </div>

                {/* History Section */}
                <div className="h-full">
                    <GlassCard className="h-full max-h-[600px] md:max-h-[800px] overflow-hidden flex flex-col p-6 md:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl md:text-2xl font-bold">Recent Scans</h2>
                            <span className="text-xs md:text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">{history.length} signals tracked</span>
                        </div>

                        <div className="overflow-y-auto pr-2 space-y-3 flex-1 custom-scrollbar">
                            {history.length === 0 ? (
                                <div className="text-center text-gray-500 mt-20 flex flex-col items-center gap-3">
                                    <Activity className="opacity-20" size={48} />
                                    <p className="text-sm">Wait for initial pulse...</p>
                                </div>
                            ) : (
                                history.map((item, idx) => (
                                    <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition group">
                                        <div className="flex justify-between items-start gap-4 mb-2">
                                            <div className="truncate flex-1">
                                                <h4 className="text-sm font-bold text-white truncate">{item.job_title || "Unknown Title"}</h4>
                                                <p className="text-[#888] text-[10px] sm:text-xs mt-1 truncate">{item.job_description}</p>
                                            </div>
                                            <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase shrink-0 ${item.prediction_result === 'Fake' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-green-500/20 text-green-300 border border-green-500/30'}`}>
                                                {item.prediction_result}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-[10px] text-gray-500">
                                            <span>{new Date(item.created_at).toLocaleString()}</span>
                                            {item.confidence_level && (
                                                <span className="font-bold opacity-60 italic">{item.confidence_level} CONFIDENCE</span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
