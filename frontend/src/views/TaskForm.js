// import React, { useState, useEffect } from 'react';
// import api from '../api';
// import Swal from 'sweetalert2';

// const TaskForm = ({ onSubmit, initialData = {} }) => {
//   const [title, setTitle] = useState(initialData.title || '');
//   const [description, setDescription] = useState(initialData.description || '');
//   const [dueDate, setDueDate] = useState(initialData.due_date ? new Date(initialData.due_date).toISOString().split('T')[0] : '');
//   const [priority, setPriority] = useState(initialData.priority || 'medium');
//   const [status, setStatus] = useState(initialData.status || 'todo');
 
//   const [listId, setListId] = useState(initialData.list_id !== undefined ? String(initialData.list_id) : '');
//   const [availableCategories, setAvailableCategories] = useState([]);
//   const [availableLists, setAvailableLists] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const [categories, setCategories] = useState([]);
//   const [selectedCategories, setSelectedCategories] = useState(
//     // Convertir les catégories initiales en tableau d'IDs
//     initialData.categories 
//       ? initialData.categories.map(cat => cat.id) 
//       : []
//   );

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         const categoriesResponse = await api.get('/categories');
//         setAvailableCategories(categoriesResponse.data.categories || []);
        
//         const listsResponse = await api.get('/lists');
//         const listsData = listsResponse.data.lists || [];
//         setAvailableLists(listsData);
        
//         setLoading(false);
//       } catch (error) {
//         console.error('Erreur lors de la récupération des données :', error);
//         Swal.fire({
//           title: 'Erreur !',
//           text: 'Impossible de charger les catégories et listes. Veuillez réessayer.',
//           icon: 'error',
//           confirmButtonText: 'OK'
//         });
//         setLoading(false);
//       }
//     };
    
//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (initialData && initialData.id) {
//       setTitle(initialData.title || '');
//       setDescription(initialData.description || '');
//       setDueDate(initialData.due_date ? new Date(initialData.due_date).toISOString().split('T')[0] : '');
//       setPriority(initialData.priority || 'medium');
//       setStatus(initialData.status || 'todo');
//       setCategories(initialData.categories ? initialData.categories.map(cat => cat.id) : []);
//       setListId(initialData.list_id !== undefined && initialData.list_id !== null ? String(initialData.list_id) : '');
//     }
//   }, [initialData]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (!title.trim()) {
//       setError('Le titre est obligatoire');
//       Swal.fire({
//         title: 'Validation',
//         text: 'Le titre est obligatoire',
//         icon: 'warning',
//         confirmButtonText: 'OK'
//       });
//       return;
//     }
    
//     const taskData = {
//       title,
//       description,
//       due_date: dueDate || null,
//       priority,
//       status,
//       categories,
//       list_id: listId && listId.trim() !== '' ? parseInt(listId, 10) : null
//     };
    
//     onSubmit(taskData);
    
//     // Réinitialisation du formulaire
//     if (!initialData.id) {
//       setTitle('');
//       setDescription('');
//       setDueDate('');
//       setPriority('medium');
//       setStatus('todo');
//       setCategories([]);
//       setListId('');
//     }
    
//     setError('');
//   };
//   const handleCategoryChange = (categoryId) => {
//     const id = parseInt(categoryId);
//     if (categories.includes(id)) {
//       setCategories(categories.filter(c => c !== id));
//     } else {
//       setCategories([...categories, id]);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center">
//         <div className="spinner-border" role="status">
//           <span className="visually-hidden">Chargement...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       {error && <div className="alert alert-danger">{error}</div>}
      
//       <div className="mb-3">
//         <label htmlFor="title" className="form-label">Titre :</label>
//         <input
//           type="text"
//           id="title"
//           className="form-control"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="Entrez le titre de la tâche"
//           required
//         />
//       </div>
      
//       <div className="mb-3">
//         <label htmlFor="description" className="form-label">Description :</label>
//         <textarea
//           id="description"
//           className="form-control"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           placeholder="Entrez la description de la tâche (optionnel)"
//           rows="3"
//         />
//       </div>
      
//       <div className="row mb-3">
//         <div className="col-md-6">
//           <label htmlFor="dueDate" className="form-label">Date d'échéance :</label>
//           <input
//             type="date"
//             id="dueDate"
//             className="form-control"
//             value={dueDate}
//             onChange={(e) => setDueDate(e.target.value)}
//           />
//         </div>
        
//         <div className="col-md-6">
//           <label htmlFor="listId" className="form-label">Liste :</label>
//           <select
//             id="listId"
//             className="form-select"
//             value={listId}
//             onChange={(e) => setListId(e.target.value)}
//           >
//             <option value="">Aucune liste</option>
//             {availableLists.map((list) => (
//               <option key={list.id} value={String(list.id)}>
//                 {list.title}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>
      
//       <div className="row mb-3">
//         <div className="col-md-6">
//           <label htmlFor="priority" className="form-label">Priorité :</label>
//           <select
//             id="priority"
//             className="form-select"
//             value={priority}
//             onChange={(e) => setPriority(e.target.value)}
//           >
//             <option value="low">Basse</option>
//             <option value="medium">Moyenne</option>
//             <option value="high">Haute</option>
//           </select>
//         </div>
        
