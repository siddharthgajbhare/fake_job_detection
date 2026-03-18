import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', hoverEffect = true }) => {
    return (
        <motion.div
            className={`glass-card p-6 ${className}`}
            whileHover={hoverEffect ? { scale: 1.02, rotateX: 2, rotateY: 2 } : {}}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                transformStyle: 'preserve-3d',
            }}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
