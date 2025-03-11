import React, { useEffect, useState } from 'react';
import '../styles/Home.css';
import { FaCheckCircle, FaTasks, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Assurez-vous d'installer jwt-decode

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier l'authentification via le token JWT
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // Vérifier si le token est encore valide
        if (decodedToken.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
          
          // Récupérer la liste des tâches disponibles
          const fetchTasks = async () => {
            try {
              const response = await fetch('http://localhost:5000/api/tasks', {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              
              if (response.ok) {
                const data = await response.json();
                // Vérifier que data.tasks existe et est un tableau
                setTasks(Array.isArray(data.tasks) ? data.tasks : []);
              } else {
                // Gérer les erreurs d'authentification
                localStorage.removeItem('token');
                setIsAuthenticated(false);
                setTasks([]);
              }
            } catch (error) {
              console.error('Erreur lors de la récupération des tâches:', error);
              setTasks([]);
            } finally {
              setLoading(false);
            }
          };

          fetchTasks();
        } else {
          // Token expiré
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setTasks([]);
          setLoading(false);
        }
      } catch (error) {
        // Token invalide
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setTasks([]);
        setLoading(false);
      }
    } else {
      // Pas de token
      setIsAuthenticated(false);
      setTasks([]);
      setLoading(false);
    }
  }, []);

  const handleStartTask = (taskId) => {
    navigate(`/task/${taskId}`);
  };

  // Gérer le cas de chargement
  if (loading) {
    return (
      <div className="home-container loading">
        <div className="spinner">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Section Hero */}
      <section className="hero-section">
        <h1>Bienvenue sur votre To-Do List</h1>
        <p>Gérez vos tâches facilement et efficacement.</p>
        
        {/* Section Authentification Conditionnelle */}
        {!isAuthenticated && (
          <div className="auth-cta">
            <Link to="/login" className="animated-button">
              <FaSignInAlt /> Se Connecter
            </Link>
            <Link to="/signup" className="animated-button">
              <FaUserPlus /> S'Inscrire
            </Link>
          </div>
        )}
      </section>

      {/* Sections Informative */}
      <section className="info-section">
        <div className="info-card" tabIndex="0">
          <FaCheckCircle className="info-icon" />
          <h3>Facile à Utiliser</h3>
          <p>Créez et gérez vos tâches en quelques clics avec notre interface intuitive.</p>
        </div>
        <div className="info-card" tabIndex="0">
          <FaTasks className="info-icon" />
          <h3>Organisation Personnalisée</h3>
          <p>Classez vos tâches par priorité et date d'échéance.</p>
        </div>
        <div className="info-card" tabIndex="0">
          <FaCheckCircle className="info-icon" />
          <h3>Gratuit</h3>
          <p>Profitez de toutes nos fonctionnalités gratuitement, sans limitation.</p>
        </div>
      </section>

      {/* Tâches en Cours - Visible uniquement pour les utilisateurs authentifiés */}
      {isAuthenticated && tasks.length > 0 && (
        <section className="current-tasks-section">
          <h2>Vos Tâches en Cours</h2>
          {tasks.map((task) => (
            <div 
              className="task-card" 
              key={task.id} 
              tabIndex="0"
              aria-label={`Tâche : ${task.title}`}
            >
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <div className="task-meta">
                <span>Priorité : {task.priority}</span>
                <span>Statut : {task.status}</span>
              </div>
              <button 
                className="animated-button" 
                onClick={() => handleStartTask(task.id)} 
                tabIndex="0"
              >
                Voir les Détails
              </button>
            </div>
          ))}
        </section>
      )}

      {/* Message conditionnel pour les utilisateurs non connectés */}
      {!isAuthenticated && (
        <section className="call-to-action">
          <h2>Commencez à organiser votre travail</h2>
          <p>
            Connectez-vous ou inscrivez-vous pour accéder à votre tableau de bord personnalisé 
            et commencer à gérer vos tâches efficacement.
          </p>
        </section>
      )}

      {/* Message quand aucune tâche n'est disponible */}
      {isAuthenticated && tasks.length === 0 && (
        <section className="no-tasks">
          <h2>Pas de tâches pour le moment</h2>
          <p>Commencez par créer votre première tâche !</p>
          <Link to="/create-task" className="animated-button">
            Créer une Tâche
          </Link>
        </section>
      )}
    </div>
  );
};

export default Home;