//         <div className="col-md-6">
//           <label htmlFor="status" className="form-label">Statut :</label>
//           <select
//             id="status"
//             className="form-select"
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//           >
//             <option value="todo">À faire</option>
//             <option value="in_progress">En cours</option>
//             <option value="completed">Terminée</option>
//           </select>
//         </div>
//       </div>
      
//       <div className="mb-3">
//         <label className="form-label">Catégories :</label>
//         <div className="d-flex flex-wrap gap-2">
//           {availableCategories.map(category => (
//             <div key={category.id} className="form-check">
//               <input
//                 type="checkbox"
//                 id={`category-${category.id}`}
//                 className="form-check-input"
//                 checked={categories.includes(category.id)}
//                 onChange={() => handleCategoryChange(category.id)}
//               />
//               <label 
//                 htmlFor={`category-${category.id}`} 
//                 className="form-check-label"
//                 style={{ color: category.color }}
//               >
//                 {category.name}
//               </label>
//             </div>
//           ))}
//         </div>
//       </div>
      
//       <button type="submit" className="btn btn-primary">
//         {initialData.id ? 'Mettre à jour' : 'Créer'}
//       </button>
//     </form>
//   );
// };

// export default TaskForm;








import React, { useState, useEffect } from 'react';
import api from '../api';

const TaskForm = ({ onSubmit, initialData = {}, withComments = false }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [dueDate, setDueDate] = useState(initialData.due_date || '');
  const [priority, setPriority] = useState(initialData.priority || 'medium');
  const [status, setStatus] = useState(initialData.status || 'todo');
  const [listId, setListId] = useState(initialData.list_id || '');
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(
    initialData.categories ? initialData.categories.map(cat => cat.id.toString()) : []
  );
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  // Nouveau champ pour le commentaire
  const [commentText, setCommentText] = useState('');

  // Chargement des listes et catégories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listsResponse, categoriesResponse] = await Promise.all([
          api.get('/lists'),
          api.get('/categories')
        ]);
        
        setLists(listsResponse.data.lists || []);
        setCategories(categoriesResponse.data.categories || []);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Gestion des catégories
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    if (e.target.checked) {
      setSelectedCategories(prev => [...prev, categoryId]);
    } else {
      setSelectedCategories(prev => prev.filter(id => id !== categoryId));
    }
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const taskData = {
      title,
      description,
      due_date: dueDate,
      priority,
      status,
      list_id: listId === '' ? null : listId,
      // Changer "category_ids" par "categories" pour correspondre à ce qu'attend le backend
      categories: selectedCategories.map(id => parseInt(id))
    };
    
    console.log("Données envoyées, incluant catégories:", taskData);
    
    // Ajouter le commentaire si la fonctionnalité est activée et qu'il y a du texte
    if (withComments && commentText.trim()) {
      if (initialData.id) {
        // Pour une mise à jour de tâche
        taskData.newComment = commentText;
      } else {
        // Pour une nouvelle tâche
        taskData.initialComment = commentText;
      }
    }
    
    onSubmit(taskData);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">Titre *</label>
        <input
          type="text"
          className="form-control"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          className="form-control"
          id="description"
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="dueDate" className="form-label">Date d'échéance</label>
          <input
            type="date"
            className="form-control"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        
        <div className="col-md-6">
          <label htmlFor="list" className="form-label">Liste</label>
          <select
            className="form-select"
            id="list"
            value={listId}
            onChange={(e) => setListId(e.target.value)}
          >
            <option value="">Aucune liste</option>
            {lists.map(list => (
              <option key={list.id} value={list.id}>
                {list.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="priority" className="form-label">Priorité</label>
          <select
            className="form-select"
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
          </select>
        </div>
        
        <div className="col-md-6">
          <label htmlFor="status" className="form-label">Statut</label>
          <select
            className="form-select"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="todo">À faire</option>
            <option value="in_progress">En cours</option>
            <option value="completed">Terminée</option>
          </select>
        </div>
      </div>
      
      <div className="mb-3">
        <label className="form-label">Catégories</label>
        <div className="categories-container">
          {categories.map(category => (
            <div className="form-check" key={category.id}>
              <input
                className="form-check-input"
                type="checkbox"
                id={`category-${category.id}`}
                value={category.id}
                checked={selectedCategories.includes(category.id.toString())}
                onChange={handleCategoryChange}
              />
              <label
                className="form-check-label"
                htmlFor={`category-${category.id}`}
                style={{ color: category.color }}
              >
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Champ de commentaire */}
      {withComments && (
        <div className="mb-3">
          <label htmlFor="comment" className="form-label">
            {initialData.id ? "Ajouter un commentaire" : "Commentaire initial"}
          </label>
          <textarea
            className="form-control"
            id="comment"
            rows="3"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Entrez un commentaire (optionnel)"
          />
        </div>
      )}
      
      <div className="d-flex justify-content-end">
        <button type="submit" className="btn btn-primary">
          {initialData.id ? 'Mettre à jour' : 'Créer'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;