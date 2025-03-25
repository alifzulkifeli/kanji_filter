import { WordCard } from '@/components/word-card';

export function WordList({ words, onWordLearned, onWordExcluded }) {
  return (
    <div className="max-w-md mx-auto">
      {words.map(word => (
        <WordCard key={word.japanese} word={word} onLearned={onWordLearned} onExcluded={onWordExcluded} />
      ))}
    </div>
  );
}