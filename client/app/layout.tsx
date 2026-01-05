import type { Metadata } from "next";
import "./globals.css"; // Verifica que globals.css esté en la misma carpeta app
import Navbar from "../components/layout/Navbar"; // Sube un nivel y entra a components

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
      <body className="antialiased bg-slate-900">
        <Navbar />
        <div className="pt-16"> {/* Padding-top para que el contenido no quede debajo del navbar fijo */}
          {children}
        </div>
      </body>
    </html>
  );
} 