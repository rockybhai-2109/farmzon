'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, Quote } from 'lucide-react';

interface AIStoryProps {
    rawStory: string;
    farmerName: string;
}

export const AIStory: React.FC<AIStoryProps> = ({ rawStory, farmerName }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [displayedStory, setDisplayedStory] = useState('');
    const [storyVersion, setStoryVersion] = useState(0);

    const enhancedStories = [
        `In the heart of Gujarat, ${farmerName} carries forward a legacy that spans three generations. It's not just about farming; it's a sacred bond with the soil. By embracing organic practices, they ensure that every harvest is a testament to purity and health. ${rawStory}`,
        `${farmerName} isn't just a farmer; they are a guardian of the earth. On their lush acres, nature thrives without the interference of chemicals. This story began with a vision of a healthier future, and today, it's a reality shared with every buyer. ${rawStory}`,
        `Innovation meets tradition at ${farmerName}'s farm. From solar-powered irrigation to natural pest control, every method is chosen with care. This is the future of agriculture—sustainable, ethical, and deeply rooted in the community. ${rawStory}`
    ];

    const generateStory = () => {
        setIsGenerating(true);
        setDisplayedStory('');
        setStoryVersion((prev) => (prev + 1) % enhancedStories.length);

        // Simulate AI "thinking"
        setTimeout(() => {
            setIsGenerating(false);
        }, 1500);
    };

    useEffect(() => {
        if (!isGenerating) {
            let currentText = '';
            const targetStory = enhancedStories[storyVersion];
            const words = targetStory.split(' ');
            let i = 0;

            const interval = setInterval(() => {
                if (i < words.length) {
                    currentText += (i === 0 ? '' : ' ') + words[i];
                    setDisplayedStory(currentText);
                    i++;
                } else {
                    clearInterval(interval);
                }
            }, 30);

            return () => clearInterval(interval);
        }
    }, [isGenerating, storyVersion]);

    return (
        <div className="glass-card p-10 border-none relative overflow-hidden bg-gradient-to-br from-secondary/5 to-transparent">
            <div className="absolute top-0 right-0 p-4">
                <motion.div
                    animate={isGenerating ? { rotate: 360 } : {}}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                >
                    <Sparkles className="w-6 h-6 text-secondary opacity-40" />
                </motion.div>
            </div>

            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-secondary" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-foreground font-display">AI Story Generator</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Enhanced by Farmzon AI</p>
                </div>
            </div>

            <div className="relative min-h-[200px]">
                <AnimatePresence mode="wait">
                    {isGenerating ? (
                        <motion.div
                            key="generating"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-12 gap-4"
                        >
                            <RefreshCw className="w-8 h-8 text-secondary animate-spin" />
                            <p className="text-sm font-black uppercase tracking-widest text-secondary animate-pulse">Analyzing Farm Data...</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="story"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="relative"
                        >
                            <Quote className="absolute -top-6 -left-6 w-12 h-12 text-secondary/10" />
                            <p className="text-xl leading-relaxed text-foreground font-serif italic">
                                {displayedStory}
                                <span className="inline-block w-1 h-5 bg-secondary ml-1 animate-pulse" />
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <button
                onClick={generateStory}
                disabled={isGenerating}
                className="mt-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary hover:text-secondary-foreground transition-colors disabled:opacity-50"
            >
                <RefreshCw className="w-3 h-3" />
                Regenerate Narrartive
            </button>
        </div>
    );
};
