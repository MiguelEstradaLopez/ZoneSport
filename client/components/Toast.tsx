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
        <div className="fixed bottom-6 right-6 z-50 animate-toast-in bg-zinc-900 border-l-4 border-lime-400 shadow-lg rounded-lg px-5 py-4 flex items-start gap-4 min-w-[320px] max-w-xs">
            <span className="text-2xl">👋</span>
            <div className="flex-1">
                <div className="text-white font-semibold mb-1">{message.replace('[nombre]', name || '')}</div>
                <Link href={link} className="text-lime-400 underline text-sm font-medium hover:text-lime-300">Ir al perfil</Link>
            </div>
            <button
                className="ml-2 text-white hover:text-lime-400 text-lg font-bold"
                aria-label="Cerrar toast"
                onClick={() => {
                    setVisible(false);
                    onClose && onClose();
                }}
            >
                ×
            </button>
            <style jsx>{`
        .animate-toast-in {
          animation: toast-in 0.3s ease;
        }
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
