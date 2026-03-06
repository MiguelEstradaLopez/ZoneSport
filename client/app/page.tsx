'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { ThumbsUp, ThumbsDown, Edit2, Loader } from 'lucide-react';

interface Post {
  id: string;
  content: string;
  imageBase64?: string;
  likes: number;
  createdAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
  };
}

const AVATAR_COLORS = [
  'bg-emerald-500',
  'bg-blue-500',
  'bg-violet-500',
  'bg-fuchsia-500',
  'bg-cyan-500',
  'bg-teal-500',
];

function getAvatarColorClass(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 5) return 'Justo ahora';
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `hace ${days}d`;
}

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState('');
  const [imageBase64, setImageBase64] = useState<string | undefined>();
  const [creating, setCreating] = useState(false);
  const [userVotes, setUserVotes] = useState<{ [key: string]: number }>({});
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cargar posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/posts?limit=50');
      setPosts(response.data || []);

      // Cargar votos del usuario
      if (isAuthenticated && user) {
        const votes: { [key: string]: number } = {};
        for (const post of response.data || []) {
          try {
            const voteRes = await api.get(`/posts/${post.id}/vote/user`, {
              headers: { 'X-User-Id': user.id },
            });
            votes[post.id] = voteRes.data?.value || 0;
          } catch {
            // silenciar errores de votos individuales
          }
        }
        setUserVotes(votes);
      }
    } catch (err) {
      console.error('Error cargando posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    // Polling cada 30 segundos
    pollingIntervalRef.current = setInterval(fetchPosts, 30000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [isAuthenticated, user]);

  // Comprimir imagen antes de enviar
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const img = new Image();
      img.onload = () => {
        const MAX = 800;
        let w = img.width, h = img.height;
        if (w > MAX) { h = h * MAX / w; w = MAX; }
        if (h > MAX) { w = w * MAX / h; h = MAX; }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = URL.createObjectURL(file);
    });
  };

  // Manejar selección de imagen
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file);
      setImageBase64(compressed);
    } catch (err) {
      console.error('Error comprimiendo imagen:', err);
    }
  };

  // Crear post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setCreating(true);
    try {
      await api.post('/posts', {
        content: content.trim(),
        imageBase64,
      });
      setContent('');
      setImageBase64(undefined);
      setShowModal(false);
      await fetchPosts();
    } catch (err) {
      console.error('Error creando post:', err);
    } finally {
      setCreating(false);
    }
  };

  // Votar en post
  const handleVote = async (postId: string, value: 1 | -1) => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para votar');
      return;
    }

    try {
      await api.post(`/posts/${postId}/vote`, { value });
      await fetchPosts();
    } catch (err) {
      console.error('Error votando:', err);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-900 text-white p-4 pt-20 md:p-8 md:pt-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Feed de ZoneSport</h1>
          <p className="text-zinc-400">Comparte tus novedades deportivas</p>
        </div>

        {/* Botón Nueva Publicación */}
        {isAuthenticated && (
          <button
            onClick={() => setShowModal(true)}
            className="w-full mb-8 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            <Edit2 size={20} />
            Nueva Publicación
          </button>
        )}

        {/* Modal Crear Post */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 max-w-lg w-full">
              <h2 className="text-2xl font-bold mb-4">Crear Publicación</h2>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value.slice(0, 500))}
                    placeholder="¿Qué está pasando en tu mundo deportivo?"
                    rows={4}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:border-green-500 resize-none"
                  />
                  <p className="text-xs text-zinc-400 mt-1">
                    {content.length}/500
                  </p>
                </div>

                {imageBase64 && (
                  <div className="relative">
                    <img
                      src={imageBase64}
                      alt="Preview"
                      className="max-h-48 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setImageBase64(undefined)}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Quitar imagen
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Imagen (opcional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 text-zinc-300 file:bg-green-600 file:text-white file:font-bold file:border-0 file:px-4 file:py-2 file:rounded file:cursor-pointer file:mr-4"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={creating || !content.trim()}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-2 rounded-lg transition"
                  >
                    {creating ? 'Publicando...' : 'Publicar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-2 rounded-lg transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lista de Posts */}
        <div className="space-y-4">
          {loading && posts.length === 0 ? (
            <div className="text-center py-8 text-zinc-400">
              <Loader className="animate-spin mx-auto mb-2" />
              Cargando posts...
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-8 text-center text-zinc-400">
              <p>Aún no hay publicaciones. ¡Sé el primero en compartir!</p>
            </div>
          ) : (
            posts.map((post) => {
              const authorName = `${post.author.firstName} ${post.author.lastName}`.trim() || post.author.email;
              const avatarColor = getAvatarColorClass(authorName);
              const avatarLetter = (authorName[0] || 'U').toUpperCase();
              const userVote = userVotes[post.id] || 0;

              return (
                <div
                  key={post.id}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 hover:border-zinc-600 transition"
                >
                  {/* Header del Post */}
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden ${post.author.profilePicture ? '' : avatarColor
                        }`}
                    >
                      {post.author.profilePicture ? (
                        <img
                          src={post.author.profilePicture}
                          alt={authorName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        avatarLetter
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white">{authorName}</p>
                      <p className="text-xs text-zinc-400">{timeAgo(post.createdAt)}</p>
                    </div>
                  </div>

                  {/* Contenido */}
                  <p className="text-zinc-100 mb-3 whitespace-pre-wrap break-words">
                    {post.content}
                  </p>

                  {/* Imagen si existe */}
                  {post.imageBase64 && (
                    <img
                      src={post.imageBase64}
                      alt="Post image"
                      className="max-w-full max-h-96 rounded-lg mb-3 object-contain"
                    />
                  )}

                  {/* Sistema de Votos */}
                  <div className="flex items-center gap-4 pt-3 border-t border-zinc-700">
                    <button
                      onClick={() => handleVote(post.id, 1)}
                      className={`flex items-center gap-1 transition ${userVote === 1
                        ? 'text-green-400'
                        : 'text-zinc-400 hover:text-green-400'
                        }`}
                    >
                      <ThumbsUp size={18} />
                      <span className="text-sm">{post.likes > 0 ? post.likes : ''}</span>
                    </button>
                    <button
                      onClick={() => handleVote(post.id, -1)}
                      className={`flex items-center gap-1 transition ${userVote === -1
                        ? 'text-red-400'
                        : 'text-zinc-400 hover:text-red-400'
                        }`}
                    >
                      <ThumbsDown size={18} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}