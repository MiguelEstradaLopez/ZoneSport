import { NextResponse } from 'next/server';

export async function GET() {
    const apiKey = process.env.NEWSAPI_KEY;
    console.log('[NEWSAPI] apiKey exists:', !!apiKey);
    const url = `https://newsapi.org/v2/top-headlines?category=sports&pageSize=20&apiKey=${apiKey}`;
    try {
        const res = await fetch(url, { next: { revalidate: 1800 } });
        const data = await res.json();
        console.log('[NEWSAPI] status:', data.status);
        console.log('[NEWSAPI] totalResults:', data.totalResults);
        console.log('[NEWSAPI] articles count:', data.articles?.length);
        return NextResponse.json(data);
    } catch (error) {
        console.log('[NEWSAPI] error:', error);
        return NextResponse.json(
            { error: 'Error al cargar noticias' },
            { status: 500 }
        );
    }
}
