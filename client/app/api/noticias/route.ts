import { NextResponse } from 'next/server';

export async function GET() {
    const apiKey = process.env.NEWSAPI_KEY;
    const url = `https://newsapi.org/v2/top-headlines?category=sports&language=es&pageSize=20&apiKey=${apiKey}`;
    try {
        const res = await fetch(url, { next: { revalidate: 1800 } });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Error al cargar noticias' },
            { status: 500 }
        );
    }
}
