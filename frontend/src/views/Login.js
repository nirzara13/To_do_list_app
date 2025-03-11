import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("Tentative de connexion avec:", email);

    try {
      const response = await fetch('http://localhost:5000/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Réponse du serveur:", data);

      if (response.ok) {
        console.log("Connexion réussie, stockage du token");
        // Stocker le token et les infos utilisateur
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        Swal.fire({
          icon: 'success',
          title: 'Connexion réussie!',
          text: 'Vous allez être redirigé vers votre tableau de bord',
          showConfirmButton: false,
          timer: 1500
        });
        
        // Double approche de redirection pour assurer qu'elle fonctionne
        console.log("Tentative de redirection vers /dashboard");
        setTimeout(() => {
          navigate('/dashboard');
          
          // Fallback au cas où navigate échoue
          setTimeout(() => {
            if (window.location.pathname !== '/dashboard') {
              console.log("Redirection avec window.location");
              window.location.href = '/dashboard';
            }
          }, 300);
        }, 1500);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur de connexion',
          text: data.error || 'Email ou mot de passe incorrect'
        });
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur serveur',
        text: 'Impossible de se connecter au serveur'
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Connexion</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-required="true"
            />
          </div>

          <button type="submit" className="animated-button">Se connecter</button>
        </form>
      </div>
    </div>
  );
};

export default Login;