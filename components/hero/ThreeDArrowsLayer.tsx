'use client';

import React from 'react';
import { motion } from 'motion/react';

interface ArrowItem {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

const ARROWS_DATA: ArrowItem[] = [
  { id: 1, left: '12%', size: 75, duration: 12, delay: 0, opacity: 0.85 },
  { id: 2, left: '28%', size: 110, duration: 15, delay: 2.5, opacity: 0.95 },
  { id: 3, left: '46%', size: 140, duration: 18, delay: 1, opacity: 0.98 },
  { id: 4, left: '64%', size: 95, duration: 14, delay: 4, opacity: 0.9 },
  { id: 5, left: '82%', size: 120, duration: 16, delay: 1.8, opacity: 0.92 },
  { id: 6, left: '92%', size: 65, duration: 11, delay: 5, opacity: 0.75 },
  { id: 7, left: '6%', size: 55, duration: 13, delay: 3.2, opacity: 0.7 },
  { id: 8, left: '38%', size: 70, duration: 17, delay: 6, opacity: 0.8 },
  { id: 9, left: '72%', size: 85, duration: 13.5, delay: 7, opacity: 0.85 },
];

export default function ThreeDArrowsLayer() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {ARROWS_DATA.map((arrow) => {
        const w = arrow.size;
        const h = arrow.size * 1.5;
        const depth = arrow.size * 0.22;

        return (
          <motion.div
            key={arrow.id}
            initial={{ y: '110vh', opacity: 0 }}
            animate={{
              y: '-30vh',
              opacity: [0, arrow.opacity, arrow.opacity, 0],
            }}
            transition={{
              duration: arrow.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: arrow.delay,
            }}
            style={{
              position: 'absolute',
              left: arrow.left,
              width: w,
              height: h,
              filter: 'drop-shadow(0px 18px 24px rgba(15, 23, 42, 0.45))',
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 150"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <defs>
                {/* 3D Sheen Highlight */}
                <linearGradient id={`arrowTopGrad-${arrow.id}`} x1="0" y1="0" x2="0.3" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="60%" stopColor="#f8fafc" />
                  <stop offset="100%" stopColor="#e2e8f0" />
                </linearGradient>
                {/* 3D Bevel Shadow Gradient */}
                <linearGradient id={`arrowBevel-${arrow.id}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#cbd5e1" />
                  <stop offset="100%" stopColor="#94a3b8" />
                </linearGradient>
              </defs>

              {/* 3D Cast Shadow Base */}
              <path
                d="M 50 12 L 88 56 L 68 56 L 68 138 L 32 138 L 32 56 L 12 56 Z"
                fill="#1e293b"
                opacity="0.25"
                transform="translate(10, 16)"
              />

              {/* 3D Right Extrusion Facet */}
              <path
                d="M 50 10 L 60 20 L 98 66 L 88 56 Z"
                fill="#94a3b8"
                opacity="0.9"
              />
              <path
                d="M 88 56 L 98 66 L 78 66 L 68 56 Z"
                fill="#64748b"
                opacity="0.9"
              />
              <path
                d="M 68 56 L 78 66 L 78 148 L 68 138 Z"
                fill="#cbd5e1"
                opacity="0.95"
              />
              {/* Bottom stem bevel */}
              <path
                d="M 32 138 L 42 148 L 78 148 L 68 138 Z"
                fill="#64748b"
                opacity="0.85"
              />

              {/* 3D Top Pure White Arrow Face */}
              <path
                d="M 50 10 L 88 56 L 68 56 L 68 138 L 32 138 L 32 56 L 12 56 Z"
                fill={`url(#arrowTopGrad-${arrow.id})`}
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />

              {/* Subtle Center Ridgle / Spine for Dimensionality */}
              <path
                d="M 50 10 L 50 138"
                stroke="#ffffff"
                strokeWidth="0.8"
                opacity="0.6"
              />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
}
