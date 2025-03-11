// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import '../styles/TaskForm.css';

// const TaskForm = () => {
//   const navigate = useNavigate();
//   const { id } = useParams(); // Pour l'édition de tâche

//   // État pour le formulaire
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     due_date: '',
//     priority: 'medium',
//     status: 'todo'
//   });

//   // Gérer les changements dans le formulaire
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Soumettre le formulaire
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       const token = localStorage.getItem('token');
      
//       const response = await fetch('http://localhost:5000/api/tasks', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           title: formData.title,
//           description: formData.description,
//           due_date: formData.due_date,
//           priority: formData.priority,
//           status: formData.status
//         })
//       });
  
//       const result = await response.json();
  
//       if (result.success) {
//         Swal.fire({
//           icon: 'success',
//           title: 'Tâche créée',
//           text: result.message
//         });
        
//         navigate('/tasks');
//       } else {
//         Swal.fire({
//           icon: 'error',
//           title: 'Erreur',
//           text: result.message
//         });
//       }
//     } catch (error) {
//       console.error('Erreur:', error);
//       Swal.fire({
//         icon: 'error',
//         title: 'Erreur réseau',
//         text: 'Vérifiez votre connexion internet'
//       });
//     }
//   };
    

//   // Charger les données de la tâche si en mode édition
//   useEffect(() => {
//     if (id) {
//       const fetchTask = async () => {
//         try {
//           const token = localStorage.getItem('token');
//           const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
//             headers: {
//               'Authorization': `Bearer ${token}`
//             }
//           });

//           if (response.ok) {
//             const task = await response.json();
//             setFormData({
//               title: task.title,
//               description: task.description || '',
//               due_date: task.due_date ? task.due_date.split('T')[0] : '',
//               priority: task.priority || 'medium',
//               status: task.status || 'todo'
//             });
//           } else {
//             Swal.fire({
//               icon: 'error',
//               title: 'Erreur',
//               text: 'Impossible de charger la tâche'
//             });
//           }
//         } catch (error) {
//           console.error('Erreur:', error);
//           Swal.fire({
//             icon: 'error',
//             title: 'Erreur réseau',
//             text: 'Vérifiez votre connexion internet'
//           });
//         }
//       };

//       fetchTask();
//     }
//   }, [id]);

//   return (
//     <div className="task-form-container">
//       <form onSubmit={handleSubmit} className="task-form">
//         <h1>{id ? 'Modifier la tâche' : 'Créer une tâche'}</h1>
        
//         <div className="form-group">
//           <label htmlFor="title">Titre *</label>
//           <input
//             type="text"
//             id="title"
//             name="title"
//             value={formData.title}
//             onChange={handleInputChange}
//             required
//             aria-required="true"
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="description">Description</label>
//           <textarea
//             id="description"
//             name="description"
//             value={formData.description}
//             onChange={handleInputChange}
//             rows="4"
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="due_date">Date d'échéance</label>
//           <input
//             type="date"
//             id="due_date"
//             name="due_date"
//             value={formData.due_date}
//             onChange={handleInputChange}
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="priority">Priorité</label>
//           <select
//             id="priority"
//             name="priority"
//             value={formData.priority}
//             onChange={handleInputChange}
//           >
//             <option value="low">Basse</option>
//             <option value="medium">Moyenne</option>
//             <option value="high">Haute</option>
//           </select>
//         </div>

//         <div className="form-group">
//           <label htmlFor="status">Statut</label>
//           <select
//             id="status"
//             name="status"
//             value={formData.status}
//             onChange={handleInputChange}
//           >
//             <option value="todo">À faire</option>
//             <option value="in_progress">En cours</option>
//             <option value="completed">Terminé</option>
//           </select>
//         </div>

//         <div className="form-actions">
//           <button type="submit" className="submit-button">
//             {id ? 'Mettre à jour' : 'Créer'}
//           </button>
//           <button 
//             type="button" 
//             className="cancel-button"
//             onClick={() => navigate('/tasks')}
//           >
//             Annuler
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default TaskForm;






import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/TaskForm.css';

const TaskForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Pour l'édition de tâche

  // État pour le formulaire
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
    status: 'todo',
    categories: [] // Ajout d'un tableau pour stocker les IDs des catégories sélectionnées
  });

  // État pour les catégories disponibles
  const [categories, setCategories] = useState([]);
  // État pour le chargement
  const [loading, setLoading] = useState(true);

  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gérer les changements de catégories (cases à cocher)
  const handleCategoryChange = (e) => {
    const categoryId = parseInt(e.target.value);
    
    if (e.target.checked) {
      // Ajouter la catégorie si elle est cochée
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, categoryId]
      }));
    } else {
      // Retirer la catégorie si elle est décochée
      setFormData(prev => ({
        ...prev,
        categories: prev.categories.filter(id => id !== categoryId)
      }));
    }
  };

  // Fonction pour ouvrir un modal pour créer une catégorie
  const openCategoryModal = () => {
    Swal.fire({
      title: 'Créer une nouvelle catégorie',
      html: `
        <div>
          <label for="category-name" style="display: block; text-align: left; margin-bottom: 5px;">Nom de la catégorie:</label>
          <input 
            id="category-name" 
            class="swal2-input" 
            placeholder="Ex: Travail, Personnel, Urgent..."
          >
        </div>
        <div style="margin-top: 15px;">
          <label for="category-color" style="display: block; text-align: left; margin-bottom: 5px;">Couleur:</label>
          <input 
            type="color" 
            id="category-color" 
            value="#808080" 
            style="width: 100%; height: 40px;"
          >
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Créer',
      cancelButtonText: 'Annuler',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const categoryName = document.getElementById('category-name').value;
        const categoryColor = document.getElementById('category-color').value;
        
        if (!categoryName) {
          Swal.showValidationMessage('Le nom de la catégorie est obligatoire');
          return false;
        }
        
        return createCategory(categoryName, categoryColor);
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        // Mettre à jour la liste des catégories
        setCategories([...categories, result.value]);
        
        Swal.fire({
          title: 'Catégorie créée!',
          text: 'Votre nouvelle catégorie a été ajoutée avec succès.',
          icon: 'success'
        });
      }
    });
  };

  // Fonction pour créer une catégorie
  const createCategory = async (name, color) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, color })
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Erreur lors de la création de la catégorie');
      }
      
      return result.category;
    } catch (error) {
      Swal.showValidationMessage(`Erreur: ${error.message}`);
      return null;
    }
  };

  // Soumettre le formulaire
  // Dans la fonction handleSubmit de TaskForm.js
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const token = localStorage.getItem('token');
    const url = id 
      ? `http://localhost:5000/api/tasks/${id}` 
      : 'http://localhost:5000/api/tasks';
    const method = id ? 'PUT' : 'POST';
    
    // 1. Créer/mettre à jour la tâche
    const taskResponse = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: formData.title,
        description: formData.description,
        due_date: formData.due_date,
        priority: formData.priority,
        status: formData.status
        // Ne pas envoyer les catégories ici
      })
    });

    const taskResult = await taskResponse.json();
    
    if (!taskResult.success) {
      throw new Error(taskResult.message || 'Erreur lors de la création/mise à jour de la tâche');
    }
    
    const taskId = id || taskResult.task.id;
    
    // 2. Si des catégories sont sélectionnées, créer les associations
    if (formData.categories && formData.categories.length > 0) {
      console.log("Création des associations de catégories pour la tâche", taskId);
      
      // Supprimer d'abord les associations existantes (si mise à jour)
      if (id) {
        await fetch(`http://localhost:5000/api/tasks/${taskId}/categories`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      
      // Créer les nouvelles associations
      for (const categoryId of formData.categories) {
        try {
          const assocResponse = await fetch('http://localhost:5000/api/categories/task-association', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              taskId,
              categoryId
            })
          });
          
          const assocResult = await assocResponse.json();
          console.log("Résultat de l'association:", assocResult);
        } catch (err) {
          console.error("Erreur lors de l'association de la catégorie", categoryId, ":", err);
        }
      }
    }
    
    Swal.fire({
      icon: 'success',
      title: id ? 'Tâche mise à jour' : 'Tâche créée',
      text: taskResult.message
    });
    
    navigate('/tasks');
  } catch (error) {
    console.error('Erreur:', error);
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: error.message || 'Une erreur est survenue'
    });
  }
};

    // Charger les catégories et les données de la tâche si en mode édition
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Récupérer les catégories disponibles
      const categoriesResponse = await fetch('http://localhost:5000/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        if (categoriesData.success) {
          console.log("Catégories récupérées:", categoriesData.categories);
          setCategories(categoriesData.categories);
        }
      }

      // Si en mode édition, récupérer les détails de la tâche
      if (id) {
        const taskResponse = await fetch(`http://localhost:5000/api/tasks/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (taskResponse.ok) {
          const taskData = await taskResponse.json();
          if (taskData.success) {
            const task = taskData.task;
            
            // Formater la date pour l'input
            const formattedDate = task.due_date 
              ? new Date(task.due_date).toISOString().split('T')[0] 
              : '';
            
            // Extraire les IDs des catégories associées
            const categoryIds = task.categories 
              ? task.categories.map(cat => cat.id) 
              : [];
            
            console.log("IDs des catégories associées:", categoryIds);
            
            setFormData({
              title: task.title || '',
              description: task.description || '',
              due_date: formattedDate,
              priority: task.priority || 'medium',
              status: task.status || 'todo',
              categories: categoryIds
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Impossible de charger la tâche'
            });
            navigate('/tasks');
          }
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
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
}, [id, navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  

  return (
    <div className="task-form-container">
      <form onSubmit={handleSubmit} className="task-form">
        <h1>{id ? 'Modifier la tâche' : 'Créer une tâche'}</h1>
        
        <div className="form-group">
          <label htmlFor="title">Titre *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            aria-required="true"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="due_date">Date d'échéance</label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            value={formData.due_date}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priorité</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
          >
            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Statut</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="todo">À faire</option>
            <option value="in_progress">En cours</option>
            <option value="completed">Terminé</option>
          </select>
        </div>

        {/* Section des catégories */}
        <div className="form-group categories-section">
          <div className="categories-header">
            <label>Catégories</label>
            <button 
              type="button" 
              className="add-category-button"
              onClick={openCategoryModal}
            >
              + Nouvelle catégorie
            </button>
          </div>
          
          {categories.length === 0 ? (
            <p className="no-categories">
              Aucune catégorie disponible. Créez-en une pour mieux organiser vos tâches.
            </p>
          ) : (
            <div className="categories-list">
              {categories.map(category => (
                <div key={category.id} className="category-checkbox">
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    value={category.id}
                    checked={formData.categories.includes(category.id)}
                    onChange={handleCategoryChange}
                  />
                  <label 
                    htmlFor={`category-${category.id}`}
                    style={{ 
                      backgroundColor: category.color || '#808080',
                      color: getContrastColor(category.color || '#808080')
                    }}
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            {id ? 'Mettre à jour' : 'Créer'}
          </button>
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => navigate('/tasks')}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

// Fonction utilitaire pour déterminer si le texte doit être en noir ou blanc selon la couleur de fond
function getContrastColor(hexColor) {
  // Convertir le code hexadécimal en RGB
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  
  // Calculer la luminosité (formule standard)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Retourner noir ou blanc selon la luminosité
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export default TaskForm;