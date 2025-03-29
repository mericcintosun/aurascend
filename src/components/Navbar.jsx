'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-purple-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-white">
                Aura<span className="text-purple-400">Scend</span>
              </h1>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/" 
              className="text-white hover:bg-blue-800 hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium"
            >
              Ana Sayfa
            </Link>
            <Link 
              href="/features" 
              className="text-white hover:bg-blue-800 hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium"
            >
              Özellikler
            </Link>
            <Link 
              href="/about" 
              className="text-white hover:bg-blue-800 hover:text-purple-300 px-3 py-2 rounded-md text-sm font-medium"
            >
              Hakkımızda
            </Link>
            
            {/* Auth Buttons */}
            {status === 'authenticated' ? (
              <div className="flex items-center ml-3">
                <span className="text-sm text-gray-300 mr-2">{session.user.name || session.user.email}</span>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Çıkış Yap
                </button>
                <Link 
                  href="/dashboard" 
                  className="ml-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profilim
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  href="/auth/login" 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Giriş Yap
                </Link>
                <Link 
                  href="/auth/register" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-purple-300 hover:bg-blue-800 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Ana menüyü aç</span>
              {/* Icon for menu */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Icon for X */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-blue-800">
          <Link 
            href="/" 
            className="text-white hover:bg-blue-800 hover:text-purple-300 block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Ana Sayfa
          </Link>
          <Link 
            href="/features" 
            className="text-white hover:bg-blue-800 hover:text-purple-300 block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Özellikler
          </Link>
          <Link 
            href="/about" 
            className="text-white hover:bg-blue-800 hover:text-purple-300 block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Hakkımızda
          </Link>
          
          {/* Auth Buttons */}
          {status === 'authenticated' ? (
            <div className="pt-4 pb-3 border-t border-blue-800">
              <div className="flex items-center px-5">
                <div className="ml-3">
                  <div className="text-base font-medium text-white">{session.user.name || session.user.email}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <Link 
                  href="/dashboard" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-800 hover:text-purple-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profilim
                </Link>
                <button 
                  onClick={() => {
                    signOut({ callbackUrl: '/' });
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-red-700 hover:text-white"
                >
                  Çıkış Yap
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-blue-800">
              <Link 
                href="/auth/login" 
                className="block w-full text-center px-3 py-2 rounded-md text-base font-medium bg-purple-600 hover:bg-purple-700 text-white mb-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Giriş Yap
              </Link>
              <Link 
                href="/auth/register" 
                className="block w-full text-center px-3 py-2 rounded-md text-base font-medium bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 