import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ListForm from './ListForm';
import Swal from 'sweetalert2';

const ListsPage = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingList, setEditingList] = useState(null);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setLoading(true);
        // URL corrigée sans /api/
        const response = await api.get('/lists');
        setLists(response.data.lists || []);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des listes:', error);
        Swal.fire({
          title: 'Erreur!',
          text: 'Impossible de charger les listes. Veuillez réessayer plus tard.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        setLoading(false);
      }
    };
    
    fetchLists();
  }, []);

  const handleAddList = async (listData) => {
    try {
      // URL corrigée sans /api/
      const response = await api.post('/lists', listData);
      setLists([...lists, response.data.list]);
      setShowForm(false);
      
      Swal.fire({
        title: 'Succès!',
        text: 'Liste ajoutée avec succès',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la liste:', error);
      Swal.fire({
        title: 'Erreur!',
        text: 'Impossible d\'ajouter la liste. Veuillez réessayer.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleUpdateList = async (listData) => {
    try {
      // URL corrigée sans /api/
      const response = await api.put(`/lists/${editingList.id}`, listData);
      setLists(lists.map(list => 
        list.id === editingList.id ? response.data.list : list
      ));
      setEditingList(null);
      setShowForm(false);
      
      Swal.fire({
        title: 'Succès!',
        text: 'Liste mise à jour avec succès',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la liste:', error);
      Swal.fire({
        title: 'Erreur!',
        text: 'Impossible de mettre à jour la liste. Veuillez réessayer.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleDeleteList = async (listId) => {
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
        // URL corrigée sans /api/
        await api.delete(`/lists/${listId}`);
        setLists(lists.filter(list => list.id !== listId));
        
        Swal.fire({
          title: 'Supprimé!',
          text: 'La liste a été supprimée avec succès.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Erreur lors de la suppression de la liste:', error);
        Swal.fire({
          title: 'Erreur!',
          text: 'Impossible de supprimer la liste. Veuillez réessayer.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  const handleEditList = (list) => {
    setEditingList(list);
    setShowForm(true);
  };

  return (
    <div className="container mt-4">
      <h1>Gestion des listes</h1>
      
      <div className="d-flex justify-content-between mb-3">
        <button 
          onClick={() => {
            setEditingList(null);
            setShowForm(!showForm);
          }}
          className="btn btn-primary"
        >
          {showForm ? 'Annuler' : 'Ajouter une liste'}
        </button>
        <Link to="/tasks" className="btn btn-outline-primary">Retour aux tâches</Link>
      </div>
      
      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h2 className="h5 mb-0">{editingList ? 'Modifier la liste' : 'Ajouter une liste'}</h2>
          </div>
          <div className="card-body">
            <ListForm 
              onSubmit={editingList ? handleUpdateList : handleAddList}
              initialData={editingList || {}}
            />
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {lists.length > 0 ? (
            lists.map(list => (
              <div key={list.id} className="col-md-4 mb-3">
                <div className="card h-100">
                  <div className="card-body">
                    <h3 className="card-title h5">{list.title}</h3>
                    {list.description && <p className="card-text">{list.description}</p>}
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <Link to={`/tasks?list=${list.id}`} className="btn btn-sm btn-outline-secondary">
                        Voir les tâches
                      </Link>
                    </div>
                  </div>
                  <div className="card-footer bg-white d-flex justify-content-end">
                    <button 
                      onClick={() => handleEditList(list)} 
                      className="btn btn-sm btn-outline-primary me-2"
                    >
                      Modifier
                    </button>
                    <button 
                      onClick={() => handleDeleteList(list.id)} 
                      className="btn btn-sm btn-outline-danger"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-info">
                Aucune liste trouvée. Créez une nouvelle liste pour commencer à organiser vos tâches.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ListsPage;