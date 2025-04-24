import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0081A7] shadow-lg' : 'bg-[#0081A7]/95 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-[#FDFCDC] flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FED9B7] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              SaveMyBite
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {user && user.role === 'donor' ? (
              <>
                <Link to="/dashboard" className="text-[#FDFCDC] hover:text-[#FED9B7] transition-colors font-medium">Dashboard</Link>
                <Link to="/list-food" className="text-[#FDFCDC] hover:text-[#FED9B7] transition-colors font-medium">List Food</Link>
                <Link to="/available-food" className="text-[#FDFCDC] hover:text-[#FED9B7] transition-colors font-medium">Available Food</Link>
                <Link to="/donor-analytics" className="text-[#FDFCDC] hover:text-[#FED9B7] transition-colors font-medium">Analytics</Link>
              </>
            ) : user && user.role === 'volunteer' ? (
              <>
                <Link to="/volunteer-dashboard" className="text-[#FDFCDC] hover:text-[#FED9B7] transition-colors font-medium">Dashboard</Link>
                <Link to="/volunteer-analytics" className="text-[#FDFCDC] hover:text-[#FED9B7] transition-colors font-medium">Analytics</Link>
                <Link to="/available-food" className="text-[#FDFCDC] hover:text-[#FED9B7] transition-colors font-medium">Available Food</Link>
                <Link to="/pickup-location" className="text-[#FDFCDC] hover:text-[#FED9B7] transition-colors font-medium">Map View</Link>
              </>
            ) : (
              <>
                <Link to="/" className="text-[#FDFCDC] hover:text-[#FED9B7] transition-colors font-medium">Home</Link>
                <Link to="/available-food" className="text-[#FDFCDC] hover:text-[#FED9B7] transition-colors font-medium">Available Food</Link>
                <Link to="/about" className="text-[#FDFCDC] hover:text-[#FED9B7] transition-colors font-medium">About</Link>
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <Link to="/login" className="text-[#FDFCDC] hover:text-[#FED9B7] transition-colors font-medium hidden sm:block">Sign In</Link>
                <Link to="/register" className="bg-[#F07167] text-[#FDFCDC] px-4 py-2 rounded-lg font-medium hover:bg-[#F07167]/90 transition-all shadow-sm hover:shadow">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-[#00AFB9] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FDFCDC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-[#FDFCDC] font-medium">{user.name || user.email.split('@')[0]}</span>
                </div>
                <Link to="/logout" className="text-[#FDFCDC] hover:text-[#FED9B7] transition-colors font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMobileMenu} 
              className="text-[#FDFCDC] hover:text-[#FED9B7] focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-96 py-4' : 'max-h-0 py-0'}`}>
        <div className="px-4 pt-2 pb-4 space-y-3 bg-[#00AFB9]">
          {user && user.role === 'donor' ? (
            <>
              <Link to="/dashboard" className="block py-2 text-[#FDFCDC] hover:text-[#FED9B7] transition-colors font-medium">Dashboard</Link>
              <Link to="/list-food" className="block py-2 text-[#FDFCDC] hover:text-[#FED9B7] transition-colors font-medium">List Food</Link>
              <Link to="/available-food" className="block py-2 text-[#FDFCDC] hover:text-[#FED9B7] transition-colors font-medium">Available Food</Link>
              <Link to="/donor-analytics" className="block py-2 text-[#FDFCDC] hover:text-[#FED9B7] transition-colors font-medium">Analytics</Link>
            </>
          ) : user && user.role === 'volunteer' ? (
            <>
              <Link to="/volunteer-dashboard" className="block py-2 text-[#FDFCDC] hover:text-[#FED9B7] transition-colors font-medium">Dashboard</Link>
              <Link to="/volunteer-analytics" className="block py-2 text-[#FDFCDC] hover:text-[#FED9B7] transition-colors font-medium">Analytics</Link>
              <Link to="/available-food" className="block py-2 text-[#FDFCDC] hover:text-[#FED9B7] transition-colors font-medium">Available Food</Link>
              <Link to="/pickup-location" className="block py-2 text-[#FDFCDC] hover:text-[#FED9B7] transition-colors font-medium">Map View</Link>
            </>
          ) : (
            <>
              <Link to="/" className="block py-2 text-[#FDFCDC] hover:text-[#FED9B7] transition-colors font-medium">Home</Link>
              <Link to="/available-food" className="block py-2 text-[#FDFCDC] hover:text-[#FED9B7] transition-colors font-medium">Available Food</Link>
              <Link to="/about" className="block py-2 text-[#FDFCDC] hover:text-[#FED9B7] transition-colors font-medium">About</Link>
            </>
          )}

          <div className="pt-2 border-t border-[#0081A7]">
            {!user ? (
              <>
                <Link to="/login" className="block py-2 text-[#FDFCDC] hover:text-[#FED9B7] transition-colors font-medium">Sign In</Link>
                <Link to="/register" className="block py-2 bg-[#F07167] text-[#FDFCDC] px-4 rounded-lg font-medium text-center hover:bg-[#F07167]/90 transition-all">
                  Sign Up
                </Link>
              </>
            ) : (
              <Link to="/logout" className="block py-2 text-[#FDFCDC] hover:text-[#FED9B7] transition-colors font-medium">Logout</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;