// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles/Signup.css'; // Assurez-vous que le chemin est correct

// const Signup = () => {
//   const [nom, setNom] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleSignup = async (event) => {
//     event.preventDefault();

//     // Validation du mot de passe
//     const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,}$/;
//     if (!passwordPattern.test(password)) {
//       alert('Le mot de passe doit contenir au moins 10 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.');
//       return;
//     }

//     // Appel API pour inscription
//     try {
//       const response = await fetch('http://localhost:5000/api/signup', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ nom, email, password }),
//       });

//       if (response.ok) {
//         navigate('/login'); // Redirection vers la page de connexion
//       } else {
//         alert('Inscription échouée. Veuillez réessayer.');
//       }
//     } catch (error) {
//       console.error('Erreur lors de l\'inscription:', error);
//       alert('Une erreur est survenue. Veuillez réessayer.');
//     }
//   };

//   return (
//     <div className="signup-container">
//       <div className="signup-card">
//         <h1>Inscription</h1>
//         <form onSubmit={handleSignup} className="signup-form">
//           <label htmlFor="nom">Nom</label>
//           <input
//             type="text"
//             id="nom"
//             value={nom}
//             onChange={(e) => setNom(e.target.value)}
//             required
//           />
          
//           <label htmlFor="email">Email</label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//           <label htmlFor="password">Mot de passe</label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />

//           <button type="submit" className="animated-button">S'inscrire</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Signup;


// frontend/views/Signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/Signup.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
    if (!passwordRegex.test(password)) {
      Swal.fire({
        icon: 'error',
        title: 'Mot de passe invalide',
        text: 'Le mot de passe doit contenir au moins:\n- 10 caractères\n- 1 majuscule\n- 1 minuscule\n- 1 chiffre\n- 1 caractère spécial',
        confirmButtonColor: '#3085d6'
      });
      return false;
    }
    return true;
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    
    if (!validatePassword(password)) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Inscription réussie!',
          text: 'Vous allez être redirigé vers la page de connexion',
          showConfirmButton: false,
          timer: 2000
        });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: data.error || 'Erreur lors de l\'inscription'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur serveur',
        text: 'Impossible de se connecter au serveur'
      });
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>Inscription</h1>
        <form onSubmit={handleSignup} className="signup-form">
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="animated-button">S'inscrire</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;