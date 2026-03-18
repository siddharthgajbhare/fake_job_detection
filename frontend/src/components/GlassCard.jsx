import clsx from 'clsx';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={clsx(
                "backdrop-blur-md bg-white/10 border border-white/20 shadow-xl rounded-2xl p-6",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
