// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import '../styles/TaskDetails.css';

// const TaskDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
  
//   // États pour stocker les données
//   const [task, setTask] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState('');

//   // Effet pour charger les détails de la tâche et ses commentaires
//   useEffect(() => {
//     const fetchTaskDetails = async () => {
//       try {
//         const token = localStorage.getItem('token');
        
//         // Récupérer les détails de la tâche
//         const taskResponse = await fetch(`http://localhost:5000/api/tasks/${id}`, {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });

//         const taskData = await taskResponse.json();
        
//         if (taskData.success) {
//           setTask(taskData.task);
//         }

//         // Récupérer les commentaires
//         const commentsResponse = await fetch(`http://localhost:5000/api/task-comments/${id}`, {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });

//         const commentsData = await commentsResponse.json();
        
//         if (commentsData.success) {
//           setComments(commentsData.comments);
//         }
//       } catch (error) {
//         console.error('Erreur lors de la récupération des détails :', error);
//         Swal.fire({
//           icon: 'error',
//           title: 'Erreur',
//           text: 'Impossible de charger les détails de la tâche'
//         });
//       }
//     };

//     fetchTaskDetails();
//   }, [id]);

//   // Gestionnaire pour ajouter un commentaire
//   const handleAddComment = async (e) => {
//     e.preventDefault();
    
//     try {
//       const token = localStorage.getItem('token');
      
//       const response = await fetch('http://localhost:5000/api/task-comments', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           task_id: id,
//           content: newComment
//         })
//       });

//       const result = await response.json();

//       if (result.success) {
//         // Ajouter le nouveau commentaire à la liste
//         setComments([result.comment, ...comments]);
//         setNewComment(''); // Réinitialiser le champ de commentaire
        
//         Swal.fire({
//           icon: 'success',
//           title: 'Commentaire ajouté',
//           text: 'Votre commentaire a été ajouté avec succès'
//         });
//       } else {
//         Swal.fire({
//           icon: 'error',
//           title: 'Erreur',
//           text: result.message
//         });
//       }
//     } catch (error) {
//       console.error('Erreur lors de l\'ajout du commentaire :', error);
//       Swal.fire({
//         icon: 'error',
//         title: 'Erreur réseau',
//         text: 'Impossible d\'ajouter le commentaire'
//       });
//     }
//   };

//   // Rendu conditionnel si la tâche n'est pas encore chargée
//   if (!task) {
//     return <div>Chargement...</div>;
//   }

//   return (
//     <div className="task-details-container">
//       <div className="task-details-header">
//         <h1>{task.title}</h1>
//       </div>
      
//       <div className="task-meta">
//         <span>Priorité : {task.priority}</span>
//         <span>Statut : {task.status}</span>
//       </div>
      
//       <p>{task.description}</p>
      
//       {/* Formulaire de commentaire */}
//       <form onSubmit={handleAddComment} className="comment-form">
//         <textarea
//           value={newComment}
//           onChange={(e) => setNewComment(e.target.value)}
//           placeholder="Ajouter un commentaire..."
//           required
//           rows="4"
//         />
//         <button type="submit" className="submit-comment-button">
//           Ajouter un commentaire
//         </button>
//       </form>

//       {/* Liste des commentaires */}
//       <div className="comments-section">
//         <h2>Commentaires</h2>
//         {comments.length === 0 ? (
//           <p className="no-comments">Aucun commentaire pour le moment</p>
//         ) : (
//           comments.map(comment => (
//             <div key={comment.id} className="comment">
//               <p>{comment.content}</p>
//               <small>
//                 Posté par {comment.user.username} 
//                 le {new Date(comment.created_at).toLocaleString()}
//               </small>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default TaskDetails;









