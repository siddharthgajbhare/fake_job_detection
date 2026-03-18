import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import GlassCard from '../components/GlassCard';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [jobDescription, setJobDescription] = useState('');
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
            const { data } = await client.post('/predict/', { job_description: jobDescription });
            setPrediction(data);
            await fetchHistory(); // Refresh history
        } catch (error) {
            console.error("Prediction failed");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen p-4 pt-24 max-w-7xl mx-auto">
            <Navbar />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Prediction Section */}
                <div className="space-y-6">
                    <GlassCard>
                        <h2 className="text-2xl font-bold mb-4">Analyze Job Post</h2>
                        <textarea
                            className="w-full glass-input p-4 rounded-xl min-h-[200px] resize-none"
                            placeholder="Paste the job description here..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                        <button
                            onClick={handlePredict}
                            disabled={loading || !jobDescription}
                            className={`w-full glass-btn py-3 rounded-xl mt-4 flex items-center justify-center gap-2 ${loading ? 'opacity-70' : ''}`}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Detect Fake Job'}
                        </button>
                    </GlassCard>

                    <AnimatePresence>
                        {prediction && (
                            <GlassCard className={`border-l-4 ${prediction.prediction_result === 'Fake' ? 'border-red-500' : 'border-green-500'}`}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="text-center"
                                >
                                    <div className={`text-6xl mb-2 flex justify-center ${prediction.prediction_result === 'Fake' ? 'text-red-400' : 'text-green-400'}`}>
                                        {prediction.prediction_result === 'Fake' ? <AlertTriangle size={64} /> : <CheckCircle size={64} />}
                                    </div>
                                    <h3 className="text-3xl font-bold mb-2">
                                        {prediction.prediction_result === 'Fake' ? 'Likely Fake' : 'Likely Real'}
                                    </h3>
                                    <div className="w-full bg-gray-700/50 rounded-full h-4 mt-4 overflow-hidden relative">
                                        <div
                                            className={`h-full transition-all duration-1000 ${prediction.prediction_result === 'Fake' ? 'bg-red-500' : 'bg-green-500'}`}
                                            style={{ width: `${prediction.confidence_score * 100}%` }}
                                        />
                                    </div>
                                    <p className="mt-2 text-sm text-gray-400">Confidence Score: {(prediction.confidence_score * 100).toFixed(1)}%</p>
                                </motion.div>
                            </GlassCard>
                        )}
                    </AnimatePresence>
                </div>

                {/* History Section */}
                <div>
                    <GlassCard className="h-full max-h-[600px] overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Prediction History</h2>
                            <span className="text-sm text-gray-400">{history.length} scans</span>
                        </div>

                        <div className="overflow-y-auto pr-2 space-y-3 flex-1 custom-scrollbar">
                            {history.length === 0 ? (
                                <p className="text-center text-gray-500 mt-10">No history found.</p>
                            ) : (
                                history.map((item, idx) => (
                                    <div key={idx} className="bg-white/5 p-4 rounded-lg border border-white/5 hover:bg-white/10 transition flex justify-between items-center">
                                        <div className="truncate flex-1 pr-4">
                                            <p className="text-sm text-gray-300 truncate">{item.job_description || "No description"}</p>
                                            <p className="text-xs text-gray-500 mt-1">{new Date(item.created_at).toLocaleString()}</p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${item.prediction_result === 'Fake' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                                            {item.prediction_result}
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
