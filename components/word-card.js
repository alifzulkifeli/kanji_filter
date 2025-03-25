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
    let transform = `translateX(${offsetX}px)`;
    let opacity = 1 - (Math.min(Math.abs(offsetX), 200) / 200) * 0.8;
    let rotate = `rotate(${offsetX * 0.03}deg)`;
    
    return {
      transform: `${transform} ${rotate}`,
      opacity,
      transition: swiping ? 'none' : 'transform 0.3s ease, opacity 0.3s ease',
    };
  };

  return (
    <div className="relative w-full">
      <Card
        ref={cardRef}
        style={getCardStyle()}
        className="cursor-grab active:cursor-grabbing shadow-md mb-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleSwipeEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleSwipeEnd}
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
    </div>
  );
}