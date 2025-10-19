'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Book, LogOut, Menu, Ticket, User, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ROUTES } from '@/constants';
import { useAuth } from '@/providers/AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
const navigationItems = [
  {
    name: 'HOME',
    href: '/',
    hasDropdown: false,
    subcategories: [],
  },
  {
    name: 'HOTELS',
    href: '/',
    hasDropdown: false,
    subcategories: [],
  },
  {
    name: 'CONTACT',
    href: '/',
    hasDropdown: false,
    subcategories: [],
  },
  {
    name: 'NEWS',
    href: '/tin-tuc',
    hasDropdown: false,
    subcategories: [],
  },
];
function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  useEffect(() => {
    const handleScroll = () => {
      // Change background when scrolled more than 50px
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const toggleDropdown = (name: string) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(name);
    }
  };
  const closeDropdowns = () => {
    setActiveDropdown(null);
  };
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ease-out ${
        isScrolled
          ? 'bg-white border-gray-200 shadow-lg text-black'
          : 'bg-white md:bg-transparent md:backdrop-blur-sm border-white/30 text-black md:text-white'
      }`}
    >
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Left Logo */}
          <Link href="/" onClick={closeMobileMenu}>
            <div className="flex items-center gap-3">
              <svg
                className="w-8 h-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 21h18M4 18h16M6 18V9l6-6 6 6v9M9 21v-6h6v6" />
                <path d="M12 3v6M9 9h6" />
              </svg>
              <div
                className={`text-2xl font-serif font-medium ${
                  isScrolled ? 'text-black' : 'text-black md:text-white'
                }`}
              >
                Stayra
              </div>
            </div>
          </Link>
          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-8 relative">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative group">
                <button
                  className="flex items-center text-md font-medium transition-colors hover:text-primary relative group cursor-pointer"
                  onClick={() => item.hasDropdown && toggleDropdown(item.name)}
                  onMouseEnter={() =>
                    item.hasDropdown && setActiveDropdown(item.name)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <div className="absolute left-0 top-5 z-50 w-full h-full"></div>
                  <Link href={item.href}>{item.name}</Link>
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                </button>

                {item.hasDropdown && activeDropdown === item.name && (
                  <div
                    className="absolute top-full left-0 mt-1 w-48 bg-white shadow-lg rounded-md overflow-hidden z-50"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => closeDropdowns()}
                  >
                    <div className="py-2">
                      {/* {item.subcategories?.map((subcategory) => (
                        <Link
                          key={subcategory.name}
                          href={subcategory.href}
                          className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                          onClick={() => closeDropdowns()}
                        >
                          {subcategory.name}
                        </Link>
                      ))} */}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
              {/* Language & Currency Dropdowns */}
              <div className="relative group">
                <button
                  className="flex items-center text-md font-medium transition-colors hover:text-primary relative group cursor-pointer"
                  onClick={() => toggleDropdown('language')}
                  onMouseEnter={() => setActiveDropdown('language')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <div className="absolute left-0 top-5 z-50 w-full h-full"></div>
                  <Image
                    src="/vn-flag.webp"
                    alt="Vietnamese"
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                </button>
              </div>
              <span>/</span>
              <div className="relative group">
                <button
                  className="flex items-center text-md font-medium transition-colors hover:text-primary relative group cursor-pointer"
                  onClick={() => toggleDropdown('currency')}
                  onMouseEnter={() => setActiveDropdown('currency')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <div className="absolute left-0 top-5 z-50 w-full h-full"></div>
                  <span>VND</span>
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                </button>

                {activeDropdown === 'currency' && (
                  <div
                    className="absolute top-full left-0 mt-3 w-20 bg-white shadow-lg rounded-md overflow-hidden z-50 text-black"
                    onMouseEnter={() => setActiveDropdown('currency')}
                    onMouseLeave={() => closeDropdowns()}
                  >
                    <div className="py-2">
                      <Link
                        href="/"
                        className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                        onClick={() => closeDropdowns()}
                      >
                        VND
                      </Link>
                      <Link
                        href="/"
                        className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                        onClick={() => closeDropdowns()}
                      >
                        USD
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      <div className="bg-primary text-white w-full h-full flex justify-center items-center">
                        {user.firstName?.charAt(0) || '?'}
                      </div>
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.firstName || '?'} {user.lastName || '?'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/me">Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/me/booking">My Bookings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/me/sale">My offers</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <button
                      className="cursor-pointer w-full h-full text-start"
                      onClick={logout}
                    >
                      Logout
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href={ROUTES.LOGIN}>
                <Button
                  variant="default"
                  className="relative overflow-hidden font-semibold text-white bg-primary rounded-none group px-8 py-6"
                >
                  <span className="relative z-10">ĐĂNG NHẬP</span>
                  <span className="absolute inset-0 bg-black origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                </Button>
              </Link>
            )}
          </div>
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-white/10 rounded-md transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-white/10 pt-4">
            {/* Mobile Navigation */}
            <nav className="flex flex-col gap-3 mb-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium hover:bg-white/10 rounded-md transition-colors"
                  onClick={closeMobileMenu}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Contact & Actions */}
            <div className="border-t border-white/10 pt-4 space-y-3">
            
              <div className="px-4 py-2 space-y-2">
                <div className="text-xs font-semibold text-black uppercase">
                  Currency
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/"
                    className="text-sm hover:bg-white/10 px-3 py-1 rounded transition-colors"
                    onClick={closeMobileMenu}
                  >
                    VND
                  </Link>
                  <Link
                    href="/"
                    className="text-sm hover:bg-white/10 px-3 py-1 rounded transition-colors"
                    onClick={closeMobileMenu}
                  >
                    USD
                  </Link>
                </div>
              </div>
              {user ? (
                <div className="border-t border-white/10 pt-3 space-y-2">
                  <div className="px-4 py-2 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full">
                      <Avatar className="cursor-pointer">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          <div className="bg-primary text-white w-full h-full flex justify-center items-center">
                            {user.firstName.charAt(0)}
                          </div>
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <span className="text-sm font-medium">{user.firstName}{user.lastName}</span>
                  </div>
                  <Link
                    href={ROUTES.PROFILE}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/10 rounded-md transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <User className="w-4 h-4" />
                    Account
                  </Link>
                   <Link
                    href={ROUTES.PROFILE}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/10 rounded-md transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <Book className="w-4 h-4" />
                    My Bookings
                  </Link>
                   <Link
                    href={ROUTES.PROFILE}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/10 rounded-md transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <Ticket className="w-4 h-4" />
                    My Offers
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/10 rounded-md transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link href={ROUTES.LOGIN}>
                  <Button
                    variant="default"
                    className="w-full relative overflow-hidden font-semibold text-white bg-primary rounded-none group py-5 text-sm"
                    onClick={closeMobileMenu}
                  >
                    <span className="relative z-10">LOGIN</span>
                    <span className="absolute inset-0 bg-black origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
