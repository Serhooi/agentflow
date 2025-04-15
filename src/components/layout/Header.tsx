'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-500';
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                AgentFlow
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className={`inline-flex items-center px-1 pt-1 border-b-2 ${pathname === '/' ? 'border-blue-500' : 'border-transparent'} ${isActive('/')}`}>
                Home
              </Link>
              <Link href="/dashboard" className={`inline-flex items-center px-1 pt-1 border-b-2 ${pathname === '/dashboard' ? 'border-blue-500' : 'border-transparent'} ${isActive('/dashboard')}`}>
                Dashboard
              </Link>
              <Link href="/generate" className={`inline-flex items-center px-1 pt-1 border-b-2 ${pathname === '/generate' ? 'border-blue-500' : 'border-transparent'} ${isActive('/generate')}`}>
                Generate
              </Link>
            </nav>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative">
              <div className="flex space-x-4">
                <Link href="/auth/login" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/auth/login')}`}>
                  Login
                </Link>
                <Link href="/auth/register" className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700">
                  Register
                </Link>
              </div>
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/" className={`block pl-3 pr-4 py-2 border-l-4 ${pathname === '/' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`}>
              Home
            </Link>
            <Link href="/dashboard" className={`block pl-3 pr-4 py-2 border-l-4 ${pathname === '/dashboard' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`}>
              Dashboard
            </Link>
            <Link href="/generate" className={`block pl-3 pr-4 py-2 border-l-4 ${pathname === '/generate' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`}>
              Generate
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">U</span>
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">Guest User</div>
                <div className="text-sm font-medium text-gray-500">Please login</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link href="/auth/login" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                Login
              </Link>
              <Link href="/auth/register" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
