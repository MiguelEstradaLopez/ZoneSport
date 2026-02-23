"use client";
// ...existing code...
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ToastProps {
    message: string;
    name?: string;
    link?: string;
    duration?: number;
    onClose?: () => void;
}

export default function Toast({ message, name, link = '/perfil', duration = 5000, onClose }: ToastProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                setVisible(false);
                onClose && onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    if (!visible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-toast-in bg-zinc-900 border-l-4 border-lime-400 shadow-lg rounded-lg p-4 min-w-[320px] max-w-[400px] flex flex-col">
            <button
                className="absolute top-2 right-2 text-white hover:text-lime-400 text-lg font-bold"
                aria-label="Cerrar toast"
                onClick={() => {
                    setVisible(false);
                    onClose && onClose();
                }}
            >
                ×
            </button>
            <div className="flex items-start gap-3">
                <span className="text-2xl">👋</span>
                <div className="flex-1">
                    <div className="text-white font-semibold mb-1 break-words whitespace-pre-line">
                        {message.replace('[nombre]', name || '')}
                    </div>
                </div>
            </div>
            <div className="mt-3">
                <Link href={link} className="text-lime-400 underline text-sm font-medium hover:text-lime-300 block">
                    Ir al perfil
                </Link>
            </div>
            <style jsx>{`
                .animate-toast-in {
                    animation: toast-in 0.3s ease;
                }
                @keyframes toast-in {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .absolute {
                    position: absolute;
                }
            `}</style>
        </div>
    );
}
