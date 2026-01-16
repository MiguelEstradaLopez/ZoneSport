export default function NoticiasPage() {
  const noticias = [
    { id: 1, titulo: "Gran Torneo de Fútbol Antioquia", fecha: "15 Ene 2026", categoria: "Fútbol" },
    { id: 2, titulo: "Nuevos Rankings de Tenis", fecha: "12 Ene 2026", categoria: "Tenis" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6 border-l-4 border-zs-green pl-4">
        Noticias <span className="text-zs-blue">Deportivas</span>
      </h1>
      
      <div className="grid gap-4">
        {noticias.map((nota) => (
          <div key={nota.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-zs-blue transition-all">
            <span className="text-zs-green text-sm font-bold uppercase">{nota.categoria}</span>
            <h2 className="text-xl font-semibold text-white mt-2">{nota.titulo}</h2>
            <p className="text-gray-400 text-sm mt-4">{nota.fecha}</p>
          </div>
        ))}
      </div>
    </div>
  );
}