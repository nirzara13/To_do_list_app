import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaPlus, FaEdit, FaTrash, FaEye, FaComment, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import '../styles/TasksPage.css';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Récupération des tâches et des catégories
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        
        // Récupérer les tâches
        const tasksResponse = await fetch('http://localhost:5000/api/tasks', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const tasksData = await tasksResponse.json();

        // Récupérer les catégories
        const categoriesResponse = await fetch('http://localhost:5000/api/categories', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const categoriesData = await categoriesResponse.json();

        if (tasksData.success && categoriesData.success) {
          // Tri des tâches par date de création (les plus récentes en premier)
          const sortedTasks = tasksData.tasks.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          setTasks(sortedTasks);
          setCategories(categoriesData.categories);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Impossible de récupérer les données'
          });
        }
      } catch (error) {
        console.error('Erreur de récupération des données:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur réseau',
          text: 'Vérifiez votre connexion internet'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Fonction pour créer une nouvelle tâche
  const handleCreateTask = () => {
    navigate('/tasks/new');
  };

  // Fonction pour éditer une tâche
  const handleEditTask = (taskId) => {
    navigate(`/tasks/edit/${taskId}`);
  };

  // Fonction pour supprimer une tâche
  const handleDeleteTask = async (taskId) => {
    const result = await Swal.fire({
      title: 'Confirmation de suppression',
      text: "Voulez-vous vraiment supprimer cette tâche ? Cette action est irréversible.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const result = await response.json();

        if (result.success) {
          // Mise à jour de la liste des tâches après suppression
          setTasks(tasks.filter(task => task.id !== taskId));
          
          Swal.fire({
            icon: 'success',
            title: 'Tâche supprimée',
            text: 'La tâche a été supprimée avec succès'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: result.message || 'Impossible de supprimer la tâche'
          });
        }
      } catch (error) {
        console.error('Erreur de suppression:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la suppression'
        });
      }
    }
  };

  // Fonction pour changer l'ordre d'affichage d'une tâche dans une catégorie
 // Fonction pour changer l'ordre d'affichage d'une tâche dans une catégorie
const handleMoveTask = async (taskId, categoryId, direction) => {
  try {
    // Vérifier que les IDs sont valides
    if (!taskId || !categoryId || !direction) {
      console.error("Paramètres invalides pour le déplacement de tâche");
      return;
    }
    
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/categories/reorder`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        taskId: Number(taskId),
        categoryId: Number(categoryId),
        direction // 'up' ou 'down'
      })
    });

    const result = await response.json();

    if (result.success) {
      // Rafraîchir les données
      // Utilisez une fonction séparée pour éviter la duplication de code
      await fetchTasks();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: result.message || 'Impossible de modifier l\'ordre d\'affichage'
      });
    }
  } catch (error) {
    console.error('Erreur de modification d\'ordre:', error);
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Une erreur est survenue lors de la modification de l\'ordre'
    });
  }
};

// Fonction pour récupérer les tâches (à appeler dans useEffect et après handleMoveTask)
const fetchTasks = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/login');
    return;
  }

  try {
    setLoading(true);
    
    // Récupérer les tâches
    const tasksResponse = await fetch('http://localhost:5000/api/tasks', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const tasksData = await tasksResponse.json();

    if (tasksData.success) {
      setTasks(tasksData.tasks);
    }
  } catch (error) {
    console.error('Erreur de récupération des données:', error);
  } finally {
    setLoading(false);
  }
};

  // Filtrer les tâches par catégorie sélectionnée
  const getTasksToDisplay = () => {
    if (!selectedCategory) {
      return tasks;
    }
    
    // Convertir en nombre pour s'assurer que la comparaison est correcte
    const categoryId = Number(selectedCategory);
    
    // Filtrer les tâches qui ont cette catégorie
    const filteredTasks = tasks.filter(task => {
      // Vérifier si la tâche a des catégories
      if (!task.categories || !Array.isArray(task.categories)) {
        return false;
      }
      
      // Vérifier si l'une des catégories correspond à celle sélectionnée
      return task.categories.some(cat => Number(cat.id) === categoryId);
    });
    
    // Si aucune tâche ne correspond, retourner un tableau vide
    if (filteredTasks.length === 0) {
      return [];
    }
    
    // Trier les tâches par ordre d'affichage
    return filteredTasks.sort((a, b) => {
      // Trouver les associations pour chaque tâche
      const aAssoc = a.categories.find(cat => Number(cat.id) === categoryId);
      const bAssoc = b.categories.find(cat => Number(cat.id) === categoryId);
      
      // Extraire les valeurs display_order ou utiliser 0 par défaut
      const aOrder = aAssoc && aAssoc.TaskCategory ? Number(aAssoc.TaskCategory.display_order) : 0;
      const bOrder = bAssoc && bAssoc.TaskCategory ? Number(bAssoc.TaskCategory.display_order) : 0;
      
      // Trier par ordre croissant
      return aOrder - bOrder;
    });
    // Dans getTasksToDisplay
console.log("Type de selectedCategory:", typeof selectedCategory, selectedCategory);

// Pour chaque tâche
tasks.forEach(task => {
  console.log(`Tâche ${task.id}:`, task);
  console.log(`Catégories de la tâche ${task.id}:`, task.categories);
  
  if (task.categories) {
    task.categories.forEach(cat => {
      console.log(`Catégorie ${cat.id} - Type:`, typeof cat.id);
    });
  }
});
  };

  // Chargement
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement de vos tâches...</p>
      </div>
    );
  }

  const tasksToDisplay = getTasksToDisplay();

  return (
    <div className="tasks-page-container">
      <header className="tasks-header">
        <h1>Mes Tâches</h1>
        <button 
          onClick={handleCreateTask} 
          className="create-task-button"
        >
          <FaPlus /> Nouvelle Tâche
        </button>
      </header>

      {/* Sélecteur de catégorie */}
      {categories.length > 0 && (
        <div className="category-filter">
          <select 
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
            className="category-select"
          >
            <option value="">Toutes les tâches</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {tasksToDisplay.length === 0 ? (
        <div className="no-tasks">
          <p>
            {selectedCategory 
              ? "Aucune tâche dans cette catégorie."
              : "Vous n'avez pas encore de tâches. Commencez par en créer une !"}
          </p>
          <button 
            onClick={handleCreateTask} 
            className="create-task-button"
          >
            Créer ma première tâche
          </button>
        </div>
      ) : (
        <div className="tasks-list">
          {tasksToDisplay.map(task => (
            <div key={task.id} className="task-card">
              <div className="task-content">
                {/* Lien vers les détails de la tâche */}
                <Link to={`/tasks/${task.id}`} className="task-title-link">
                  <h2>{task.title}</h2>
                </Link>
                <p>{task.description}</p>
                <div className="task-meta">
                  <span className={`priority ${task.priority}`}>
                    {task.priority}
                  </span>
                  <span className={`status ${task.status}`}>
                    {task.status}
                  </span>
                  
                  {/* Affichage des catégories */}
                  {task.categories && task.categories.length > 0 && (
                    <div className="task-categories">
                      {task.categories.map(category => (
                        <span 
                          key={category.id} 
                          className="task-category" 
                          style={{ backgroundColor: category.color || '#808080' }}
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="task-actions">
                {/* Boutons de tri (uniquement visible si une catégorie est sélectionnée) */}
                {selectedCategory && (
                  <>
                    <button 
                      onClick={() => handleMoveTask(task.id, selectedCategory, 'up')}
                      className="task-action-button"
                      aria-label="Monter dans la liste"
                    >
                      <FaArrowUp />
                    </button>
                    <button 
                      onClick={() => handleMoveTask(task.id, selectedCategory, 'down')}
                      className="task-action-button"
                      aria-label="Descendre dans la liste"
                    >
                      <FaArrowDown />
                    </button>
                  </>
                )}
                
                <Link 
                  to={`/tasks/${task.id}`} 
                  className="task-action-button"
                  aria-label="Voir les détails"
                >
                  <FaEye />
                </Link>
                <button 
                  onClick={() => handleEditTask(task.id)}
                  className="task-action-button"
                  aria-label="Modifier la tâche"
                >
                  <FaEdit />
                </button>
                <button 
                  onClick={() => handleDeleteTask(task.id)}
                  className="task-action-button"
                  aria-label="Supprimer la tâche"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksPage;