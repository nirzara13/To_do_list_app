import React, { useState, useRef, useEffect } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import Swal from 'sweetalert2';
import '../styles/Contact.css';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const recaptchaRef = useRef(null);
  const [errors, setErrors] = useState({});

  // Log des variables d'environnement au chargement
  useEffect(() => {
    console.log('Configuration reCAPTCHA:', {
      siteKey: process.env.REACT_APP_RECAPTCHA_SITE_KEY,
      apiUrl: process.env.REACT_APP_API_URL
    });
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim() || name.length < 2) {
      newErrors.name = 'Nom invalide (2 caractères minimum)';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = 'Email invalide';
    }

    if (message.trim().length < 10 || message.trim().length > 500) {
      newErrors.message = 'Message invalide (10-500 caractères)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation du formulaire
    if (!validateForm()) {
      return;
    }

    try {
      // Log avant l'exécution du captcha
      console.log('Tentative d\'exécution du reCAPTCHA');
      
      // Exécution explicite du reCAPTCHA
      const token = await recaptchaRef.current.executeAsync();
      console.log('Token reCAPTCHA obtenu:', token);
      
      // Réinitialisation du captcha
      recaptchaRef.current.reset();

      // Envoi de la requête
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          email, 
          message,
          recaptchaToken: token 
        }),
      });

      // Log de la réponse
      console.log('Statut de la réponse:', response.status);
      
      const result = await response.json();
      console.log('Résultat du serveur:', result);

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Message envoyé',
          text: 'Votre message a été transmis avec succès'
        });

        // Réinitialiser le formulaire
        setName('');
        setEmail('');
        setMessage('');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: result.message || 'Échec de l\'envoi'
        });
      }
    } catch (error) {
      console.error('Erreur détaillée:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur de connexion',
        text: 'Impossible de joindre le serveur'
      });
    }
  };

  return (
    <div className="contact-container">
      <h1>Contactez-nous</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nom</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          {errors.message && <span className="error-message">{errors.message}</span>}
        </div>

        <ReCAPTCHA
          ref={recaptchaRef}
          size="invisible"
          sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
        />

        <button type="submit" className="animated-button">Envoyer</button>
      </form>
    </div>
  );
};

export default Contact;