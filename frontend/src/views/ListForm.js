import React, { useState } from 'react';
import Swal from 'sweetalert2';

const ListForm = ({ onSubmit, initialData = {} }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      setError('Le titre est obligatoire');
      
      // Afficher une alerte SweetAlert2 pour l'erreur
      Swal.fire({
        title: 'Validation',
        text: 'Le titre est obligatoire',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      
      return;
    }
    
    // Préparer les données
    const listData = {
      title,
      description
    };
    
    // Envoi au parent
    onSubmit(listData);
    
    // Réinitialiser le formulaire si ce n'est pas une mise à jour
    if (!initialData.id) {
      setTitle('');
      setDescription('');
    }
    
    setError('');
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="mb-3">
        <label htmlFor="title" className="form-label">Titre:</label>
        <input
          type="text"
          id="title"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entrez le titre de la liste"
          required
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description:</label>
        <textarea
          id="description"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Entrez la description de la liste (optionnel)"
          rows="3"
        />
      </div>
      
      <button type="submit" className="btn btn-primary">
        {initialData.id ? 'Mettre à jour' : 'Créer'}
      </button>
    </form>
  );
};

export default ListForm;