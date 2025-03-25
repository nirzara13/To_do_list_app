


















import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api';
import TaskForm from './TaskForm';
import Swal from 'sweetalert2';

const TasksPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const listIdFromUrl = queryParams.get('list');

  const [tasks, setTasks] = useState([]);
  const [selectedList, setSelectedList] = useState(listIdFromUrl || '');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [sortOption, setSortOption] = useState('updatedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [lists, setLists] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showCommentsFor, setShowCommentsFor] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);

  // Fonction pour charger les données
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les tâches
      const tasksResponse = await api.get('/tasks');
      const tasksData = tasksResponse.data.tasks || [];
      console.log('Tâches récupérées:', tasksData);
      setTasks(tasksData);
      
      // Récupérer les listes
      const listsResponse = await api.get('/lists');
      const listsData = listsResponse.data.lists || [];
      console.log('Listes récupérées:', listsData);
      setLists(listsData);
      
      // Récupérer les catégories
      const categoriesResponse = await api.get('/categories');
      setCategories(categoriesResponse.data.categories || []);
      
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      Swal.fire({
        title: 'Erreur!',
        text: 'Impossible de charger les données. Veuillez réessayer plus tard.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      setLoading(false);
    }
  };

  // Fonction pour charger les commentaires d'une tâche - CORRIGÉE
  const fetchComments = async (taskId) => {
    try {
      // Utilisez la route correcte pour votre API
      const response = await api.get(`/task-comments/tasks/${taskId}/comments`);
      console.log('Commentaires récupérés:', response.data);
      setComments(prev => ({
        ...prev,
        [taskId]: response.data.comments || []
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
      // Ne pas afficher d'erreur à l'utilisateur pour ne pas perturber l'expérience
    }
  };

  // Chargement initial des données
  useEffect(() => {
    fetchData();
  }, []);

  // Mise à jour du filtre de liste depuis l'URL
  useEffect(() => {
    if (listIdFromUrl) {
      setSelectedList(listIdFromUrl);
    }
  }, [listIdFromUrl]);

  // Charger les commentaires lorsqu'on ouvre la section commentaires
  useEffect(() => {
    if (showCommentsFor) {
      fetchComments(showCommentsFor);
    }
  }, [showCommentsFor]);

  // Fonction pour ajouter un commentaire - CORRIGÉE
  const handleAddComment = async (taskId) => {
    if (!newComment.trim()) return;
    
    try {
      console.log('Tentative d\'ajout de commentaire pour la tâche:', taskId);
      console.log('Contenu du commentaire:', newComment);
      
      // Essayer avec la route correcte pour votre API
      const response = await api.post(`/task-comments/tasks/comments`, {
        content: newComment,
        task_id: taskId
      });
      
      console.log('Commentaire ajouté:', response.data);
      
      // Mettre à jour les commentaires localement
      await fetchComments(taskId);
      
      // Réinitialiser le champ de commentaire
      setNewComment('');
      
      Swal.fire({
        title: 'Succès!',
        text: 'Commentaire ajouté avec succès',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      
      // Tentative alternative
      try {
        console.log('Tentative alternative d\'ajout de commentaire');
        const alternativeResponse = await api.post(`/comments`, {
          content: newComment,
          task_id: taskId
        });
        
        console.log('Commentaire ajouté (alternative):', alternativeResponse.data);
        
        // Mettre à jour les commentaires localement
        await fetchComments(taskId);
        
        // Réinitialiser le champ de commentaire
        setNewComment('');
        
        Swal.fire({
          title: 'Succès!',
          text: 'Commentaire ajouté avec succès',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (secondError) {
        console.error('Erreur lors de la tentative alternative:', secondError);
        Swal.fire({
          title: 'Erreur!',
          text: 'Impossible d\'ajouter le commentaire. Veuillez réessayer.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  // Fonction pour mettre à jour un commentaire
  const handleUpdateComment = async (commentId, taskId, content) => {
    try {
      // Utilisez la route correcte pour votre API
      const response = await api.put(`/task-comments/comments/${commentId}`, {
        content: content
      });
      
      console.log('Commentaire mis à jour:', response.data);
      
      // Mettre à jour les commentaires localement
      await fetchComments(taskId);
      
      // Réinitialiser l'état d'édition
      setEditingComment(null);
      
      Swal.fire({
        title: 'Succès!',
        text: 'Commentaire mis à jour avec succès',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du commentaire:', error);
      Swal.fire({
        title: 'Erreur!',
        text: 'Impossible de mettre à jour le commentaire. Veuillez réessayer.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  // Fonction pour supprimer un commentaire
  const handleDeleteComment = async (commentId, taskId) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Voulez-vous vraiment supprimer ce commentaire?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    });
    
    if (result.isConfirmed) {
      try {
        // Utilisez la route correcte pour votre API
        await api.delete(`/task-comments/comments/${commentId}`);
        
        // Mettre à jour les commentaires localement
        await fetchComments(taskId);
        
        Swal.fire({
          title: 'Supprimé!',
          text: 'Le commentaire a été supprimé.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Erreur lors de la suppression du commentaire:', error);
        Swal.fire({
          title: 'Erreur!',
          text: 'Impossible de supprimer le commentaire. Veuillez réessayer.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  // Fonction pour ajouter une tâche
  const handleAddTask = async (taskData) => {
    try {
      console.log('Données envoyées:', taskData);
      const response = await api.post('/tasks', taskData);
      console.log('Réponse serveur:', response.data);
      console.log('Tâche créée:', response.data.task);
  
      // Ajouter le commentaire initial si présent
      if (taskData.initialComment && taskData.initialComment.trim() !== '') {
        try {
          console.log('Tentative d\'ajout du commentaire initial');
          // Utilisez la route correcte pour votre API
          await api.post(`/task-comments/tasks/comments`, {
            content: taskData.initialComment,
            task_id: response.data.task.id
          });
        } catch (commentError) {
          console.error('Erreur lors de l\'ajout du commentaire initial:', commentError);
          // Ne pas interrompre le flux si le commentaire échoue
        }
      }
      
      await fetchData();
      
      setShowForm(false);
      Swal.fire({
        title: 'Succès!',
        text: 'Tâche ajoutée avec succès',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Erreur détaillée:', error);
      Swal.fire({
        title: 'Erreur!',
        text: 'Impossible d\'ajouter la tâche. Veuillez réessayer.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  // Fonction pour mettre à jour une tâche
  const handleUpdateTask = async (taskData) => {
    try {
      console.log('Données envoyées pour mise à jour de tâche:', taskData);
      const response = await api.put(`/tasks/${editingTask.id}`, taskData);
      console.log('Réponse après mise à jour:', response.data);
      
      // Ajouter le commentaire si présent
      if (taskData.newComment && taskData.newComment.trim() !== '') {
        try {
          console.log('Tentative d\'ajout du commentaire après mise à jour');
          // Utilisez la route correcte pour votre API
          await api.post(`/task-comments/tasks/comments`, {
            content: taskData.newComment,
            task_id: editingTask.id
          });
        } catch (commentError) {
          console.error('Erreur lors de l\'ajout du commentaire après mise à jour:', commentError);
          // Ne pas interrompre le flux si le commentaire échoue
        }
      }
      
      // Rafraîchir toutes les données après la mise à jour
      await fetchData();
      
      setEditingTask(null);
      setShowForm(false);
      
      Swal.fire({
        title: 'Succès!',
        text: 'Tâche mise à jour avec succès',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
      Swal.fire({
        title: 'Erreur!',
        text: 'Impossible de mettre à jour la tâche. Veuillez réessayer.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  // Fonction pour supprimer une tâche
  const handleDeleteTask = async (taskId) => {
    // Confirmation avant suppression
    const result = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Cette action ne peut pas être annulée!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    });
    
    if (result.isConfirmed) {
      try {
        await api.delete(`/tasks/${taskId}`);
        
        // Rafraîchir toutes les données après la suppression
        await fetchData();
        
        Swal.fire({
          title: 'Supprimé!',
          text: 'La tâche a été supprimée.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Erreur lors de la suppression de la tâche:', error);
        Swal.fire({
          title: 'Erreur!',
          text: 'Impossible de supprimer la tâche. Veuillez réessayer.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  // Fonction pour éditer une tâche
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  // Changement de l'option de tri
  const handleSortChange = (option) => {
    if (sortOption === option) {
      // Si on clique sur la même option, on inverse la direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Sinon, on change l'option et on met la direction par défaut
      setSortOption(option);
      setSortDirection('asc');
    }
  };

  let filteredTasks = [...tasks];

  if (selectedList) {
    filteredTasks = filteredTasks.filter(task => {
      // Si aucune liste sélectionnée ou liste vide = tâches sans liste
      if (selectedList === 'null' || selectedList === '') {
        return task.list_id === null;
      }
      
      // Conversion en nombre pour comparaison stricte
      return task.list_id === Number(selectedList);
    });
  
    console.log(`Nombre de tâches après filtrage par liste: ${filteredTasks.length}`);
  }
  
  if (selectedCategory && selectedCategory !== '') {
    filteredTasks = filteredTasks.filter(task => 
      task.categories && 
      task.categories.some(cat => String(cat.id) === String(selectedCategory))
    );
  }
  
  if (selectedStatus && selectedStatus !== '') {
    filteredTasks = filteredTasks.filter(task => task.status === selectedStatus);
  }
  
  if (selectedPriority && selectedPriority !== '') {
    filteredTasks = filteredTasks.filter(task => task.priority === selectedPriority);
  }

  // Tri des tâches
  const sortTasks = (tasksToSort) => {
    return [...tasksToSort].sort((a, b) => {
      let valueA, valueB;
      
      switch (sortOption) {
        case 'title':
          valueA = a.title.toLowerCase();
          valueB = b.title.toLowerCase();
          break;
        case 'due_date':
          valueA = a.due_date ? new Date(a.due_date).getTime() : Number.MAX_SAFE_INTEGER;
          valueB = b.due_date ? new Date(b.due_date).getTime() : Number.MAX_SAFE_INTEGER;
          break;
        case 'priority':
          const priorityValues = { 'high': 3, 'medium': 2, 'low': 1 };
          valueA = priorityValues[a.priority] || 0;
          valueB = priorityValues[b.priority] || 0;
          break;
        case 'status':
          const statusValues = { 'todo': 1, 'in_progress': 2, 'completed': 3 };
          valueA = statusValues[a.status] || 0;
          valueB = statusValues[b.status] || 0;
          break;
        case 'createdAt':
          valueA = new Date(a.createdAt).getTime();
          valueB = new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
        default:
          valueA = new Date(a.updatedAt).getTime();
          valueB = new Date(b.updatedAt).getTime();
          break;
      }
      
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
  };

  // Appliquer le tri
  const sortedTasks = sortTasks(filteredTasks);

  const getListName = (listId) => {
    if (listId === null || listId === undefined) return 'Aucune liste';
    
    const list = lists.find(list => String(list.id) === String(listId));
    return list ? list.title : 'Aucune liste';
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => String(cat.id) === String(categoryId));
    return category ? category.color : '#808080';
  };

  return (
    <div className="container mt-4">
      <h1>Gestionnaire de tâches</h1>
      
      <div className="d-flex justify-content-between mb-3">
        <button 
          onClick={() => {
            setEditingTask(null);
            setShowForm(!showForm);
          }}
          className="btn btn-primary"
        >
          {showForm ? 'Annuler' : 'Ajouter une tâche'}
        </button>

{/* Nouveau bouton pour gérer les listes */}
<Link to="/lists" className="btn btn-outline-primary">
          Gérer les listes
        </Link>

      </div>
      
      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h2 className="h5 mb-0">{editingTask ? 'Modifier la tâche' : 'Ajouter une tâche'}</h2>
          </div>
          <div className="card-body">
            <TaskForm 
              onSubmit={editingTask ? handleUpdateTask : handleAddTask}
              initialData={editingTask || {}}
              withComments={true}
            />
          </div>
        </div>
      )}
      
      <div className="card mb-3">
        <div className="card-header">
          <h2 className="h5 mb-0">Filtres</h2>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-3 mb-2">
              <label htmlFor="listFilter" className="form-label">Liste:</label>
              <select
                id="listFilter"
                className="form-select"
                value={selectedList}
                onChange={(e) => {
                  console.log('Liste sélectionnée:', e.target.value);
                  setSelectedList(e.target.value);
                }}
              >
                <option value="">Toutes les listes</option>
                {lists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="col-md-3 mb-2">
              <label htmlFor="categoryFilter" className="form-label">Catégorie:</label>
              <select
                id="categoryFilter"
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="col-md-3 mb-2">
              <label htmlFor="statusFilter" className="form-label">Statut:</label>
              <select
                id="statusFilter"
                className="form-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">Tous les statuts</option>
                <option value="todo">À faire</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminée</option>
              </select>
            </div>
            
            <div className="col-md-3 mb-2">
              <label htmlFor="priorityFilter" className="form-label">Priorité:</label>
              <select
                id="priorityFilter"
                className="form-select"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
              >
                <option value="">Toutes les priorités</option>
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
              </select>
            </div>
          </div>
          
          <div className="d-flex justify-content-end">
            <div className="btn-group">
              <button 
                className={`btn btn-sm ${sortOption === 'title' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => handleSortChange('title')}
              >
                Titre {sortOption === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
              </button>
              <button 
                className={`btn btn-sm ${sortOption === 'due_date' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => handleSortChange('due_date')}
              >
                Échéance {sortOption === 'due_date' && (sortDirection === 'asc' ? '↑' : '↓')}
              </button>
              <button 
                className={`btn btn-sm ${sortOption === 'priority' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => handleSortChange('priority')}
              >
                Priorité {sortOption === 'priority' && (sortDirection === 'asc' ? '↑' : '↓')}
              </button>
              <button 
                className={`btn btn-sm ${sortOption === 'status' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => handleSortChange('status')}
              >
                Statut {sortOption === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
              </button>
              <button 
                className={`btn btn-sm ${sortOption === 'updatedAt' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => handleSortChange('updatedAt')}
              >
                Dernière mise à jour {sortOption === 'updatedAt' && (sortDirection === 'asc' ? '↑' : '↓')}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      ) : (
        <div className="tasks-container">
          {sortedTasks.length > 0 ? (
            <div className="tasks-list">
              {sortedTasks.map(task => (
                <div key={task.id} className="card mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h5 className="card-title">{task.title}</h5>
                        {task.description && <p className="card-text">{task.description}</p>}
                        
                        <div className="mb-2">
                          {task.list_id && (
                            <span className="badge bg-info me-2">
                              {getListName(task.list_id)}
                            </span>
                          )}
                          
                          <span className={`badge ${getStatusClass(task.status)} me-2`}>
                            {statusLabels[task.status] || task.status}
                          </span>
                          
                          <span className={`badge ${getPriorityClass(task.priority)} me-2`}>
                            {priorityLabels[task.priority] || task.priority}
                          </span>
                          
                          {task.due_date && (
                            <span className="badge bg-secondary">
                              Échéance: {new Date(task.due_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        
                        {task.categories && task.categories.length > 0 && (
                          <div className="task-categories mb-2">
                            {task.categories.map(category => (
                              <span 
                                key={category.id} 
                                className="badge me-1" 
                                style={{ backgroundColor: category.color || getCategoryColor(category.id) }}
                              >
                                {category.name}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="task-actions mt-2">
                          <Link to={`/tasks/${task.id}`} className="btn btn-sm btn-info me-2">
                            Détails
                          </Link>
                          <button 
                            onClick={() => {
                              setShowCommentsFor(showCommentsFor === task.id ? null : task.id);
                              if (showCommentsFor !== task.id) {
                                setNewComment('');
                                setEditingComment(null);
                              }
                            }}
                            className="btn btn-sm btn-outline-secondary me-2"
                          >
                            {showCommentsFor === task.id ? 'Masquer les commentaires' : 'Voir les commentaires'}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <button 
                          onClick={() => handleEditTask(task)} 
                          className="btn btn-sm btn-outline-primary me-1"
                        >
                          Modifier
                        </button>
                        <button 
                          onClick={() => handleDeleteTask(task.id)} 
                          className="btn btn-sm btn-outline-danger"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                    
                    {showCommentsFor === task.id && (
                      <div className="comments-section mt-3 border-top pt-3">
                        <h6>Commentaires</h6>
                        
                        {/* Liste des commentaires */}
                        <div className="comments-list mb-3">
                          {comments[task.id] && comments[task.id].length > 0 ? (
                            comments[task.id].map(comment => (
                              <div key={comment.id} className="comment p-2 border-bottom">
                                <div className="d-flex justify-content-between">
                                  <div className="comment-content">
                                    {editingComment === comment.id ? (
                                      <div className="edit-comment-form">
                                        <textarea
                                          className="form-control mb-2"
                                          value={newComment}
                                          onChange={(e) => setNewComment(e.target.value)}
                                        />
                                        <div>
                                          <button
                                            className="btn btn-sm btn-success me-2"
                                            onClick={() => handleUpdateComment(comment.id, task.id, newComment)}
                                          >
                                            Enregistrer
                                          </button>
                                          <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => {
                                              setEditingComment(null);
                                              setNewComment('');
                                            }}
                                          >
                                            Annuler
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <>
                                        <p className="mb-1">{comment.content}</p>
                                        <small className="text-muted">
                                          {new Date(comment.createdAt).toLocaleString()}
                                        </small>
                                      </>
                                    )}
                                  </div>
                                  
                                  {editingComment !== comment.id && (
                                    <div className="comment-actions">
                                      <button
                                        className="btn btn-sm btn-link text-primary me-1"
                                        onClick={() => {
                                          setEditingComment(comment.id);
                                          setNewComment(comment.content);
                                        }}
                                      >
                                        Modifier
                                      </button>
                                      <button
                                        className="btn btn-sm btn-link text-danger"
                                        onClick={() => handleDeleteComment(comment.id, task.id)}
                                      >
                                        Supprimer
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-muted">Aucun commentaire pour cette tâche.</p>
                          )}
                        </div>
                        
                        {/* Formulaire d'ajout de commentaire */}
                        <div className="add-comment-form">
                          <div className="input-group">
                            <textarea
                              className="form-control"
                              placeholder="Ajouter un commentaire..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                            />
                            <button
      
                                className="btn btn-primary"
                              onClick={() => handleAddComment(task.id)}
                            >
                              Ajouter
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">
              Aucune tâche ne correspond aux critères de recherche.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Fonctions utilitaires
const getStatusClass = (status) => {
  switch (status) {
    case 'todo': return 'bg-secondary';
    case 'in_progress': return 'bg-primary';
    case 'completed': return 'bg-success';
    default: return 'bg-secondary';
  }
};

const getPriorityClass = (priority) => {
  switch (priority) {
    case 'high': return 'bg-danger';
    case 'medium': return 'bg-warning';
    case 'low': return 'bg-success';
    default: return 'bg-secondary';
  }
};

const statusLabels = {
  'todo': 'À faire',
  'in_progress': 'En cours',
  'completed': 'Terminée'
};

const priorityLabels = {
  'low': 'Basse',
  'medium': 'Moyenne',
  'high': 'Haute'
};

export default TasksPage;