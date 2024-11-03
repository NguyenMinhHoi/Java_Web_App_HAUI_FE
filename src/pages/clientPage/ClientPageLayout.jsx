import React from 'react';
import Sidebar from './ClientSidebar';
import Header from './ClientHeader';

export default function ClientPageLayout({ children }) {
  return (
    <div className="flex h-screen bg-white text-black">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header />
        <div className="px-6">
          {children}
        </div>
      </main>
    </div>
  );
}