import React from 'react';
import { Link } from 'react-router-dom'; // Importez Link
import '../styles/Footer.css';
import logo from '../assets/Logo_Manage_Task.png'; // Assurez-vous que le chemin est correct
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa'; // Icônes des réseaux sociaux

const Footer = () => {
  return (
    <footer className="footer">
      <div className="wave-container">
        <svg className="wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#081f53" fillOpacity="1" d="M0,160L80,192C160,224,320,288,480,288C640,288,800,224,960,192C1120,160,1280,160,1360,160L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>
      <div className="footer-content">
        <div className="footer-column">
          <img src={logo} alt="Logo Sondage" className="footer-logo" />
        </div>
        <div className="footer-column">
          <h3>Liens Utiles</h3>
          <ul>
            <li><Link to="/mentions-legales">Mentions Légales</Link></li>
            <li><Link to="/politique-confidentialite">Politique de Confidentialité</Link></li>
            <li><Link to="/conditions-utilisation">Conditions d'Utilisation</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Suivez-nous</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
