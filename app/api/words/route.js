import { getWordsFromFile } from '@/lib/get-words';
import { getKnownWords } from '@/lib/db';
import { getExcludedWords } from '@/lib/db';

export async function GET(request) {
  const url = new URL(request.url);
  const fileNumber = parseInt(url.searchParams.get('file') || '1');
  
  if (isNaN(fileNumber) || fileNumber < 1 || fileNumber > 10000) {
    return new Response(JSON.stringify({ error: 'Invalid file number' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const allWords = await getWordsFromFile(fileNumber);
  const knownWords = await getKnownWords();
  const excludedWords = await getExcludedWords();

  
  
  // Filter out words that are already known
  var wordsToLearn = allWords.filter(word => 
    !knownWords.some(knownWord => knownWord.japanese === word.japanese)
  );

  wordsToLearn = wordsToLearn.filter(word =>
    !excludedWords.some(excludedWord => excludedWord.japanese === word.japanese)
  );

  

  return new Response(JSON.stringify(wordsToLearn), {
    headers: { 'Content-Type': 'application/json' }
  });
}