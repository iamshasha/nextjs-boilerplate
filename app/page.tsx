"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';

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
const TRANSITION_DURATION_MS = 400;

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
        {/* Share Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        <span className="hidden sm:inline">Share</span>
      </button>
      {shareMessage && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 p-2 bg-green-500 text-white text-xs rounded-lg shadow-xl animate-bounce-in z-30 opacity-100 transition-opacity duration-300 whitespace-nowrap">
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
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] transform cursor-pointer"
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
            
            {/* Clickable Developer Name (replaces category tag) */}
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

  useEffect(() => {
    // Start the slide-in transition on mount
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Implements the specific download URL format
  const handleInstallClick = (app: App) => {
    // Sanitize name for URL: replace spaces with '_' and remove non-alphanumeric/non-dash characters
    const sanitizedName = app.name.replace(/ /g, '_').replace(/[^\w-]/g, ''); 
    const downloadUrl = `https://yqhnhdptqz5eavtl.public.blob.vercel-storage.com/${app.id}/${sanitizedName}.app`;
    window.open(downloadUrl, '_blank');
    console.log(`Attempting to download ${app.name} from: ${downloadUrl}`);
  };

  return (
    <div 
      className={`fixed inset-0 z-20 min-h-screen bg-gray-100 dark:bg-gray-900 transition-all duration-[${TRANSITION_DURATION_MS}ms] ease-out 
        ${isMounted ? 'translate-x-0' : 'translate-x-full'}`} // Slide-in transition
    >
      <div className="max-w-7xl mx-auto p-6 md:p-10">
        <button 
          onClick={onBack} 
          className="flex items-center text-blue-600 dark:text-blue-400 mb-6 hover:underline transition-colors duration-200 cursor-pointer transform hover:scale-[1.05]"
        >
          {/* Back Arrow Icon */}
          <svg className="w-5 h-5 mr-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to App Market
        </button>

        {/* Main Details Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 md:p-10 transition-all duration-300">
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
                <button 
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 cursor-pointer"
                  onClick={() => handleInstallClick(app)}
                >
                  Get App
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
            <div className="md:col-span-1 bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-inner transition-colors duration-300">
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

  // 2. Function to update URL and internal state
  const updateUrl = useCallback((newState: Partial<typeof urlState>) => {
    const currentState = getUrlState();
    const mergedState = { ...currentState, ...newState };

    // Logic to clear conflicting states when setting a new primary state
    if (newState.appId !== undefined) {
      mergedState.search = '';
      mergedState.dev = null;
    }
    if (newState.dev !== undefined && newState.dev !== null) {
        mergedState.tab = 'All Apps';
        mergedState.appId = null;
        mergedState.search = '';
    }
    if (newState.tab !== undefined && newState.tab !== mergedState.tab) {
        mergedState.appId = null;
        mergedState.dev = null;
        mergedState.search = '';
    }
    if (newState.search !== undefined) {
        mergedState.appId = null;
        mergedState.dev = null;
    }

    const newParams = new URLSearchParams();
    if (mergedState.tab && mergedState.tab !== 'Featured') newParams.set('tab', mergedState.tab);
    if (mergedState.search) newParams.set('search', mergedState.search);
    if (mergedState.appId) newParams.set('appId', mergedState.appId.toString());
    if (mergedState.dev) newParams.set('dev', mergedState.dev);

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

    // Filter by Developer first (highest priority filter)
    if (dev) {
        filtered = filtered.filter(app => app.developer === dev);
    } 
    // Filter by Tab/Category
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
        app.developer.toLowerCase().includes(lowerCaseSearch) || // Search by developer name too
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
    updateUrl({ dev: developer, appId: null, search: '' });
  }, [updateUrl]);


  // --- Main Render Logic ---

  return (
    // Relative position and overflow-x-hidden are essential for the absolute positioning and slide transition
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans relative overflow-x-hidden">
      
      {/* Main Content (Always visible) */}
      <div className={`transition-all duration-[${TRANSITION_DURATION_MS}ms] ease-out ${selectedApp ? 'opacity-30 pointer-events-none scale-[0.98]' : 'opacity-100 scale-100'}`}>
        
        {/* Header and Search Bar */}
        <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-10 transition-colors duration-300">
          <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-3 md:mb-0 transition-colors duration-300">
              App Store
            </h1>
            <input
              type="text"
              placeholder="Search apps, developers, and categories..."
              value={urlState.search}
              onChange={(e) => updateUrl({ search: e.target.value })}
              className="w-full md:w-96 p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300 shadow-inner"
            />
          </div>
        </header>

        {/* Tabs Navigation */}
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-[72px] md:top-[76px] z-10 transition-colors duration-300">
          <div className="container mx-auto px-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => updateUrl({ tab })}
                className={`inline-block py-3 px-4 text-sm font-medium transition-all duration-300 border-b-2 cursor-pointer transform hover:scale-[1.05] 
                  ${urlState.tab === tab && !urlState.dev
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-bold' 
                    : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:border-gray-300'}`
                }
              >
                {tab}
              </button>
            ))}
          </div>
        </nav>

        <main className="container mx-auto p-6 md:p-10">
          <div className="flex justify-between items-center mb-8 transition-all duration-300">
              <h2 className="text-3xl font-bold capitalize transition-colors duration-300">
                  {urlState.dev ? `Apps by ${urlState.dev}` : `${urlState.tab} Apps`}
              </h2>
              {urlState.dev && (
                  <button
                      onClick={() => updateUrl({ dev: null, tab: 'All Apps' })}
                      className="text-sm px-3 py-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-all duration-200 cursor-pointer hover:shadow-sm transform hover:scale-[1.05]"
                  >
                      &times; Clear Filter
                  </button>
              )}
          </div>
          
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
