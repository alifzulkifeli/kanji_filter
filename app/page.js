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
    setWords(words.filter(w => w.japanese !== word.japanese));

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

  const handleWordExcluded = async (word) => {
    // Remove from current words list
    setWords(words.filter(w => w.japanese !== word.japanese));

    // Add to excluded words
    try {
      await fetch('/api/excluded-words', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(word),
      });
    } catch (error) {
      console.error('Error marking word as excluded:', error);
    }
  }



  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Japanese Learning App</h1>
      
      <div className="mb-6 w-full flex items-end gap-4">
        <div>
          <Label htmlFor="wordList">Word List</Label>
          <div className="flex  gap-2">
            <Input 
              id="wordList"
              type="number" 

              value={currentFile} 
              onChange={(e) => setCurrentFile(parseInt(e.target.value) || "")}
              className="w-24"
            />
            <Button onClick={fetchWords}>Load</Button>
          </div>
        </div>
        
   
      </div>

      <Tabs defaultValue="learning">
        <TabsList className="mb-4">
          <TabsTrigger value="learning">Learning ({words.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="learning">
          {loading ? (
            <p className="text-center py-8">Loading words...</p>
          ) : words.length > 0 ? (
            <WordList words={words} onWordLearned={handleWordLearned} onWordExcluded={handleWordExcluded} />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center">All words learned! Try another list.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        

      </Tabs>
    </div>
  );
}