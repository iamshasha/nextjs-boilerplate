"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';

// --- Utility Functions for Inline SVG Icons (Mimicking Font Awesome) ---
const Icon = ({ name, className = 'w-5 h-5' }: { name: string, className?: string }) => {
  // FIX: Changed JSX.Element to React.JSX.Element for correct TypeScript scoping
  const iconMap: { [key: string]: React.JSX.Element } = {
    // Nav Icons
    'Featured': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.875 1.577c-.503-.956-1.89-.956-2.392 0l-1.325 2.502-2.73 4.279c-.56.883-.105 1.95 1.055 2.05l2.25.213L9 16l-1.125-1.956c-.502-.871-1.748-.871-2.25 0L4.5 16l-1.125-1.956c-.502-.871-1.748-.871-2.25 0L0 16.044V22c0 1.104.896 2 2 2h20c1.104 0 2-.896 2-2V16.044l-1.125-1.956c-.502-.871-1.748-.871-2.25 0L19.5 16l-1.125-1.956c-.502-.871-1.748-.871-2.25 0L15 16l-1.125-1.956c-.502-.871-1.748-.871-2.25 0L10.875 16l-1.125-1.956c-.502-.871-1.748-.871-2.25 0L7.5 16.044z"/><path d="M12 21c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9z" opacity=".25" fill="currentColor"/><path d="M12 17c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" fill="currentColor"/></svg>,
    'All Apps': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    'Productivity': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 17h5l-5-5V7c0-2.209-1.791-4-4-4s-4 1.791-4 4v5l-5 5h5l1-1h6l1 1zM9 7h6"/></svg>,
    'Finance': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8H8M12 6v12M12 18a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3z"/></svg>,
    'Graphics & Design': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M12 4v16M16 4h-4M8 4H3M4 16h4M16 8h4M4 8h8M16 12h5M4 12h8M16 16h4M4 20h4"/></svg>,
    'Music & Audio': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13M15 13a4 0 1 0 0 8 4 4 0 0 0 0-8zM4 18a4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>,
    'Health & Fitness': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
    'Developer Tools': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="10" y1="2" x2="14" y2="22"/></svg>,
    'Books & Reference': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 9V7c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2M7 5v14M11 5v14M15 5v14"/></svg>,
    'Food & Drink': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h7v11H3V3zM14 14h7v7h-7v-7zM14 3h7v7h-7V3zM3 18h7v3H3v-3z"/></svg>,
    
    // Share Icon
    'Share': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
  };

  const selectedIcon = iconMap[name] || <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>;
  
  return React.cloneElement(selectedIcon, { className });
};

// --- TypeScript Interface for our App data ---
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
const TRANSITION_DURATION_MS = 400; // For Details Slide-in

