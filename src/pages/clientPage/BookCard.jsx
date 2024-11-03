import React from 'react';

export default function BookCard({ book }) {
  return (
    <div className="flex flex-col w-full sm:w-48 md:w-56 lg:w-64 transition-transform duration-300 ease-in-out transform hover:scale-105">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-md">
        <img 
          src={book.imageUrl} 
          alt={book.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="w-full p-4 bg-gradient-to-t from-black to-transparent">
            <p className="text-white text-sm font-medium truncate">{book.title}</p>
            <p className="text-gray-300 text-xs">{book.author}</p>
          </div>
        </div>
      </div>
      <div className="mt-2 px-2">
        <h3 className="text-sm font-medium text-gray-900 truncate">{book.title}</h3>
        <p className="text-xs text-gray-600 truncate">{book.author}</p>
      </div>
    </div>
  );
}
