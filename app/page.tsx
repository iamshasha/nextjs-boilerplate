"use client"; // This component requires client-side features like useState, useEffect, and event handlers

import React, { useState, useEffect } from 'react';

// --- TypeScript Interface for our App data ---
interface App {
  id: number;
  name: string;
  category: string;
  iconUrl: string;
  rating: number;
  description: string;
}

// --- Helper Component for Star Ratings ---
function StarRating({ rating }: { rating: number }) {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = totalStars - fullStars - halfStar;

  return (
    <div className="flex items-center" aria-label={`Rating: ${rating} out of 5 stars`}>
      {[...Array(fullStars)].map((_, i) => (
        <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.868 5.748h6.04c.969 0 1.371 1.24.588 1.81l-4.887 3.548 1.868 5.748c.3.921-.755 1.688-1.54 1.18l-4.887-3.548-4.887 3.548c-.784.508-1.84-.259-1.54-1.18l1.868-5.748-4.887-3.548c-.783-.57-.38-1.81.588-1.81h6.04L9.049 2.927z" />
        </svg>
      ))}
      {halfStar > 0 && (
        <svg key="half" className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 15.27l-4.887 3.548c-.784.508-1.84-.259-1.54-1.18l1.868-5.748-4.887-3.548c-.783-.57-.38-1.81.588-1.81h6.04L9.049 2.927c.3-.921 1.603-.921 1.902 0l1.868 5.748h6.04c.969 0 1.371 1.24.588 1.81l-4.887 3.548 1.868 5.748c.3.921-.755 1.688-1.54 1.18L10 15.27zM10 12.78V5.53l-1.35 4.15H4.2l3.48 2.53-1.34 4.14L10 12.78z" />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.868 5.748h6.04c.969 0 1.371 1.24.588 1.81l-4.887 3.548 1.868 5.748c.3.921-.755 1.688-1.54 1.18l-4.887-3.548-4.887 3.548c-.784.508-1.84-.259-1.54-1.18l1.868-5.748-4.887-3.548c-.783-.57-.38-1.81.588-1.81h6.04L9.049 2.927z" />
        </svg>
      ))}
      <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">{rating.toFixed(1)}</span>
    </div>
  );
}

// --- App Card Component ---
// FIX: Moving the image onError logic into a dedicated function for better server component safety, 
// though the whole file is 'use client', this defensive programming helps prevent build errors.
function AppCard({ app }: { app: App }) {
  // Use a stable function for the onError handler
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null; 
    target.src = "https://placehold.co/128x128/CCCCCC/FFFFFF?text=Error&font=inter";
  };
  
  // Replace alert() with console.log() to avoid blocking popups in the iframe environment
  const handleInstallClick = (appName: string) => {
    console.log(`Installing ${appName}... (Simulated)`);
    // NOTE: If you need to show feedback to the user, use a custom modal/message box, not alert().
  };

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="flex items-center p-5 space-x-4">
        <img
          src={app.iconUrl}
          alt={`${app.name} icon`}
          className="w-20 h-20 rounded-xl flex-shrink-0"
          width="80"
          height="80"
          onError={handleImageError} // Use the stable function here
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{app.name}</h3>
          <p className="text-sm text-blue-500 dark:text-blue-400 font-medium">{app.category}</p>
          <StarRating rating={app.rating} />
        </div>
      </div>
      <div className="px-5 pb-5 pt-2 flex-1 flex flex-col justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {app.description}
        </p>
        <button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={() => handleInstallClick(app.name)} // Use the stable function here
        >
          Get
        </button>
      </div>
    </div>
  );
}

// --- Main Page Component ---
export default function Home() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set document title (browser-compatible approach)
    document.title = "App Market";

    const fetchApps = async () => {
      try {
        // Fetch the JSON file from the public directory
        const response = await fetch('/applist.json'); 
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: App[] = await response.json();
        setApps(data);
      } catch (err) {
        // Logging the full error for debugging
        console.error("Failed to fetch app list:", err); 
        setError("Failed to load apps. Ensure 'public/applist.json' is present.");
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []); 

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      
      <header className="py-10 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            Welcome to App Market
          </h1>
          <p className="mt-3 text-lg text-center text-gray-600 dark:text-gray-400">
            Discover your new favorite apps, curated just for you.
          </p>
        </div>
      </header>

      <main className="container mx-auto p-6 md:p-10">
        <h2 className="text-3xl font-bold mb-8">Featured Apps</h2>
        
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
        
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {apps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        )}
      </main>

      <footer className="text-center py-8 mt-10 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} App Market. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
