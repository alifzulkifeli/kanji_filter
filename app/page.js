'use client';

import { useState, useEffect } from 'react';
import { WordList } from '@/components/word-list';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const [words, setWords] = useState([]);
  const [knownWords, setKnownWords] = useState([]);
  const [currentFile, setCurrentFile] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWords();
    fetchKnownWords();
  }, []);

  const fetchWords = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/words?file=${currentFile}`);
      const data = await response.json();
      setWords(data);
    } catch (error) {
      console.error('Error fetching words:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKnownWords = async () => {
    try {
      const response = await fetch('/api/known-words');
      const data = await response.json();
      setKnownWords(data);
    } catch (error) {
      console.error('Error fetching known words:', error);
    }
  };

  const handleWordLearned = async (word) => {
    // Remove from current words list
    setWords(words.filter(w => w.id !== word.id));

    // Add to known words
    try {
      await fetch('/api/known-words', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(word),
      });
      fetchKnownWords();
    } catch (error) {
      console.error('Error marking word as known:', error);
    }
  };

  const changeWordList = (fileNumber) => {
    setCurrentFile(fileNumber);
    fetchWords();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Japanese Learning App</h1>
      
      <div className="mb-6 flex items-end gap-4">
        <div>
          <Label htmlFor="wordList">Word List</Label>
          <div className="flex gap-2">
            <Input 
              id="wordList"
              type="number" 
              min="1" 
              max="100" 
              value={currentFile} 
              onChange={(e) => setCurrentFile(parseInt(e.target.value) || 1)}
              className="w-24"
            />
            <Button onClick={fetchWords}>Load</Button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => changeWordList(Math.max(1, currentFile - 1))}
            disabled={currentFile <= 1}
          >
            Previous List
          </Button>
          <Button 
            variant="outline" 
            onClick={() => changeWordList(Math.min(100, currentFile + 1))}
            disabled={currentFile >= 100}
          >
            Next List
          </Button>
        </div>
      </div>

      <Tabs defaultValue="learning">
        <TabsList className="mb-4">
          <TabsTrigger value="learning">Learning ({words.length})</TabsTrigger>
          <TabsTrigger value="known">Known Words ({knownWords.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="learning">
          {loading ? (
            <p className="text-center py-8">Loading words...</p>
          ) : words.length > 0 ? (
            <WordList words={words} onWordLearned={handleWordLearned} />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center">All words learned! Try another list.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="known">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {knownWords.map(word => (
              <Card key={word.id}>
                <CardHeader className="pb-2">
                  <CardTitle>{word.japanese}</CardTitle>
                  <CardDescription>{word.reading}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{word.english}</p>
                </CardContent>
              </Card>
            ))}
            {knownWords.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="pt-6">
                  <p className="text-center">No known words yet. Start swiping to mark words as known!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}