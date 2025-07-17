import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col absolute w-full z-50 items-center justify-center min-h-screen bg-orange-50 text-orange-800 px-6">
      <div className="max-w-md w-full space-y-6">
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-full bg-orange-100 border-2 border-orange-300 flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-orange-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-medium text-orange-900">404 Error</h1>
          <h2 className="text-xl font-normal text-orange-600">Page Not Found</h2>
          <p className="text-orange-500 mt-4">
            We couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Link
            to="/"
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-md transition-colors text-center"
          >
            Return Home
          </Link>
          <button className="flex-1 border border-orange-300 hover:bg-orange-100 text-orange-700 font-medium py-3 px-4 rounded-md transition-colors">
            Contact Support
          </button>
        </div>

        <div className="pt-8 text-center text-sm text-orange-400">
          <p>Still need help? Try our <a href="#" className="text-orange-600 hover:text-orange-900 underline">help center</a></p>
        </div>
      </div>
    </div>
  );
}

export default NotFound;