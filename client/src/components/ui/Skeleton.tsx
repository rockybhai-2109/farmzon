'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
    className?: string;
    variant?: 'rect' | 'circle' | 'text';
    width?: string | number;
    height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'rect',
    width,
    height
}) => {
    const baseStyles = "bg-white/5 relative overflow-hidden";
    const variantStyles = {
        rect: "rounded-xl",
        circle: "rounded-full",
        text: "rounded-md h-4 mb-2"
    };

    return (
        <div
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            style={{ width, height }}
        >
            <motion.div
                animate={{
                    x: ['-100%', '100%'],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />
        </div>
    );
};

export const ListingSkeleton = () => (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-4 space-y-4 animate-pulse">
        <Skeleton height={200} className="w-full" />
        <div className="space-y-2">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
        </div>
        <div className="flex justify-between items-center pt-4">
            <Skeleton variant="circle" width={40} height={40} />
            <Skeleton width={100} height={32} />
        </div>
    </div>
);
