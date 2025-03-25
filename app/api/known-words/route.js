import { getKnownWords, addKnownWord } from '@/lib/db';

export async function GET() {
  const knownWords = getKnownWords();
  return new Response(JSON.stringify(knownWords), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST(request) {
  const word = await request.json();
  
  if (!word || !word.id || !word.japanese || !word.english) {
    return new Response(JSON.stringify({ error: 'Invalid word data' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const updatedKnownWords = addKnownWord(word);
  
  return new Response(JSON.stringify(updatedKnownWords), {
    headers: { 'Content-Type': 'application/json' }
  });
}