// --- Helper Component for Star Ratings ---
function StarRating({ rating, size = 'w-4 h-4' }: { rating: number, size?: string }) {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = totalStars - fullStars - halfStar;

  const StarIcon = ({ color }: { color: string }) => (
    <svg className={`${size} ${color} transition-colors duration-300`} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.868 5.748h6.04c.969 0 1.371 1.24.588 1.81l-4.887 3.548 1.868 5.748c.3.921-.755 1.688-1.54 1.18l-4.887-3.548-4.887 3.548c-.784.508-1.84-.259-1.54-1.18l1.868-5.748-4.887-3.548c-.783-.57-.38-1.81.588-1.81h6.04L9.049 2.927z" />
    </svg>
  );

  return (
    <div className="flex items-center" aria-label={`Rating: ${rating} out of 5 stars`}>
      {[...Array(fullStars)].map((_, i) => <StarIcon key={`full-${i}`} color="text-yellow-400" />)}
      {halfStar > 0 && (
        <svg key="half" className={`${size} text-yellow-400 transition-colors duration-300`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 15.27l-4.887 3.548c-.784.508-1.84-.259-1.54-1.18l1.868-5.748-4.887-3.548c-.783-.57-.38-1.81.588-1.81h6.04L9.049 2.927c.3-.921 1.603-.921 1.902 0l1.868 5.748h6.04c.969 0 1.371 1.24.588 1.81l-4.887 3.548 1.868 5.748c.3.921-.755 1.688-1.54 1.18L10 15.27zM10 12.78V5.53l-1.35 4.15H4.2l3.48 2.53-1.34 4.14L10 12.78z" />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => <StarIcon key={`empty-${i}`} color="text-gray-300 dark:text-gray-600" />)}
      <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">{rating.toFixed(1)}</span>
    </div>
  );
}

// --- Helper Component for Image Zoom Modal ---
function ZoomedImageModal({ src, onClose }: { src: string; onClose: () => void; }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Start fade-in transition
    setIsVisible(true);
  }, []);

  const handleClose = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for fade-out
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-300 ${isVisible ? 'bg-opacity-90 opacity-100' : 'bg-opacity-0 opacity-0'}`}
      onClick={handleClose}
    >
      <button 
        onClick={handleClose} 
        className="absolute top-4 right-4 text-white text-4xl font-light p-2 rounded-full bg-gray-900 bg-opacity-50 hover:bg-opacity-80 transition-colors duration-200 z-50 cursor-pointer"
        aria-label="Close zoom view"
      >
        &times;
      </button>
      <div className="p-4 max-w-[90vw] max-h-[90vh] transition-transform duration-300" onClick={e => e.stopPropagation()}>
        <img
          src={src}
          alt="Zoomed Screenshot"
          className="max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-all duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null; 
            target.src = "https://placehold.co/800x600/CCCCCC/FFFFFF?text=Image+Load+Error";
          }}
        />
      </div>
    </div>
  );
}

// --- Helper Component for Share Button ---
function ShareButton({ app }: { app: App }) {
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  const handleShare = (app: App) => {
    // Construct the URL for the current app detail page
    const url = `${window.location.origin}${window.location.pathname}?appId=${app.id}`;
    
    try {
      // Use document.execCommand('copy') for compatibility in embedded environments
      const el = document.createElement('textarea');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      
      setShareMessage('Link copied to clipboard!');
      setTimeout(() => setShareMessage(null), 3000);
    } catch (err) {
      setShareMessage('Could not copy link.');
      console.error('Failed to copy URL: ', err);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => handleShare(app)}
        className="px-6 py-3 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-bold rounded-xl transition-all duration-200 hover:bg-blue-200 dark:hover:bg-blue-800 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 cursor-pointer flex items-center space-x-2"
        title={`Share ${app.name}`}
      >
        {/* Updated Share Icon */}
        <Icon name="Share" className="w-5 h-5"/>
        <span className="hidden sm:inline">Share</span>
      </button>
      {shareMessage && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 p-2 bg-green-500 text-white text-xs rounded-lg shadow-xl z-30 opacity-100 transition-opacity duration-300 whitespace-nowrap">
          {shareMessage}
        </div>
      )}
    </div>
  );
}

// --- App Card Component ---
function AppCard({ app, onSelect, onDeveloperFilter }: { app: App, onSelect: (app: App) => void, onDeveloperFilter: (developer: string) => void }) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null; 
    target.src = "https://placehold.co/128x128/CCCCCC/FFFFFF?text=Icon";
  };
  
  return (
    <div 
      // Corrected: Apply semi-transparent background for glass effect
      className="bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] transform cursor-pointer glass"
      onClick={() => onSelect(app)} // Click card body to open details
    >
      <div className="flex flex-col h-full p-4 space-y-3">
        <div className="flex items-center space-x-4">
          <img
            src={app.iconUrl}
            alt={`${app.name} icon`}
            className="w-16 h-16 md:w-20 md:h-20 rounded-xl flex-shrink-0 object-cover transition-all duration-300 shadow-md"
            width="80"
            height="80"
            onError={handleImageError}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate transition-colors duration-300">{app.name}</h3>
            
            {/* Clickable Developer Name (filter trigger) */}
            <button 
                onClick={(e) => {
                    e.stopPropagation(); // Prevent card click from opening details
                    onDeveloperFilter(app.developer);
                }}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 transition-all duration-200 hover:underline hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none"
            >
                {app.developer}
            </button>
            <StarRating rating={app.rating} size='w-3 h-3' />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 transition-colors duration-300">
            {app.description}
          </p>
        </div>
      </div>
    </div>
  );
}

// --- App Details Page Component ---
function AppDetails({ 
  app, 
  onBack, 
  onDeveloperClick, 
  onImageClick,
}: { 
  app: App; 
  onBack: () => void; 
  onDeveloperClick: (developer: string) => void; 
  onImageClick: (src: string) => void; 
}) {
  
  const [isMounted, setIsMounted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false); // NEW: Download state

  useEffect(() => {
    // Start the slide-in transition on mount
    setIsMounted(true);
    // Optional: Hide scrollbar of the main window when mounted
    document.body.style.overflow = 'hidden';
    return () => {
      setIsMounted(false);
      document.body.style.overflow = '';
    };
  }, []);

  // Implements the specific download URL format
  const handleInstallClick = (app: App) => {
    if (isDownloading) return;

    setIsDownloading(true); // Start loading

    const sanitizedName = app.name.replace(/ /g, '_').replace(/[^\w-]/g, ''); 
    const downloadUrl = `https://yqhnhdptqz5eavtl.public.blob.vercel-storage.com/${app.id}/${sanitizedName}.app`;
    
    // Open the new window immediately
    window.open(downloadUrl, '_blank');
    console.log(`Attempting to download ${app.name} from: ${downloadUrl}`);

    // Stop loading after a short delay (1 second for visual feedback)
    setTimeout(() => {
      setIsDownloading(false);
    }, 1000); 
  };

  return (
    // Outer Container (The one that slides in) - Changed background for better blur contrast
    <div 
      className={`fixed inset-0 z-20 h-screen overflow-y-auto transition-all duration-[${TRANSITION_DURATION_MS}ms] ease-out bg-gray-100 dark:bg-gray-950 
        ${isMounted ? 'translate-x-0' : 'translate-x-full'}`} // Slide-in transition
    >
      <div className="max-w-7xl mx-auto p-6 md:p-10 min-h-full">
        <button 
          onClick={onBack} 
          className="flex items-center text-blue-600 dark:text-blue-400 mb-6 hover:underline transition-colors duration-200 cursor-pointer transform hover:scale-[1.05]"
        >
          {/* Back Arrow Icon */}
          <svg className="w-5 h-5 mr-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to App Market
        </button>

        {/* Main Details Section - Apply Glassmorphism with semi-transparent background */}
        <div className="bg-white/70 dark:bg-gray-800/70 rounded-3xl shadow-2xl p-6 md:p-10 transition-all duration-300 glass">
          <div className="flex flex-col md:flex-row md:space-x-8">
            <button
              onClick={() => onImageClick(app.iconUrl)} 
              className="p-0 border-none bg-transparent hover:opacity-80 transition-opacity duration-200 cursor-pointer transform hover:scale-[1.05] flex-shrink-0"
            >
              <img
                src={app.iconUrl}
                alt={`${app.name} icon`}
                className="w-28 h-28 md:w-36 md:h-36 rounded-3xl object-cover shadow-xl transition-all duration-300"
                width="144"
                height="144"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; 
                  target.src = "https://placehold.co/144x144/CCCCCC/FFFFFF?text=Icon";
                }}
              />
            </button>
            <div className="flex-1 mt-4 md:mt-0">
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-2 transition-colors duration-300">{app.name}</h1>
              <p className="text-xl text-blue-600 dark:text-blue-400 font-semibold mb-3 transition-colors duration-300">{app.category}</p>
              
              <div className="flex items-center space-x-4 mb-4">
                <StarRating rating={app.rating} size='w-6 h-6' />
                <span className="text-lg text-gray-600 dark:text-gray-400 transition-colors duration-300">({app.rating.toFixed(1)} Rating)</span>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 transition-colors duration-300">{app.description}</p>
              
              <div className="flex flex-wrap gap-4 items-center">
                {/* Download Button with Loading State */}
                <button 
                  className={`px-8 py-3 font-bold text-lg rounded-xl transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-opacity-50 cursor-pointer flex items-center justify-center space-x-2 
                    ${isDownloading 
                        ? 'bg-gray-400 text-gray-800 dark:bg-gray-600 dark:text-gray-200' // Loading style
                        : 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500' // Normal style
                    }`}
                  onClick={() => handleInstallClick(app)}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                      <>
                          <div className="animate-spin inline-block w-5 h-5 border-2 border-t-2 border-white border-opacity-75 rounded-full"></div>
                          <span>Preparing...</span>
                      </>
                  ) : (
                      <span>Get App</span>
                  )}
                </button>
                <ShareButton app={app} /> {/* Share Button Component */}
              </div>
            </div>
          </div>

          {/* Screenshots & Description */}
          <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white transition-colors duration-300">Screenshots</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
              {app.screenshots.map((src, index) => (
                <button 
                  key={index}
                  onClick={() => onImageClick(src)} 
                  className="p-0 border-none bg-transparent hover:opacity-90 transition-opacity duration-200 cursor-pointer transform hover:scale-[1.02] flex-shrink-0"
                >
                  <img 
                    src={src}
                    alt={`${app.name} screenshot ${index + 1}`}
                    className="w-72 h-48 rounded-xl shadow-lg object-cover transition-shadow duration-300"
                    width="288"
                    height="192"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; 
                      target.src = "https://placehold.co/288x192/CCCCCC/FFFFFF?text=Screenshot";
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white transition-colors duration-300">About this app</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap transition-colors duration-300">{app.fullDescription}</p>
            </div>
            {/* Technical Details - Apply semi-transparent background to inner element */}
            <div className="md:col-span-1 bg-gray-100/70 dark:bg-gray-700/70 p-6 rounded-xl shadow-inner transition-colors duration-300 glass">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white transition-colors duration-300">Technical Details</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                <strong>Developer:</strong> 
                <button
                  onClick={() => onDeveloperClick(app.developer)}
                  className="text-blue-600 dark:text-blue-400 ml-1 hover:underline transition-colors duration-200 cursor-pointer"
                >
                  {app.developer}
                </button>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300"><strong>Version:</strong> {app.version}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300"><strong>Category:</strong> {app.category}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Footer to ensure the last content isn't cut off by the viewport bottom */}
      <div className="h-10"></div> 
    </div>
  );
}

// --- Main App Component (Home) ---
export default function Home() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // --- URL State Management ---

  // 1. Function to read state from URL
  const getUrlState = useCallback(() => {
    if (typeof window === 'undefined') return { tab: 'Featured', search: '', appId: null, dev: null };
    
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab') || 'Featured';
    const search = params.get('search') || '';
    const appId = params.get('appId');
    const dev = params.get('dev');
    
    return { 
      tab: TABS.includes(tab) ? tab : 'Featured', 
      search, 
      appId: appId ? parseInt(appId, 10) : null, 
      dev 
    };
  }, []);

  const [urlState, setUrlState] = useState(getUrlState());

  // 2. Function to update URL and internal state (Improved precedence logic for dev filter)
  const updateUrl = useCallback((newState: Partial<typeof urlState>) => {
    let mergedState = { ...getUrlState(), ...newState };

    // 1. Handle App Details View (Highest Priority: Clears search/dev)
    if (newState.appId !== undefined) {
      if (newState.appId !== null) {
        mergedState.search = '';
        mergedState.dev = null;
        // Keep tab for back navigation context
      } else {
        mergedState.appId = null; 
      }
    }
    
    // 2. Handle Developer Filter (Second Highest Priority: Clears search/appId)
    if (newState.dev !== undefined) {
      if (newState.dev !== null) {
        mergedState.tab = 'All Apps'; // Force tab to All Apps when a developer is filtered
        mergedState.appId = null;
        mergedState.search = '';
      } else {
        mergedState.dev = null; // Clearing developer filter
      }
    }

    // 3. Handle Search Change (Third Priority: Clears appId/dev)
    if (newState.search !== undefined) {
      if (newState.search !== '') {
          mergedState.appId = null;
          mergedState.dev = null;
      }
    }
    
    // 4. Handle Tab/Category Change (Lowest Priority: Clears search/appId, but respects the current active dev state unless explicitly cleared)
    if (newState.tab !== undefined) {
      mergedState.appId = null;
      mergedState.search = '';
      // If we are actively changing the tab (not via dev filter activation), clear the dev filter.
      if (newState.dev === undefined && mergedState.dev) {
          mergedState.dev = null;
      }
    }


    // Build the URL
    const newParams = new URLSearchParams();
    // Developer filter has precedence in the URL parameters
    if (mergedState.dev) {
        newParams.set('dev', mergedState.dev);
        // Only set the tab to 'All Apps' if dev filter is active (as per logic)
        newParams.set('tab', 'All Apps');
    } else {
        if (mergedState.tab && mergedState.tab !== 'Featured') newParams.set('tab', mergedState.tab);
    }

    if (mergedState.search) newParams.set('search', mergedState.search);
    if (mergedState.appId) newParams.set('appId', mergedState.appId.toString());
    
    const newUrl = `${window.location.pathname}${newParams.toString() ? '?' + newParams.toString() : ''}`;
    window.history.pushState(mergedState, '', newUrl);
    setUrlState(mergedState);
  }, [getUrlState]);

  // 3. Effect to handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setUrlState(getUrlState());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [getUrlState]);

  // --- Data & Filtering ---

  // 1. Data Fetching
  useEffect(() => {
    document.title = "App Market - Discover Apps";

    const fetchApps = async () => {
      try {
        // NOTE: This assumes 'applist.json' is available in the public directory
        const response = await fetch('/applist.json'); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: App[] = await response.json();
        if (!Array.isArray(data)) {
            throw new Error("Invalid data structure received. Expected an array.");
        }
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

    const { tab, search, dev } = urlState;

    // Filter by Developer first (Highest Priority Filter using 'dev' parameter)
    if (dev) {
        filtered = filtered.filter(app => app.developer === dev);
    } 
    // Filter by Tab/Category (Only if NO developer filter is active)
    else if (tab !== 'All Apps' && tab !== 'Featured') {
      filtered = filtered.filter(app => app.category === tab);
    } else if (tab === 'Featured') {
      // Simple 'Featured' logic: apps with rating >= 4.5
      filtered = filtered.filter(app => app.rating >= 4.5);
    }

    // Filter by Search Term (applied last)
    if (search.trim() !== '') {
      const lowerCaseSearch = search.toLowerCase();
      filtered = filtered.filter(app => 
        app.name.toLowerCase().includes(lowerCaseSearch) ||
        app.description.toLowerCase().includes(lowerCaseSearch) ||
        app.developer.toLowerCase().includes(lowerCaseSearch) ||
        app.category.toLowerCase().includes(lowerCaseSearch)
      );
    }

    return filtered;
  }, [apps, urlState]);

  // Find the currently selected app object
  const selectedApp = useMemo(() => {
    return apps.find(a => a.id === urlState.appId) || null;
  }, [apps, urlState.appId]);


  // --- Handlers ---

  const handleDeveloperClick = useCallback((developer: string) => {
    // This is the special action that sets the 'dev' parameter and ensures state consistency
    updateUrl({ dev: developer, appId: null, search: '', tab: 'All Apps' });
  }, [updateUrl]);


  // --- Main Render Logic ---

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 font-sans relative overflow-x-hidden">
      
      {/* Custom CSS for Glassmorphism */}
      <style>{`
          .glass {
              backdrop-filter: blur(12px);
              -webkit-backdrop-filter: blur(12px);
              /* Optional: subtle border for glass look */
              border: 1px solid rgba(255, 255, 255, 0.2); 
          }
          /* Ensure a background is present for blur to work. This is the main page background. */
          body {
            background-color: #f7f7fa; /* Light base */
            background-image: linear-gradient(135deg, #f7f7fa 0%, #e0e0e8 100%);
            @media (prefers-color-scheme: dark) {
                background-color: #121212; /* Dark base */
                background-image: linear-gradient(135deg, #121212 0%, #1c1c1c 100%);
            }
          }
      `}</style>
      
      {/* Main Content (Always visible) */}
      <div className={`transition-all duration-[${TRANSITION_DURATION_MS}ms] ease-out ${selectedApp ? 'opacity-30 pointer-events-none scale-[0.98]' : 'opacity-100 scale-100'}`}>
        
        {/* Header and Search Bar - Apply Glassmorphism with semi-transparent background */}
        <header className="bg-white/70 dark:bg-gray-800/70 shadow-lg sticky top-0 z-10 transition-colors duration-300 glass">
          <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-3 md:mb-0 transition-colors duration-300">
              App Store
            </h1>
            <input
              type="text"
              placeholder="Search apps, developers, and categories..."
              value={urlState.search}
              onChange={(e) => updateUrl({ search: e.target.value })}
              // Corrected: Apply semi-transparent background for search input
              className="w-full md:w-96 p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700/70 dark:text-white transition-all duration-300 shadow-inner glass"
            />
          </div>
        </header>

        {/* Tabs Navigation (With Icons) - Apply Glassmorphism with semi-transparent background */}
        <nav className="bg-white/70 dark:bg-gray-800/70 border-b border-gray-200 dark:border-gray-700 sticky top-[72px] md:top-[76px] z-10 transition-colors duration-300 glass">
          <div className="container mx-auto px-6 overflow-x-auto whitespace-nowrap py-1"> 
            {TABS.map(tab => (
              <button
                key={tab}
                // Check if the current tab should be active, respecting the dev filter precedence
                onClick={() => updateUrl({ tab })}
                className={`inline-flex items-center space-x-2 py-3 px-4 text-sm font-medium transition-all duration-300 border-b-2 cursor-pointer transform hover:scale-[1.03] 
                  ${(urlState.dev === null && urlState.tab === tab) || (urlState.dev && tab === 'All Apps') // Highlight 'All Apps' when dev filter is on
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-bold' 
                    : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:border-gray-300'}`
                }
                // Disable explicit tab changes if a developer filter is active, forcing the user to clear it first, improving UX flow.
                disabled={!!urlState.dev && tab !== 'All Apps'}
                title={!!urlState.dev && tab !== 'All Apps' ? `Clear ${urlState.dev} filter to switch tabs` : tab}
              >
                <Icon 
                  name={tab} 
                  className={`w-4 h-4 transition-colors duration-300 ${(urlState.dev === null && urlState.tab === tab) || (urlState.dev && tab === 'All Apps') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} 
                />
                <span>{tab}</span>
              </button>
            ))}
          </div>
        </nav>

        <main className="container mx-auto p-6 md:p-10">
          <div className="flex justify-between items-center mb-8 transition-all duration-300">
              <h2 className="text-3xl font-bold capitalize transition-colors duration-300">
                  {/* Title updated based on active filter (dev filter has precedence) */}
                  {urlState.dev ? `Apps by ${urlState.dev}` : `${urlState.tab} Apps`}
              </h2>
              {urlState.dev && (
                  <button
                      // Use updateUrl to explicitly clear the dev filter
                      onClick={() => updateUrl({ dev: null, tab: 'All Apps' })}
                      className="text-sm px-3 py-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-all duration-200 cursor-pointer hover:shadow-sm transform hover:scale-[1.05]"
                  >
                      &times; Clear {urlState.dev} Filter
                  </button>
              )}
          </div>
          
          {/* Wrapper for transition when content changes (tab/search/dev) */}
          <div 
            key={`${urlState.tab}-${urlState.search}-${urlState.dev}`} 
            className="animate-fade-in transition-opacity duration-300 ease-in-out" 
            style={{ 
              animationName: 'fade-in',
              animationDuration: '0.3s',
              animationTimingFunction: 'ease-out',
            }}
          >
              <style>{`
                  /* Define a simple keyframe animation for the fade-in effect */
                  @keyframes fade-in {
                      from { opacity: 0; transform: translateY(10px); }
                      to { opacity: 1; transform: translateY(0); }
                  }
                  .animate-fade-in {
                      animation-name: fade-in;
                      animation-duration: 0.3s;
                      animation-timing-function: ease-out;
                      animation-fill-mode: forwards;
                  }
              `}</style>

              {loading && (
                <div className="text-center text-xl text-gray-500 dark:text-gray-400 py-10 transition-opacity duration-500">
                  <div className="animate-spin inline-block w-8 h-8 border-4 border-t-4 border-blue-500 border-opacity-50 rounded-full"></div>
                  <p className="mt-2">Loading apps...</p>
                </div>
              )}
              
              {error && (
                <div className="text-center text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-200 p-4 rounded-xl shadow-md transition-colors duration-300">
                  <p className="font-semibold mb-2">Error Loading Data</p>
                  <p>{error}</p>
                </div>
              )}

              {!loading && !error && Array.isArray(filteredApps) && filteredApps.length === 0 && (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400 transition-opacity duration-300">
                  <p className="text-2xl font-semibold">No results found.</p>
                  <p className="mt-2">Try a different filter or search term.</p>
                </div>
              )}
              
              {!loading && !error && Array.isArray(filteredApps) && filteredApps.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-500">
                  {filteredApps.map((app) => (
                    <AppCard 
                      key={app.id} 
                      app={app} 
                      onSelect={(a) => updateUrl({ appId: a.id })} 
                      onDeveloperFilter={handleDeveloperClick}
                    />
                  ))}
                </div>
              )}
          </div>
        </main>

        <footer className="text-center py-8 mt-10 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} App Store Demo. All rights reserved.
          </p>
        </footer>
      </div>
      
      {/* App Details and Modals (Rendered absolutely on top) */}
      {selectedApp && (
          <AppDetails 
            app={selectedApp} 
            onBack={() => updateUrl({ appId: null })}
            onDeveloperClick={handleDeveloperClick}
            onImageClick={setZoomedImage}
          />
      )}
      {zoomedImage && <ZoomedImageModal src={zoomedImage} onClose={() => setZoomedImage(null)} />}
    </div>
  );
}
