"use client"

import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"

export function Toaster() {
    const { toasts } = useToast()

    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-[400px]">
            <AnimatePresence>
                {toasts.map(function ({ id, title, description, action, ...props }) {
                    return (
                        <motion.div
                            key={id}
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xl pointer-events-auto"
                            {...props}
                        >
                            <div className="grid gap-1">
                                {title && <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-50">{title}</h3>}
                                {description && (
                                    <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                        {description}
                                    </div>
                                )}
                            </div>
                            {action}
                        </motion.div>
                    )
                })}
            </AnimatePresence>
        </div>
    )
}
