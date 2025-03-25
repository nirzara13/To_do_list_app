// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import '../styles/Dashboard.css';
// import { Link } from 'react-router-dom';

// const Dashboard = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState(false);
//   const [showPasswordChange, setShowPasswordChange] = useState(false);
//   const [formData, setFormData] = useState({
//     username: '',
//     email: ''
//   });
//   const [passwordData, setPasswordData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
  
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const storedUser = JSON.parse(localStorage.getItem('user'));
//         const token = localStorage.getItem('token');
        
//         if (!storedUser || !token) {
//           navigate('/login');
//           return;
//         }
        
//         setUser(storedUser);
//         setFormData({
//           username: storedUser.username,
//           email: storedUser.email
//         });
//         setLoading(false);
//       } catch (error) {
//         console.error('Erreur:', error);
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     navigate('/login');
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handlePasswordInputChange = (e) => {
//     const { name, value } = e.target;
//     setPasswordData({
//       ...passwordData,
//       [name]: value
//     });
//   };

//   const toggleEdit = () => {
//     setEditing(!editing);
//     if (editing) {
//       setFormData({
//         username: user.username,
//         email: user.email
//       });
//       setShowPasswordChange(false);
//       setPasswordData({
//         currentPassword: '',
//         newPassword: '',
//         confirmPassword: ''
//       });
//     }
//   };

//   const togglePasswordChange = () => {
//     setShowPasswordChange(!showPasswordChange);
//     if (!showPasswordChange) {
//       setPasswordData({
//         currentPassword: '',
//         newPassword: '',
//         confirmPassword: ''
//       });
//     }
//   };

//   const handleUpdateProfile = async (e) => {
//     e.preventDefault();
    
//     try {
//       const storedUser = JSON.parse(localStorage.getItem('user'));
//       const token = localStorage.getItem('token');
      
//       // Si l'utilisateur veut changer son mot de passe
//       if (showPasswordChange) {
//         // Validation
//         if (passwordData.newPassword !== passwordData.confirmPassword) {
//           Swal.fire({
//             icon: 'error',
//             title: 'Erreur',
//             text: 'Les nouveaux mots de passe ne correspondent pas'
//           });
//           return;
//         }
        
//         if (passwordData.newPassword.length < 6) {
//           Swal.fire({
//             icon: 'error',
//             title: 'Erreur',
//             text: 'Le nouveau mot de passe doit contenir au moins 6 caractères'
//           });
//           return;
//         }
        
//         // Appel spécifique pour changer le mot de passe
//         const passwordResponse = await fetch('http://localhost:5000/api/profile/change-password', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//           body: JSON.stringify({
//             userId: storedUser.id,
//             currentPassword: passwordData.currentPassword,
//             newPassword: passwordData.newPassword
//           })
//         });
        
//         const passwordResult = await passwordResponse.json();
        
//         if (!passwordResponse.ok) {
//           Swal.fire({
//             icon: 'error',
//             title: 'Erreur',
//             text: passwordResult.message || 'Erreur lors du changement de mot de passe'
//           });
//           return;
//         }
        
//         console.log("Mot de passe changé avec succès");
//       }
      
//       // Mise à jour du profil (username et email uniquement)
//       // Dans la méthode handleUpdateProfile, modifiez ces deux requêtes :

// // Mise à jour du profil (username et email uniquement)
// const profileResponse = await fetch('http://localhost:5000/api/users/update-user-profile', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${token}`
//   },
//   body: JSON.stringify({
//     userId: storedUser.id,
//     username: formData.username,
//     email: formData.email
//   })
// });
      
//       const profileResult = await profileResponse.json();
      
//       if (!profileResponse.ok) {
//         Swal.fire({
//           icon: 'error',
//           title: 'Erreur',
//           text: profileResult.message || 'Erreur lors de la mise à jour du profil'
//         });
//         return;
//       }
      
//       // Mettre à jour l'état local et le localStorage
//       setUser(profileResult.user);
//       localStorage.setItem('user', JSON.stringify(profileResult.user));
      
//       Swal.fire({
//         icon: 'success',
//         title: 'Profil mis à jour',
//         text: showPasswordChange 
//           ? 'Vos informations et votre mot de passe ont été mis à jour avec succès'
//           : 'Vos informations ont été mises à jour avec succès'
//       });
      
//       // Réinitialiser les états
//       setEditing(false);
//       setShowPasswordChange(false);
//       setPasswordData({
//         currentPassword: '',
//         newPassword: '',
//         confirmPassword: ''
//       });
//     } catch (error) {
//       console.error('Erreur:', error);
//       Swal.fire({
//         icon: 'error',
//         title: 'Erreur',
//         text: 'Une erreur est survenue lors de la mise à jour'
//       });
//     }
//   };

//   const handleDeleteAccount = async () => {
//     const result = await Swal.fire({
//       title: 'Êtes-vous sûr?',
//       text: "Cette action est irréversible et supprimera définitivement votre compte!",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//       cancelButtonColor: '#3085d6',
//       confirmButtonText: 'Oui, supprimer mon compte',
//       cancelButtonText: 'Annuler'
//     });
    
//     if (result.isConfirmed) {
//       try {
//         const storedUser = JSON.parse(localStorage.getItem('user'));
//         const token = localStorage.getItem('token');
        
//         const response = await fetch('http://localhost:5000/api/profile/delete', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//           body: JSON.stringify({ userId: storedUser.id })
//         });
        
//         if (response.ok) {
//           localStorage.removeItem('token');
//           localStorage.removeItem('user');
          
//           Swal.fire({
//             icon: 'success',
//             title: 'Compte supprimé',
//             text: 'Votre compte a été supprimé avec succès'
//           });
          
//           navigate('/signup');
//         } else {
//           const responseText = await response.text();
//           console.error("Erreur de suppression:", responseText);
          
//           let errorMessage = 'Une erreur est survenue lors de la suppression du compte';
//           try {
//             const data = JSON.parse(responseText);
//             if (data.message) {
//               errorMessage = data.message;
//             }
//           } catch (e) {
//             // Le texte n'est pas un JSON valide, on garde le message par défaut
//           }
          
//           Swal.fire({
//             icon: 'error',
//             title: 'Erreur',
//             text: errorMessage
//           });
//         }
//       } catch (error) {
//         console.error('Erreur lors de la suppression du compte:', error);
//         Swal.fire({
//           icon: 'error',
//           title: 'Erreur',
//           text: 'Une erreur est survenue lors de la suppression du compte'
//         });
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <div className="loading-container" aria-live="polite">
//         <p>Chargement de vos informations...</p>
//         <div className="spinner"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-container">
//       <header className="dashboard-header">
//         <h1>Tableau de Bord</h1>
//         <button 
//           onClick={handleLogout} 
//           className="logout-button"
//           aria-label="Se déconnecter"
//         >
//           Déconnexion
//         </button>
//       </header>
      
      
//       <main className="dashboard-content">
//         <section className="profile-section">
        
//           <h2>Mon Profil</h2>
          
//           {!editing ? (
//             <div className="profile-info">
//               <p><strong>Nom d'utilisateur:</strong> {user.username}</p>
//               <p><strong>Email:</strong> {user.email}</p>
              
//               <div className="profile-actions">
//   <button 
//     type="button"
//     onClick={toggleEdit} 
//     className="edit-button"
//     aria-label="Modifier mon profil"
//   >
//     Modifier mon profil
//   </button>
//   <button 
//     type="button"
//     onClick={handleDeleteAccount} 
//     className="delete-button"
//     aria-label="Supprimer mon compte"
//   >
//     Supprimer mon compte
//   </button>
  
//   <Link 
//     to="/tasks" 
//     className="view-tasks-button"
//     aria-label="Voir mes tâches"
//   >
//     Voir mes tâches
//   </Link>
// </div>
// </div>
//           ) : (
//             <form onSubmit={handleUpdateProfile} className="profile-form">
//               <div className="form-group">
//                 <label htmlFor="username">Nom d'utilisateur:</label>
//                 <input
//                   type="text"
//                   id="username"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleInputChange}
//                   required
//                   aria-required="true"
//                 />
//               </div>
              
//               <div className="form-group">
//                 <label htmlFor="email">Email:</label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   required
//                   aria-required="true"
//                 />
//               </div>
              
//               <div className="password-toggle">
//                 <button 
//                   type="button" 
//                   onClick={togglePasswordChange}
//                   className="toggle-password-button"
//                   aria-expanded={showPasswordChange}
//                   aria-controls="password-fields"
//                 >
//                   {showPasswordChange ? 'Annuler le changement de mot de passe' : 'Changer mon mot de passe'}
//                 </button>
//               </div>
              
//               {showPasswordChange && (
//                 <div id="password-fields" className="password-fields">
//                   <div className="form-group">
//                     <label htmlFor="currentPassword">Mot de passe actuel:</label>
//                     <input
//                       type="password"
//                       id="currentPassword"
//                       name="currentPassword"
//                       value={passwordData.currentPassword}
//                       onChange={handlePasswordInputChange}
//                       required
//                       aria-required="true"
//                     />
//                   </div>
                  
//                   <div className="form-group">
//                     <label htmlFor="newPassword">Nouveau mot de passe:</label>
//                     <input
//                       type="password"
//                       id="newPassword"
//                       name="newPassword"
//                       value={passwordData.newPassword}
//                       onChange={handlePasswordInputChange}
//                       required
//                       aria-required="true"
//                       minLength="6"
//                       aria-describedby="password-requirements"
//                     />
//                     <p id="password-requirements" className="form-hint">
//                       Le mot de passe doit contenir au moins 6 caractères
//                     </p>
//                   </div>
                  
//                   <div className="form-group">
//                     <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe:</label>
//                     <input
//                       type="password"
//                       id="confirmPassword"
//                       name="confirmPassword"
//                       value={passwordData.confirmPassword}
//                       onChange={handlePasswordInputChange}
//                       required
//                       aria-required="true"
//                       aria-describedby="confirm-hint"
//                     />
//                     <p id="confirm-hint" className="form-hint">
//                       Doit être identique au nouveau mot de passe
//                     </p>
//                   </div>
//                 </div>
//               )}
              
//               <div className="form-actions">
//                 <button 
//                   type="submit" 
//                   className="save-button"
//                   aria-label="Sauvegarder les modifications"
//                 >
//                   Sauvegarder
//                 </button>
//                 <button 
//                   type="button" 
//                   onClick={toggleEdit} 
//                   className="cancel-button"
//                   aria-label="Annuler les modifications"
//                 >
//                   Annuler
//                 </button>
//               </div>
//             </form>
//           )}
//         </section>
        

//         <section className="tasks-section">
//           <h2>Mes Tâches</h2>
//           <p>Développement en cours. Bientôt disponible!</p>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;























import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/Dashboard.css';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        
        if (!storedUser || !token) {
          navigate('/login');
          return;
        }
        
        setUser(storedUser);
        setFormData({
          username: storedUser.username,
          email: storedUser.email
        });
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const toggleEdit = () => {
    setEditing(!editing);
    if (editing) {
      setFormData({
        username: user.username,
        email: user.email
      });
      setShowPasswordChange(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  const togglePasswordChange = () => {
    setShowPasswordChange(!showPasswordChange);
    if (!showPasswordChange) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      
      // Si l'utilisateur veut changer son mot de passe
      if (showPasswordChange) {
        // Validation
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Les nouveaux mots de passe ne correspondent pas'
          });
          return;
        }
        
        if (passwordData.newPassword.length < 6) {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Le nouveau mot de passe doit contenir au moins 6 caractères'
          });
          return;
        }
        
        // Appel spécifique pour changer le mot de passe
        const passwordResponse = await fetch('http://localhost:5000/api/profile/change-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: storedUser.id,
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
          })
        });
        
        const passwordResult = await passwordResponse.json();
        
        if (!passwordResponse.ok) {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: passwordResult.message || 'Erreur lors du changement de mot de passe'
          });
          return;
        }
        
        console.log("Mot de passe changé avec succès");
      }
      
      // Mise à jour du profil (username et email)
      const profileResponse = await fetch('http://localhost:5000/api/users/update-user-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: storedUser.id,
          username: formData.username,
          email: formData.email
        })
      });
      
      // Récupération du contenu de la réponse
      const responseText = await profileResponse.text();
      console.log('Réponse du serveur:', responseText);
      
      // Parse du JSON
      let profileResult;
      try {
        profileResult = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Erreur de parsing JSON:', parseError);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Réponse invalide du serveur'
        });
        return;
      }
      
      if (!profileResponse.ok) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: profileResult.message || 'Erreur lors de la mise à jour du profil'
        });
        return;
      }
      
      // Mettre à jour l'état local et le localStorage
      setUser(profileResult.user);
      localStorage.setItem('user', JSON.stringify(profileResult.user));
      
      Swal.fire({
        icon: 'success',
        title: 'Profil mis à jour',
        text: showPasswordChange 
          ? 'Vos informations et votre mot de passe ont été mis à jour avec succès'
          : 'Vos informations ont été mises à jour avec succès'
      });
      
      // Réinitialiser les états
      setEditing(false);
      setShowPasswordChange(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Erreur:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la mise à jour'
      });
    }
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Cette action est irréversible et supprimera définitivement votre compte!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer mon compte',
      cancelButtonText: 'Annuler'
    });
    
    if (result.isConfirmed) {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        
        const response = await fetch('http://localhost:5000/api/profile/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ userId: storedUser.id })
        });
        
        if (response.ok) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          Swal.fire({
            icon: 'success',
            title: 'Compte supprimé',
            text: 'Votre compte a été supprimé avec succès'
          });
          
          navigate('/signup');
        } else {
          const responseText = await response.text();
          console.error("Erreur de suppression:", responseText);
          
          let errorMessage = 'Une erreur est survenue lors de la suppression du compte';
          try {
            const data = JSON.parse(responseText);
            if (data.message) {
              errorMessage = data.message;
            }
          } catch (e) {
            // Le texte n'est pas un JSON valide, on garde le message par défaut
          }
          
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: errorMessage
          });
        }
      } catch (error) {
        console.error('Erreur lors de la suppression du compte:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la suppression du compte'
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container" aria-live="polite">
        <p>Chargement de vos informations...</p>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Tableau de Bord</h1>
        
      </header>
      
      <main className="dashboard-content">
        <section className="profile-section">
          <h2>Mon Profil</h2>
          
          {!editing ? (
            <div className="profile-info">
              <p><strong>Nom d'utilisateur:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              
              <div className="profile-actions">
                <button 
                  type="button"
                  onClick={toggleEdit} 
                  className="edit-button"
                  aria-label="Modifier mon profil"
                >
                  Modifier mon profil
                </button>
                <button 
                  type="button"
                  onClick={handleDeleteAccount} 
                  className="delete-button"
                  aria-label="Supprimer mon compte"
                >
                  Supprimer mon compte
                </button>
                
                <Link 
                  to="/tasks" 
                  className="view-tasks-button"
                  aria-label="Voir mes tâches"
                >
                  Voir mes tâches
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group">
                <label htmlFor="username">Nom d'utilisateur:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                />
              </div>
              
              <div className="password-toggle">
                <button 
                  type="button" 
                  onClick={togglePasswordChange}
                  className="toggle-password-button"
                  aria-expanded={showPasswordChange}
                  aria-controls="password-fields"
                >
                  {showPasswordChange ? 'Annuler le changement de mot de passe' : 'Changer mon mot de passe'}
                </button>
              </div>
              
              {showPasswordChange && (
                <div id="password-fields" className="password-fields">
                  <div className="form-group">
                    <label htmlFor="currentPassword">Mot de passe actuel:</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordInputChange}
                      required
                      aria-required="true"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="newPassword">Nouveau mot de passe:</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordInputChange}
                      required
                      aria-required="true"
                      minLength="6"
                      aria-describedby="password-requirements"
                    />
                    <p id="password-requirements" className="form-hint">
                      Le mot de passe doit contenir au moins 6 caractères
                    </p>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe:</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordInputChange}
                      required
                      aria-required="true"
                      aria-describedby="confirm-hint"
                    />
                    <p id="confirm-hint" className="form-hint">
                      Doit être identique au nouveau mot de passe
                    </p>
                  </div>
                </div>
              )}
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="save-button"
                  aria-label="Sauvegarder les modifications"
                >
                  Sauvegarder
                </button>
                <button 
                  type="button" 
                  onClick={toggleEdit} 
                  className="cancel-button"
                  aria-label="Annuler les modifications"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}
        </section>

        <section className="tasks-section">
          <h2>Mes Tâches</h2>
          <p>Développement en cours. Bientôt disponible!</p>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;