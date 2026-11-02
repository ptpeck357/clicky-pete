import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/** A router `Link` that takes Framer Motion props. Created once at module scope, as motion.create requires. */
export const MotionLink = motion.create(Link);
