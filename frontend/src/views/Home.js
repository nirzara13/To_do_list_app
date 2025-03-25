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
      <div className="home-container loading" aria-live="polite" role="status">
        <div className="spinner">Chargement des données en cours...</div>
      </div>
    );
  }

  return (
    <main className="home-container">
      {/* Section Hero */}
      <section className="hero-section" aria-labelledby="main-heading">
        <h1 id="main-heading">Bienvenue sur votre To-Do List</h1>
        <p>Gérez vos tâches facilement et efficacement.</p>
      </section>

      {/* Sections Informative */}
      <section className="info-section" aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">Fonctionnalités principales</h2>
        <article className="info-card" role="region" aria-labelledby="feature-1">
          <FaCheckCircle className="info-icon" aria-hidden="true" />
          <h3 id="feature-1">Facile à Utiliser</h3>
          <p>Créez et gérez vos tâches en quelques clics avec notre interface intuitive.</p>
        </article>
        <article className="info-card" role="region" aria-labelledby="feature-2">
          <FaTasks className="info-icon" aria-hidden="true" />
          <h3 id="feature-2">Organisation Personnalisée</h3>
          <p>Classez vos tâches par priorité et date d'échéance.</p>
        </article>
        <article className="info-card" role="region" aria-labelledby="feature-3">
          <FaCheckCircle className="info-icon" aria-hidden="true" />
          <h3 id="feature-3">Gratuit</h3>
          <p>Profitez de toutes nos fonctionnalités gratuitement, sans limitation.</p>
        </article>
      </section>

      {/* Tâches en Cours - Visible uniquement pour les utilisateurs authentifiés */}
      {isAuthenticated && tasks.length > 0 && (
        <section className="current-tasks-section" aria-labelledby="current-tasks-heading">
          <h2 id="current-tasks-heading">Vos Tâches en Cours</h2>
          <ul className="tasks-list" aria-label="Liste de vos tâches en cours">
            {tasks.map((task) => (
              <li className="task-card" key={task.id}>
                <article>
                  <h3 id={`task-title-${task.id}`}>{task.title}</h3>
                  <p>{task.description}</p>
                  <div className="task-meta">
                    <span>Priorité : {task.priority}</span>
                    <span>Statut : {task.status}</span>
                  </div>
                </article>
                <button 
                  className="animated-button" 
                  onClick={() => handleStartTask(task.id)} 
                  aria-label={`Voir les détails de la tâche : ${task.title}`}
                >
                  Voir les Détails
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Message conditionnel pour les utilisateurs non connectés */}
      {!isAuthenticated && (
        <section className="call-to-action" aria-labelledby="cta-heading">
          <h2 id="cta-heading">Commencez à organiser votre travail</h2>
          <p>
            Connectez-vous ou inscrivez-vous pour accéder à votre tableau de bord personnalisé 
            et commencer à gérer vos tâches efficacement.
          </p>
        </section>
      )}

      {/* Message quand aucune tâche n'est disponible */}
      {isAuthenticated && tasks.length === 0 && (
        <section className="no-tasks" aria-labelledby="no-tasks-heading">
          <h2 id="no-tasks-heading">Pas de tâches pour le moment</h2>
          <p>Commencez par créer votre première tâche !</p>
          <Link to="/create-task" className="animated-button" aria-label="Créer une nouvelle tâche">
            Créer une Tâche
          </Link>
        </section>
      )}
    </main>
  );
};

export default Home;