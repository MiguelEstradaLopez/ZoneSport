export default function NoticiasPage() {
  const noticias = [
    { id: 1, titulo: "Gran Torneo de Fútbol Antioquia", fecha: "15 Ene 2026", categoria: "Fútbol" },
    { id: 2, titulo: "Nuevos Rankings de Tenis", fecha: "12 Ene 2026", categoria: "Tenis" },
  ];

  return (
    <main className="page-container">
      <div className="content-wrapper">
        <header className="mb-8">
          <h1 className="flex items-center gap-3 mb-2">
            Noticias <span className="text-zs-green">Deportivas</span>
          </h1>
          <div className="divider mt-4" />
        </header>
        
        <article className="grid gap-4">
          {noticias.map((nota) => (
            <div key={nota.id} className="card">
              <span className="badge">{nota.categoria}</span>
              <h2 className="heading-md mt-2">{nota.titulo}</h2>
              <p className="text-muted text-sm mt-4">{nota.fecha}</p>
            </div>
          ))}
        </article>
      </div>
    </main>
  );
}