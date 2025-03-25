'use client';

import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function WordCard({ word, onLearned, onExcluded }) {
  const [swiping, setSwiping] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const cardRef = useRef(null);

  const handleTouchStart = (e) => {
    setSwiping(true);
    setStartX(e.touches[0].clientX);
  };

  const handleMouseDown = (e) => {
    setSwiping(true);
    setStartX(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (!swiping) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setOffsetX(diff);
  };

  const handleMouseMove = (e) => {
    if (!swiping) return;
    const currentX = e.clientX;
    const diff = currentX - startX;
    setOffsetX(diff);
  };

  const handleSwipeEnd = () => {
    if (offsetX > 100) {
        console.log('swiped right');
      if (onLearned) onLearned(word);
    }
    if (offsetX < -100) {
        console.log('swiped left');
        if (onExcluded) onExcluded(word);
    }
    setSwiping(false);
    setOffsetX(0);
  };

  const getCardStyle = () => {
 
  };

return (
    <div className="relative w-full">
        {/* Left red button */}
        <div 
            className="absolute left-0 top-0 bottom-0 w-16 bg-red-500 opacity-60 hover:opacity-80 z-10 flex items-center justify-center rounded-l-lg cursor-pointer"
            onClick={() => onExcluded(word)}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </div>
        
        <Card
            ref={cardRef}
            // style={getCardStyle()}
            className=" shadow-md mb-4"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleSwipeEnd}
            // onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            // onMouseUp={handleSwipeEnd}
            onMouseLeave={() => swiping && handleSwipeEnd()}
        >
            <CardContent className="p-2">
                <div className="flex flex-col items-center text-center">
                    <p className="text-sm text-gray-600 ">{word.reading}</p>
                    <h3 className="text-2xl font-bold mb-2">{word.japanese}</h3>
                    <p className="text-lg">{word.english}</p>
                </div>
            </CardContent>
        </Card>
        
        {/* Right green button */}
        <div 
            className="absolute right-0 top-0 bottom-0 w-16 bg-green-500 opacity-60 hover:opacity-80 z-10 flex items-center justify-center rounded-r-lg cursor-pointer"
            onClick={() => onLearned(word)}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        </div>
    </div>
);
}