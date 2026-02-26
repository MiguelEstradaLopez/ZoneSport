"use client";
import { useEffect, useState } from "react";

const NEWS_CACHE_KEY = "sports_news_cache";
const NEWS_TIMESTAMP_KEY = "sports_news_timestamp";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos
const PLACEHOLDER_IMG = "/images/news-placeholder.jpg";

function timeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff} segundos`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutos`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} horas`;
  return `${Math.floor(diff / 86400)} días`;
}

export default function NoticiasPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError("");
      // Check cache
      const cached = localStorage.getItem(NEWS_CACHE_KEY);
      const timestamp = localStorage.getItem(NEWS_TIMESTAMP_KEY);
      if (cached && timestamp && Date.now() - Number(timestamp) < CACHE_DURATION) {
        setNews(JSON.parse(cached));
        setLoading(false);
        return;
      }
      try {
        const apiKey = process.env.NEXT_PUBLIC_NEWSAPI_KEY;
        const url = `https://newsapi.org/v2/top-headlines?category=sports&language=es&pageSize=20&apiKey=${apiKey}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Error al obtener noticias");
        const data = await res.json();
        if (!data.articles) throw new Error("No hay artículos disponibles");
        setNews(data.articles);
        localStorage.setItem(NEWS_CACHE_KEY, JSON.stringify(data.articles));
        localStorage.setItem(NEWS_TIMESTAMP_KEY, String(Date.now()));
      } catch (err: any) {
        setError(err?.message || "Error al cargar noticias");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <main className="page-container">
      <div className="content-wrapper">
        <header className="mb-8">
          <h1 className="flex items-center gap-3 mb-2">
            Noticias <span className="text-zs-green">Deportivas</span>
          </h1>
          <div className="divider mt-4" />
        </header>

        {loading ? (
          <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse bg-zs-dark/40">
                <div className="w-full h-40 bg-zs-dark/20 rounded-lg mb-4" />
                <div className="h-6 bg-zs-dark/30 rounded w-3/4 mb-2" />
                <div className="h-4 bg-zs-dark/20 rounded w-1/2 mb-4" />
                <div className="h-4 bg-zs-dark/10 rounded w-1/3 mb-2" />
                <div className="h-4 bg-zs-dark/10 rounded w-1/4" />
              </div>
            ))}
          </article>
        ) : error ? (
          <div className="alert alert-error mt-8">{error}</div>
        ) : (
          <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, idx) => (
              <div key={idx} className="card bg-zs-dark/40">
                <img
                  src={item.urlToImage || PLACEHOLDER_IMG}
                  alt={item.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                  onError={e => (e.currentTarget.src = PLACEHOLDER_IMG)}
                />
                <h2 className="heading-md mt-2 text-zs-green">
                  {item.title}
                </h2>
                <p className="text-muted text-sm mt-2">
                  {item.description || "Sin descripción"}
                </p>
                <div className="flex items-center justify-between mt-4 text-xs text-zs-light">
                  <span className="font-semibold">{item.source?.name || "Fuente desconocida"}</span>
                  <span>{timeAgo(item.publishedAt)}</span>
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary mt-4 w-full"
                >
                  Leer más
                </a>
              </div>
            ))}
          </article>
        )}
      </div>
    </main>
  );
}