import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: "ZoneSport - Antioquia",
  description: "Plataforma deportiva de gestión de torneos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased bg-zs-dark">
        <AuthProvider>
          <Navbar />
          <div className="pt-16">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}