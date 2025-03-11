import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import { 
  FaHome, 
  FaClipboardList, 
  FaEnvelope, 
  FaSignInAlt, 
  FaUserPlus, 
  FaBars, 
  FaTimes,
  FaUser,
  FaSignOutAlt
} from 'react-icons/fa';
import logo from '../assets/Logo_Manage_Task.png';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      setIsLoggedIn(!!token && !!user);
    };

    checkLoginStatus();
    // Vérifier à chaque changement de route
    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, [location]);

  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Gestion du scroll pour effet header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle menu mobile
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  // Liens de navigation de base
  const baseNavLinks = [
    { 
      to: '/', 
      icon: <FaHome />, 
      text: 'Accueil' 
    },
    // { 
    //   to: '/survey', 
    //   icon: <FaClipboardList />, 
    //   text: 'Tâches' 
    // },
    { 
      to: '/contact', 
      icon: <FaEnvelope />, 
      text: 'Contact' 
    }
  ];

  // Liens pour utilisateur non connecté
  const guestLinks = [
    { 
      to: '/login', 
      icon: <FaSignInAlt />, 
      text: 'Connexion' 
    },
    { 
      to: '/signup', 
      icon: <FaUserPlus />, 
      text: 'Inscription' 
    }
  ];

  // Liens pour utilisateur connecté
  const userLinks = [
    { 
      to: '/dashboard', 
      icon: <FaUser />, 
      text: 'Mon Profil' 
    },
    { 
      to: '#', 
      icon: <FaSignOutAlt />, 
      text: 'Déconnexion',
      onClick: handleLogout
    }
  ];

  // Combiner les liens en fonction de l'état de connexion
  const navLinks = [...baseNavLinks, ...(isLoggedIn ? userLinks : guestLinks)];

  return (
    <header 
      className={`header ${isScrolled ? 'scrolled' : ''}`}
      role="banner"
    >
      {/* Logo */}
      <div className="header-logo">
        <Link 
          to="/" 
          aria-label="Page d'accueil"
        >
          <img 
            src={logo} 
            alt="Logo Sondage Plus" 
            className="logo-image"
          />
        </Link>
      </div>

      {/* Bouton Menu Mobile */}
      <button 
        className="mobile-menu-toggle"
        onClick={toggleMenu}
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Navigation */}
      <nav 
        className={`header-nav ${menuOpen ? 'is-active' : ''}`}
        aria-label="Navigation principale"
      >
        <ul className="nav-list">
          {navLinks.map((link) => (
            <li 
              key={link.to + link.text} 
              className={`nav-item ${location.pathname === link.to ? 'active' : ''}`}
            >
              {link.onClick ? (
                <button 
                  onClick={link.onClick}
                  className="nav-link"
                  tabIndex={menuOpen ? 0 : -1}
                >
                  {link.icon}
                  <span>{link.text}</span>
                </button>
              ) : (
                <Link 
                  to={link.to} 
                  className="nav-link"
                  tabIndex={menuOpen ? 0 : -1}
                  aria-current={location.pathname === link.to ? 'page' : undefined}
                >
                  {link.icon}
                  <span>{link.text}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;