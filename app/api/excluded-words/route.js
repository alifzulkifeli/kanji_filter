import { getExcludedWords, addExcludedWord } from '@/lib/db';

export async function GET() {
  const excludedWords = getExcludedWords();
  return new Response(JSON.stringify(excludedWords), {
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
    
    const updatedExcludedWords = addExcludedWord(word);
    
    return new Response(JSON.stringify(updatedExcludedWords), {
        headers: { 'Content-Type': 'application/json' }
    });
}