import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/TaskDetails.css';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // États pour stocker les données
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  // Effet pour charger les détails de la tâche et ses commentaires
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }
        
        // Récupérer les détails de la tâche
        const taskResponse = await fetch(`http://localhost:5000/api/tasks/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const taskData = await taskResponse.json();
        
        if (taskData.success) {
          setTask(taskData.task);
        } else {
          throw new Error(taskData.message || 'Erreur lors du chargement de la tâche');
        }

        // Récupérer les commentaires
        const commentsResponse = await fetch(`http://localhost:5000/api/task-comments/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const commentsData = await commentsResponse.json();
        
        if (commentsData.success) {
          setComments(commentsData.comments);
        } else {
          throw new Error(commentsData.message || 'Erreur lors du chargement des commentaires');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des détails :', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les détails de la tâche'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [id, navigate]);

  // Gestionnaire pour ajouter un commentaire
  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Commentaire vide',
        text: 'Veuillez entrer un commentaire'
      });
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/task-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          task_id: id,
          content: newComment
        })
      });

      const result = await response.json();

      if (result.success) {
        // Ajouter le nouveau commentaire à la liste
        setComments([result.comment, ...comments]);
        setNewComment(''); // Réinitialiser le champ de commentaire
        
        Swal.fire({
          icon: 'success',
          title: 'Commentaire ajouté',
          text: 'Votre commentaire a été ajouté avec succès'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: result.message
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire :', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur réseau',
        text: 'Impossible d\'ajouter le commentaire'
      });
    }
  };

  // Fonction pour formater la date en français
  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Rendu conditionnel si la tâche n'est pas encore chargée
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement des détails de la tâche...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="error-container">
        <p>Impossible de charger les détails de cette tâche.</p>
        <button 
          onClick={() => navigate('/tasks')} 
          className="back-button"
        >
          Retour à la liste des tâches
        </button>
      </div>
    );
  }

  return (
    <div className="task-details-container">
      <div className="task-details-header">
        <h1>{task.title}</h1>
        <div className="task-actions">
          <button 
            onClick={() => navigate(`/tasks/edit/${id}`)} 
            className="edit-button"
          >
            Modifier
          </button>
          <button 
            onClick={() => navigate('/tasks')} 
            className="back-button"
          >
            Retour
          </button>
        </div>
      </div>
      
      <div className="task-meta">
        <div className="task-info">
          <p><strong>Priorité :</strong> <span className={`priority ${task.priority}`}>{task.priority}</span></p>
          <p><strong>Statut :</strong> <span className={`status ${task.status}`}>{task.status}</span></p>
          <p><strong>Date d'échéance :</strong> {formatDate(task.due_date)}</p>
          <p><strong>Créée le :</strong> {formatDate(task.createdAt)}</p>
        </div>
        
        {/* Affichage des catégories */}
        {task.categories && task.categories.length > 0 && (
          <div className="task-categories-section">
            <h3>Catégories</h3>
            <div className="task-categories">
              {task.categories.map(category => (
                <span 
                  key={category.id} 
                  className="task-category" 
                  style={{ 
                    backgroundColor: category.color || '#808080',
                    color: getContrastColor(category.color || '#808080')
                  }}
                >
                  {category.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="task-description">
        <h3>Description</h3>
        {task.description ? (
          <p>{task.description}</p>
        ) : (
          <p className="no-description">Aucune description fournie</p>
        )}
      </div>
      
      {/* Formulaire de commentaire */}
      <div className="comments-section">
        <h2>Commentaires</h2>
        
        <form onSubmit={handleAddComment} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ajouter un commentaire..."
            required
            rows="4"
          />
          <button type="submit" className="submit-comment-button">
            Ajouter un commentaire
          </button>
        </form>

        {/* Liste des commentaires */}
        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">Aucun commentaire pour le moment</p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="comment">
                <p className="comment-content">{comment.content}</p>
                <div className="comment-meta">
                  <span className="comment-author">
                    {comment.user?.username || 'Utilisateur'}
                  </span>
                  <span className="comment-date">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
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

export default TaskDetails;