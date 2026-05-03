'use client';

import { createContext, useContext, useState } from 'react';

interface CarouselSlideValue {
  index: number;
  setIndex: (i: number) => void;
}

const CarouselSlideContext = createContext<CarouselSlideValue | null>(null);

// Shared "current slide" for the carousel template — both the editor's slide
// tabs (left rail) and the preview's chevrons (right column) read/write the
// same value so clicking a slide-tab in the editor updates the preview, and
// vice versa.
export function CarouselSlideProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [index, setIndex] = useState(0);
  return (
    <CarouselSlideContext.Provider value={{ index, setIndex }}>
      {children}
    </CarouselSlideContext.Provider>
  );
}

export function useCarouselSlide(): CarouselSlideValue {
  const ctx = useContext(CarouselSlideContext);
  if (!ctx) {
    throw new Error('useCarouselSlide must be used inside <CarouselSlideProvider>');
  }
  return ctx;
}
