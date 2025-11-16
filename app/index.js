import React, { useState, useEffect } from 'react'; // Import React, useState, and useEffect
// import Head from 'next/head'; // Removed: 'next/head' is not available in this preview environment
// import path from 'path'; // Removed: Node.js module not available in browser
// import fs from 'fs/promises'; // Removed: Node.js module not available in browser

// --- Helper Component for Star Ratings ---
// We define this here to keep everything in one file.
function StarRating({ rating }) {
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
// This is the individual card for each app.
function AppCard({ app }) {
  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="flex items-center p-5 space-x-4">
        {/* We use a standard <img> tag here. 
            If you were using next/image, you'd need to add 'placehold.co' 
            to the 'domains' in your next.config.js file. */}
        <img
          src={app.iconUrl}
          alt={`${app.name} icon`}
          className="w-20 h-20 rounded-xl flex-shrink-0"
          width="80"
          height="80"
          onError={(e) => {
            // Fallback in case the placeholder image fails
            e.target.onerror = null; 
            e.target.src = "https://placehold.co/128x128/CCCCCC/FFFFFF?text=Error&font=inter";
          }}
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
          onClick={() => console.log(`Installing ${app.name}`)} // Placeholder action
        >
          Get
        </button>
      </div>
    </div>
  );
}

// --- Main Page Component ---
// This is your "App Market" page.
// We've modified this to fetch data on the client-side for this preview environment.
export default function Home() { // Removed 'apps' prop
  const [apps, setApps] = useState([]); // Add state for apps
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  // Fetch app data from the applist.json file on the client side
  useEffect(() => {
    // Set the document title (workaround for missing next/head)
    document.title = "App Market";

    // We assume applist.json is in the 'public' folder and served at the root
    fetch('/applist.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok (${response.status})`);
        }
        return response.json();
      })
      .then(data => {
        setApps(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch app list:", err);
        setError("Failed to load apps. Please make sure 'public/applist.json' exists.");
        setLoading(false);
      });
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* The <Head> component from 'next/head' would normally go here
        to set the title and meta tags in a Next.js application.
      */}

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
        
        {/* App Grid */}
        {loading && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10">
            Loading apps...
          </div>
        )}
        {error && (
          <div className="text-center text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-200 p-4 rounded-lg">
            {error}
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

// --- Data Fetching (Next.js Way) ---
// The 'getStaticProps' function below is specific to Next.js and runs on the server
// during the build process. It cannot be run in this browser-based preview environment.
// We have replaced its functionality with client-side 'fetch' in the 'Home' component above
// so that you can see a working preview.
// In your *actual* Vercel/Next.js project, you would remove the client-side
// fetching (useState, useEffect) and re-enable this 'getStaticProps' function.
/*
import path from 'path'; // Node.js module for handling file paths
import fs from 'fs/promises'; // Node.js module for file system operations

export async function getStaticProps() {
  // Get the full path to the applist.json file
  // process.cwd() is the root of your Next.js project
  const filePath = path.join(process.cwd(), 'public', 'applist.json');
  
  // Read the file contents
  const jsonData = await fs.readFile(filePath, 'utf-8');
  
  // Parse the JSON data
  const data = JSON.parse(jsonData);

  // Pass the data as props to the page
  return {
    props: {
      apps: data,
    },
  };
}
*/
