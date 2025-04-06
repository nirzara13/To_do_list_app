// // 


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import '../styles/Login.css';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();

//   // Validation du formulaire
//   const validateForm = () => {
//     const newErrors = {};

//     // Validation email
//     if (!email.trim()) {
//       newErrors.email = 'L\'email est requis';
//     } else if (!/\S+@\S+\.\S+/.test(email)) {
//       newErrors.email = 'Veuillez entrer un email valide';
//     }

//     // Validation mot de passe
//     if (!password.trim()) {
//       newErrors.password = 'Le mot de passe est requis';
//     } else if (password.length < 8) {
//       newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleLogin = async (event) => {
//     event.preventDefault();

//     // Validation avant soumission
//     if (!validateForm()) {
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:5000/api/users/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('user', JSON.stringify(data.user));

//         Swal.fire({
//           icon: 'success',
//           title: 'Connexion réussie!',
//           text: 'Vous allez être redirigé vers votre tableau de bord',
//           showConfirmButton: false,
//           timer: 1500,
//           accessibilityAttributes: {
//             role: 'alert'
//           }
//         });

//         setTimeout(() => {
//           navigate('/dashboard');
//         }, 1500);
//       } else {
//         Swal.fire({
//           icon: 'error',
//           title: 'Erreur de connexion',
//           text: data.error || 'Email ou mot de passe incorrect',
//           accessibilityAttributes: {
//             role: 'alert'
//           }
//         });
//       }
//     } catch (error) {
//       console.error("Erreur lors de la connexion:", error);
//       Swal.fire({
//         icon: 'error',
//         title: 'Erreur serveur',
//         text: 'Impossible de se connecter au serveur',
//         accessibilityAttributes: {
//           role: 'alert'
//         }
//       });
//     }
//   };

//   return (
//     <div className="login-container" role="main">
//       <div className="login-card">
//         <h1 id="login-title">Connexion</h1>
//         <form 
//           onSubmit={handleLogin} 
//           className="login-form" 
//           aria-labelledby="login-title"
//         >
//           <div className="form-group">
//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               aria-required="true"
//               aria-invalid={errors.email ? "true" : "false"}
//               aria-describedby={errors.email ? "email-error" : undefined}
//               autoComplete="email"
//             />
//             {errors.email && (
//               <span 
//                 id="email-error" 
//                 className="error-message" 
//                 role="alert"
//               >
//                 {errors.email}
//               </span>
//             )}
//           </div>

//           <div className="form-group">
//             <label htmlFor="password">Mot de passe</label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               aria-required="true"
//               aria-invalid={errors.password ? "true" : "false"}
//               aria-describedby={errors.password ? "password-error" : undefined}
//               autoComplete="current-password"
//             />
//             {errors.password && (
//               <span 
//                 id="password-error" 
//                 className="error-message" 
//                 role="alert"
//               >
//                 {errors.password}
//               </span>
//             )}
//           </div>

//           <button 
//             type="submit" 
//             className="animated-button"
//             aria-label="Se connecter"
//           >
//             Se connecter
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;






// code du 06/04/2025 avec les modifications 

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    // Validation email
    if (!email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Veuillez entrer un email valide';
    }

    // Validation mot de passe
    if (!password.trim()) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    // Validation avant soumission
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        Swal.fire({
          icon: 'success',
          title: 'Connexion réussie!',
          text: 'Vous allez être redirigé vers votre tableau de bord',
          showConfirmButton: false,
          timer: 1500,
          accessibilityAttributes: {
            role: 'alert'
          }
        });

        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur de connexion',
          text: data.error || 'Email ou mot de passe incorrect',
          accessibilityAttributes: {
            role: 'alert'
          }
        });
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur serveur',
        text: 'Impossible de se connecter au serveur',
        accessibilityAttributes: {
          role: 'alert'
        }
      });
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/reset-password');
  };

  return (
    <div className="login-container" role="main">
      <div className="login-card">
        <h1 id="login-title">Connexion</h1>
        <form 
          onSubmit={handleLogin} 
          className="login-form" 
          aria-labelledby="login-title"
        >
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
              autoComplete="email"
            />
            {errors.email && (
              <span 
                id="email-error" 
                className="error-message" 
                role="alert"
              >
                {errors.email}
              </span>
            )}
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
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "password-error" : undefined}
              autoComplete="current-password"
            />
            {errors.password && (
              <span 
                id="password-error" 
                className="error-message" 
                role="alert"
              >
                {errors.password}
              </span>
            )}
          </div>

          <button 
            type="submit" 
            className="animated-button"
            aria-label="Se connecter"
          >
            Se connecter
          </button>
          
          <div className="forgot-password-container">
            <a 
              href="/reset-password"
              className="forgot-password-link"
              onClick={handleForgotPassword}
              aria-label="Mot de passe oublié"
            >
              Mot de passe oublié ?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;