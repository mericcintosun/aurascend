"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

// NavLink bileşeni - aktif sayfayı vurgular
const NavLink = ({ href, children, onClick }) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        href={href}
        className={`transition-colors px-3 py-2 rounded-md text-sm font-medium ${
          isActive
            ? "bg-blue-800/70 text-purple-300"
            : "text-white hover:bg-blue-800 hover:text-purple-300"
        }`}
        onClick={onClick}
      >
        {children}
      </Link>
    </motion.div>
  );
};

// Mobil NavLink bileşeni
const MobileNavLink = ({ href, children, onClick }) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Link
        href={href}
        className={`block px-3 py-2 rounded-md text-base font-medium ${
          isActive
            ? "bg-blue-800/70 text-purple-300"
            : "text-white hover:bg-blue-800 hover:text-purple-300"
        }`}
        onClick={onClick}
      >
        {children}
      </Link>
    </motion.div>
  );
};

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.nav
      className="bg-gradient-to-r from-blue-900 to-purple-900 shadow-lg sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex-shrink-0 flex items-center outline-none focus:outline-none"
              aria-label="Ana sayfaya git"
            >
              <motion.div
                className="flex items-center space-x-3 outline-none focus:outline-none focus:ring-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src="/aurascend-logo.png"
                  alt="Aurascend Logo"
                  width={80}
                  height={40}
                  className="rounded-md p-3  outline-none focus:outline-none focus:ring-0"
                  priority
                />
                <motion.h1
                  className="text-2xl font-bold text-white hidden md:block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Aur<span className="text-purple-400">ascend</span>
                </motion.h1>
              </motion.div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink href="/">Ana Sayfa</NavLink>
            <NavLink href="/features">Özellikler</NavLink>

            {/* Auth Buttons */}
            {status === "authenticated" ? (
              <motion.div
                className="flex items-center ml-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <span className="text-sm text-gray-300 mr-2">
                  {session.user.name || session.user.email}
                </span>
                <motion.button
                  onClick={() => {
                    const toastId = toast.loading('Çıkış yapılıyor...');
                    signOut({ callbackUrl: "/" }).then(() => {
                      toast.success('Başarıyla çıkış yapıldı', { id: toastId });
                    });
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Çıkış Yap
                </motion.button>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/dashboard"
                    className={`ml-2 px-3 py-2 rounded-md text-sm font-medium ${
                      pathname?.startsWith("/dashboard")
                        ? "bg-purple-700 text-white"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                  >
                    Profilim
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/login"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname?.startsWith("/login")
                        ? "bg-purple-700 text-white"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                  >
                    Giriş Yap
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/register"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname?.startsWith("/register")
                        ? "bg-blue-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    Kayıt Ol
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <motion.button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-purple-300 hover:bg-blue-800 focus:outline-none"
              aria-expanded="false"
              whileTap={{ scale: 0.9 }}
            >
              <span className="sr-only">Ana menüyü aç</span>
              {/* Icon for menu */}
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon for X */}
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-blue-800">
              <MobileNavLink href="/" onClick={() => setIsMenuOpen(false)}>
                Ana Sayfa
              </MobileNavLink>
              <MobileNavLink
                href="/features"
                onClick={() => setIsMenuOpen(false)}
              >
                Özellikler
              </MobileNavLink>

              {/* Auth Buttons */}
              {status === "authenticated" ? (
                <div className="pt-4 pb-3 border-t border-blue-800">
                  <div className="flex items-center px-5">
                    <div className="ml-3">
                      <div className="text-base font-medium text-white">
                        {session.user.name || session.user.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 px-2 space-y-1">
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Link
                        href="/dashboard"
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                          pathname?.startsWith("/dashboard")
                            ? "bg-purple-700 text-white"
                            : "text-white hover:bg-blue-800 hover:text-purple-300"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profilim
                      </Link>
                    </motion.div>
                    <motion.button
                      onClick={() => {
                        setIsMenuOpen(false);
                        const toastId = toast.loading('Çıkış yapılıyor...');
                        signOut({ callbackUrl: "/" }).then(() => {
                          toast.success('Başarıyla çıkış yapıldı', { id: toastId });
                        });
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-red-700 hover:text-white"
                      whileTap={{ scale: 0.95 }}
                    >
                      Çıkış Yap
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 pb-3 border-t border-blue-800">
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/login"
                      className={`block w-full text-center px-3 py-2 rounded-md text-base font-medium mb-2 ${
                        pathname?.startsWith("/login")
                          ? "bg-purple-700 text-white"
                          : "bg-purple-600 hover:bg-purple-700 text-white"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Giriş Yap
                    </Link>
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/register"
                      className={`block w-full text-center px-3 py-2 rounded-md text-base font-medium ${
                        pathname?.startsWith("/register")
                          ? "bg-blue-700 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Kayıt Ol
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
