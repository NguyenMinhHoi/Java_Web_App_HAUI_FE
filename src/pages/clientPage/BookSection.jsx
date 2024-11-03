import React, { useState, useEffect } from 'react';
import { FiBook, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import BookCard from './BookCard';

export default function BookSection({ title, books = [] }) {
  const [startIndex, setStartIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const visibleBooks = 5;

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 300); // 300ms is the duration of our transition
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const nextBooks = () => {
    if (startIndex < books.length - visibleBooks) {
      setIsAnimating(true);
      setStartIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevBooks = () => {
    if (startIndex > 0) {
      setIsAnimating(true);
      setStartIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div className="mb-8 relative">
      <h2 className="text-xl font-bold flex items-center text-gray-900 mb-4">
        <FiBook className="mr-2" /> {title}
      </h2>

      <div className="relative overflow-hidden">
        <div 
          className={`flex transition-transform duration-300 ease-in-out ${isAnimating ? 'transition-transform' : ''}`}
          style={{ transform: `translateX(-${startIndex * (100 / visibleBooks)}%)` }}
        >
          {books.map((book) => (
            <div key={book.id} className="flex-shrink-0 w-1/5 px-2">
              <BookCard book={book} />
            </div>
          ))}
        </div>

        {startIndex > 0 && (
          <button
            onClick={prevBooks}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 rounded-full p-2 shadow-md z-10"
          >
            <FiChevronLeft size={24} />
          </button>
        )}

        {startIndex < books.length - visibleBooks && (
          <button
            onClick={nextBooks}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 rounded-full p-2 shadow-md z-10"
          >
            <FiChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
}