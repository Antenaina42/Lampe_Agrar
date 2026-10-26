'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tractor, Sprout, Wheat } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface OpeningAnimationProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export function OpeningAnimation({ onComplete, forceShow = false }: OpeningAnimationProps) {
  const [visible, setVisible] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    // Check if reduced motion is requested
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const disabledByUser = localStorage.getItem('lampe_agrar_animations_enabled') === 'false';
    const alreadyShown = sessionStorage.getItem('lampe_agrar_intro_shown') === 'true';

    if (!forceShow && (prefersReducedMotion || disabledByUser || alreadyShown)) {
      if (onComplete) onComplete();
      return;
    }

    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('lampe_agrar_intro_shown', 'true');
      if (onComplete) onComplete();
    }, 2200);

    return () => clearTimeout(timer);
  }, [forceShow, onComplete]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fcfcf9]"
      >
        <div className="relative flex flex-col items-center max-w-md w-full px-6">
          {/* Farm Emblem & Typography */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-center mb-8 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#226c3d] flex items-center justify-center shadow-lg shadow-emerald-900/15 mb-3">
              <Wheat className="w-9 h-9 text-[#fbfaf6]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#212921]">
              LAMPE AGRAR
            </h1>
            <p className="text-xs uppercase tracking-widest text-[#5c6e5c] font-medium mt-0.5">
              Gesa & Dr. Josef Langenberg • Bockstedt
            </p>
          </motion.div>

          {/* Stylized Field & Animated Tractor */}
          <div className="relative w-full h-16 overflow-hidden rounded-xl bg-[#f2f5f1] border border-[#dce3da] flex items-end">
            {/* Field furrow lines */}
            <div className="absolute inset-x-0 bottom-0 h-4 bg-[#7a6452]/20 flex items-center justify-around px-2">
              <div className="h-0.5 w-full bg-[#7a6452]/30" />
            </div>

            {/* Emerging Sprouts */}
            <div className="absolute inset-x-0 bottom-3 flex justify-between px-6">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
                >
                  <Sprout className="w-4 h-4 text-[#226c3d]" />
                </motion.div>
              ))}
            </div>

            {/* Tractor Driving across Field */}
            <motion.div
              initial={{ x: -60 }}
              animate={{ x: 380 }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
              className="absolute bottom-2 z-10 text-[#226c3d]"
            >
              <Tractor className="w-8 h-8 drop-shadow-sm" />
            </motion.div>
          </div>

          {/* Subtitle Transition */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-4 flex items-center gap-2 text-xs text-[#5c6e5c]"
          >
            <span className="w-2 h-2 rounded-full bg-[#226c3d] animate-ping" />
            <span>{t('app.tagline')}</span>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
