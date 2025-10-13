// File: maxxalan/playing-filmp2p/Playing-FilmP2P-demoUI/components/Header.tsx

import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import MenuIcon from './icons/MenuIcon';
import CloseIcon from './icons/CloseIcon';
import ThemeSwitcher from './ThemeSwitcher';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // FIX: Replaced hardcoded colors with theme variables for consistent link styling.
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `font-medium transition-colors duration-200 ${isActive ? 'text-primary' : 'text-muted hover:text-link'}`;
  
  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block py-3 text-2xl font-semibold text-center ${isActive ? 'text-primary' : 'text-foreground hover:text-link'}`;

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-2xl font-bold text-foreground transition-colors duration-200 hover:text-link flex items-center gap-2">
              <span role="img" aria-label="film projector">🎬</span>
              <span>XemPhim</span>
            </Link>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex md:items-center md:space-x-8">
                <NavLink to="/" className={navLinkClass}>Trang chủ</NavLink>
                <NavLink to="/categories" className={navLinkClass}>Thể loại</NavLink>
                <NavLink to="/search" className={navLinkClass}>Tìm kiếm</NavLink>
                <NavLink to="/about" className={navLinkClass}>Giới thiệu</NavLink>
                <NavLink to="/contact" className={navLinkClass}>Liên hệ</NavLink>
              </nav>
              <div className="hidden md:block">
                <ThemeSwitcher />
              </div>
              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                  <MenuIcon className="w-6 h-6 text-muted" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 bg-background/95 backdrop-blur-lg transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-end p-5">
            <button onClick={closeMenu} aria-label="Close menu">
                <CloseIcon className="w-8 h-8 text-muted"/>
            </button>
        </div>
        <nav className="flex flex-col items-center justify-center h-full space-y-8 -mt-16">
          <NavLink to="/" className={mobileNavLinkClass} onClick={closeMenu}>Trang chủ</NavLink>
          <NavLink to="/categories" className={mobileNavLinkClass} onClick={closeMenu}>Thể loại</NavLink>
          <NavLink to="/search" className={mobileNavLinkClass} onClick={closeMenu}>Tìm kiếm</NavLink>
          <NavLink to="/about" className={mobileNavLinkClass} onClick={closeMenu}>Giới thiệu</NavLink>
          <NavLink to="/contact" className={mobileNavLinkClass} onClick={closeMenu}>Liên hệ</NavLink>
        </nav>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <ThemeSwitcher />
        </div>
      </div>
    </>
  );
};

export default Header;