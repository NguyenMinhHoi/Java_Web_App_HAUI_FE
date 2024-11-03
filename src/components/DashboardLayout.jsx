import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import Sidebar from './Sidebar';

export default function DashboardLayout({ currentUser, onLogout }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="relative min-h-screen bg-gray-100">
            <DashboardHeader 
                currentUser={currentUser} 
                onLogout={onLogout} 
                onMenuClick={toggleSidebar}
            />
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            
            <main className="pt-16 min-h-screen">
                <div className="container mx-auto px-6 py-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
