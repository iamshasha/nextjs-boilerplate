"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';

// --- TypeScript Interface for our App data (Expanded) ---
interface App {
  id: number;
  name: string;
  category: string;
  iconUrl: string;
  rating: number;
  description: string;
  fullDescription: string;
  developer: string;
  version: string;
  screenshots: string[];
}

// --- Constants ---
const ALL_CATEGORIES = ['Productivity', 'Finance', 'Graphics & Design', 'Music & Audio', 'Health & Fitness', 'Developer Tools', 'Books & Reference', 'Food & Drink'];
const TABS = ['Featured', 'All Apps', ...ALL_CATEGORIES];

// --- Helper Component for Star Ratings ---
function StarRating({ rating, size = 'w-4 h-4' }: { rating: number, size?: string }) {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = totalStars - fullStars - halfStar;

  const StarIcon = ({ color }: { color: string }) => (
    <svg className={`${size} ${color}`} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.868 5.748h6.04c.969 0 1.371 1.24.588 1.81l-4.887 3.548 1.868 5.748c.3.921-.755 1.688-1.54 1.18l-4.887-3.548-4.887 3.548c-.784.508-1.84-.259-1.54-1.18l1.868-5.748-4.887-3.548c-.783-.57-.38-1.81.588-1.81h6.04L9.049 2.927z" />
    </svg>
  );

  return (
    <div className="flex items-center" aria-label={`Rating: ${rating} out of 5 stars`}>
      {[...Array(fullStars)].map((_, i) => <StarIcon key={`full-${i}`} color="text-yellow-400" />)}
      {halfStar > 0 && (
        <svg key="half" className={`${size} text-yellow-400`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 15.27l-4.887 3.548c-.784.508-1.84-.259-1.54-1.18l1.868-5.748-4.887-3.548c-.783-.57-.38-1.81.588-1.81h6.04L9.049 2.927c.3-.921 1.603-.921 1.902 0l1.868 5.748h6.04c.969 0 1.371 1.24.588 1.81l-4.887 3.548 1.868 5.748c.3.921-.755 1.688-1.54 1.18L10 15.27zM10 12.78V5.53l-1.35 4.15H4.2l3.48 2.53-1.34 4.14L10 12.78z" />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => <StarIcon key={`empty-${i}`} color="text-gray-300 dark:text-gray-600" />)}
      <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">{rating.toFixed(1)}</span>
    </div>
  );
}

// --- App Card Component ---
function AppCard({ app, onSelect }: { app: App, onSelect: (app: App) => void }) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null; 
    target.src = "https://placehold.co/128x128/CCCCCC/FFFFFF?text=Icon";
  };
  
  return (
    <button 
      onClick={() => onSelect(app)}
      className="text-left flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
    >
      <div className="flex items-center p-5 space-x-4">
        <img
          src={app.iconUrl}
          alt={`${app.name} icon`}
          className="w-16 h-16 md:w-20 md:h-20 rounded-xl flex-shrink-0 object-cover"
          width="80"
          height="80"
          onError={handleImageError}
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{app.name}</h3>
          <p className="text-sm text-blue-500 dark:text-blue-400 font-medium">{app.category}</p>
          <StarRating rating={app.rating} size='w-3 h-3' />
        </div>
      </div>
      <div className="px-5 pb-5 pt-2 flex-1">
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {app.description}
        </p>
      </div>
    </button>
  );
}

// --- App Details Page Component ---
function AppDetails({ app, onBack }: { app: App; onBack: () => void }) {
  const handleInstallClick = (appName: string) => {
    console.log(`Installing ${appName}... (Simulated Installation)`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10">
      <button 
        onClick={onBack} 
        className="flex items-center text-blue-600 dark:text-blue-400 mb-6 hover:underline transition-colors"
      >
        {/* Back Arrow Icon */}
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to App Market
      </button>

      {/* Main Details Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col md:flex-row md:space-x-8">
          <img
            src={app.iconUrl}
            alt={`${app.name} icon`}
            className="w-32 h-32 rounded-3xl object-cover flex-shrink-0 mb-4 md:mb-0 shadow-lg"
            width="128"
            height="128"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null; 
              target.src = "https://placehold.co/128x128/CCCCCC/FFFFFF?text=Icon";
            }}
          />
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{app.name}</h1>
            <p className="text-xl text-blue-600 dark:text-blue-400 font-semibold mb-3">{app.category}</p>
            <div className="flex items-center space-x-4 mb-4">
              <StarRating rating={app.rating} size='w-6 h-6' />
              <span className="text-lg text-gray-600 dark:text-gray-400">({app.rating.toFixed(1)} Rating)</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">{app.description}</p>
            
            <button 
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
              onClick={() => handleInstallClick(app.name)}
            >
              Get App
            </button>
          </div>
        </div>

        {/* Screenshots & Description */}
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Screenshots</h2>
          <div className="flex flex-wrap gap-4 overflow-x-auto pb-4">
            {app.screenshots.map((src, index) => (
              <img 
                key={index}
                src={src}
                alt={`${app.name} screenshot ${index + 1}`}
                className="w-72 h-48 rounded-lg shadow-md object-cover flex-shrink-0"
                width="288"
                height="192"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; 
                  target.src = "https://placehold.co/288x192/CCCCCC/FFFFFF?text=Screenshot";
                }}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">About this app</h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{app.fullDescription}</p>
          </div>
          <div className="md:col-span-1 bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Technical Details</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2"><strong>Developer:</strong> {app.developer}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2"><strong>Version:</strong> {app.version}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Category:</strong> {app.category}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main App Component (Home) ---
export default function Home() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Featured');
  const [selectedApp, setSelectedApp] = useState<App | null>(null);

  // 1. Data Fetching
  useEffect(() => {
    document.title = "App Market - Discover Apps";

    const fetchApps = async () => {
      try {
        const response = await fetch('/applist.json'); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: App[] = await response.json();
        setApps(data);
      } catch (err) {
        console.error("Failed to fetch app list:", err); 
        setError("Failed to load apps. Ensure 'public/applist.json' is present and correctly formatted.");
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []); 

  // 2. Filtering Logic (Memoized for performance)
  const filteredApps = useMemo(() => {
    let filtered = apps;

    // Filter by Tab/Category
    if (activeTab !== 'All Apps' && activeTab !== 'Featured') {
      filtered = filtered.filter(app => app.category === activeTab);
    } else if (activeTab === 'Featured') {
      // Simple 'Featured' logic: apps with rating >= 4.5
      filtered = filtered.filter(app => app.rating >= 4.5);
    }

    // Filter by Search Term
    if (searchTerm.trim() !== '') {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.name.toLowerCase().includes(lowerCaseSearch) ||
        app.description.toLowerCase().includes(lowerCaseSearch) ||
        app.category.toLowerCase().includes(lowerCaseSearch)
      );
    }

    return filtered;
  }, [apps, activeTab, searchTerm]);

  // If an app is selected, render the details page immediately
  if (selectedApp) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans">
        <AppDetails app={selectedApp} onBack={() => setSelectedApp(null)} />
      </div>
    );
  }

  // Render the main store view
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      
      {/* Header and Search Bar (Microsoft Store style) */}
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-3 md:mb-0">
            App Store
          </h1>
          <input
            type="text"
            placeholder="Search apps, games, and categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
          />
        </div>
      </header>

      {/* Tabs Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-[72px] md:top-[76px] z-10">
        <div className="container mx-auto px-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSearchTerm(''); }}
              className={`inline-block py-3 px-4 text-sm font-medium transition-colors duration-200 border-b-2 
                ${activeTab === tab 
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`
              }
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      <main className="container mx-auto p-6 md:p-10">
        <h2 className="text-3xl font-bold mb-8 capitalize">{activeTab} Apps</h2>
        
        {loading && (
          <div className="text-center text-xl text-gray-500 dark:text-gray-400 py-10">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-t-4 border-blue-500 border-opacity-50 rounded-full"></div>
            <p className="mt-2">Loading apps...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-200 p-4 rounded-lg shadow-md">
            <p className="font-semibold mb-2">Error Loading Data</p>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && filteredApps.length === 0 && (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <p className="text-2xl font-semibold">No results found.</p>
            <p className="mt-2">Try a different search term or category.</p>
          </div>
        )}
        
        {!loading && !error && filteredApps.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredApps.map((app) => (
              <AppCard key={app.id} app={app} onSelect={setSelectedApp} />
            ))}
          </div>
        )}
      </main>

      <footer className="text-center py-8 mt-10 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} App Store Demo. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
