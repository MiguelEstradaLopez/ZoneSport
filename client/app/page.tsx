export default function Home() {
  return (
    <main className="page-container flex items-center justify-center">
      <div className="content-wrapper text-center max-w-2xl">
        <h1 className="mb-2">
          Zone<span className="text-zs-green">Sport</span>
        </h1>
        <h2 className="text-muted mb-6">Antioquia</h2>
        <p className="body-text text-lg leading-relaxed mb-8">
          El sistema está listo y conectado.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/login" className="btn btn-secondary">
            Iniciar Sesión
          </a>
          <a href="/registrar" className="btn btn-primary">
            Registrarse
          </a>
        </div>
      </div>
    </main>
  );
}