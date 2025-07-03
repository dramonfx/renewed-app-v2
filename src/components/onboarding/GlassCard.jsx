'use client';

import { motion } from 'framer-motion';
import SacredCard from '@/components/ui/sacred-card';

export default function GlassCard({ children, className = '', onClick, ...props }) {
  return (
    <SacredCard
      variant="glass"
      onClick={onClick}
      hover={!!onClick}
      className={className}
      {...props}
    >
      {children}
    </SacredCard>
  );
}
