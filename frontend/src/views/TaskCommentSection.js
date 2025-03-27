import React, { useState, useEffect } from 'react';
import api from '../api';
import Swal from 'sweetalert2';

const TaskCommentSection = ({ taskId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Charger les commentaires
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(`/tasks/${taskId}/comments`);
        setComments(response.data.comments || []);
      } catch (error) {
        console.error('Erreur de chargement des commentaires', error);
        Swal.fire({
          title: 'Erreur',
          text: 'Impossible de charger les commentaires',
          icon: 'error'
        });
      }
    };

    fetchComments();
  }, [taskId]);

  // Ajouter un commentaire
  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      Swal.fire({
        title: 'Validation',
        text: 'Le commentaire ne peut pas être vide',
        icon: 'warning'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/tasks/comments', {
        task_id: taskId,
        content: newComment
      });

      // Ajouter le nouveau commentaire en haut de la liste
      setComments([response.data.comment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Erreur d\'ajout de commentaire', error);
      Swal.fire({
        title: 'Erreur',
        text: 'Impossible d\'ajouter le commentaire',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-comments-section card mt-4">
      <div className="card-header">
        <h4>Commentaires</h4>
      </div>
      <div className="card-body">
        {/* Formulaire d'ajout de commentaire */}
        <form onSubmit={handleAddComment} className="mb-3">
          <textarea
            className="form-control mb-2"
            placeholder="Ajouter un commentaire..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={loading}
            rows="3"
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || !newComment.trim()}
          >
            {loading ? 'Envoi...' : 'Ajouter un commentaire'}
          </button>
        </form>

        {/* Liste des commentaires */}
        {comments.length === 0 ? (
          <p className="text-muted text-center">Aucun commentaire pour le moment</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="card mb-2">
              <div className="card-body">
                <p className="card-text">{comment.content}</p>
                <footer className="blockquote-footer">
                  {comment.user && comment.user.username ? comment.user.username : 'Utilisateur'} 
                  - {new Date(comment.created_at || comment.createdAt).toLocaleString()}
                </footer>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskCommentSection;