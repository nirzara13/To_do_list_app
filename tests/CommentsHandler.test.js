/**
 * Tests unitaires pour les fonctions de gestion des commentaires
 */

// Import des dépendances pour les mocks
import '@testing-library/jest-dom';

// Mock d'API
const apiMock = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

// SweetAlert2 mock
const swalMock = {
  fire: jest.fn(),
};

// Gestionnaire de commentaires - extrait et adapté de TasksPage
class CommentsHandler {
  constructor(api, swal) {
    this.api = api;
    this.swal = swal;
    this.comments = {};
  }

  // Charger les commentaires d'une tâche
  async fetchComments(taskId) {
    try {
      const response = await this.api.get(`/task-comments/tasks/${taskId}/comments`);
      this.comments[taskId] = response.data.comments || [];
      return this.comments[taskId];
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
      return [];
    }
  }

  // Ajouter un commentaire
  async addComment(taskId, content) {
    if (!content.trim()) return false;
    
    try {
      await this.api.post(`/task-comments/tasks/comments`, {
        content: content,
        task_id: taskId
      });
      
      // Rafraîchir les commentaires
      await this.fetchComments(taskId);
      
      this.swal.fire({
        title: 'Succès!',
        text: 'Commentaire ajouté avec succès',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
      
      return true;
    } catch (error) {
      try {
        // Tentative alternative
        await this.api.post(`/comments`, {
          content: content,
          task_id: taskId
        });
        
        // Rafraîchir les commentaires
        await this.fetchComments(taskId);
        
        this.swal.fire({
          title: 'Succès!',
          text: 'Commentaire ajouté avec succès',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        
        return true;
      } catch (secondError) {
        this.swal.fire({
          title: 'Erreur!',
          text: 'Impossible d\'ajouter le commentaire. Veuillez réessayer.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return false;
      }
    }
  }

  // Mettre à jour un commentaire
  async updateComment(commentId, taskId, content) {
    try {
      await this.api.put(`/task-comments/comments/${commentId}`, {
        content: content
      });
      
      // Rafraîchir les commentaires
      await this.fetchComments(taskId);
      
      this.swal.fire({
        title: 'Succès!',
        text: 'Commentaire mis à jour avec succès',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
      
      return true;
    } catch (error) {
      this.swal.fire({
        title: 'Erreur!',
        text: 'Impossible de mettre à jour le commentaire. Veuillez réessayer.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return false;
    }
  }

  // Supprimer un commentaire
  async deleteComment(commentId, taskId) {
    this.swal.fire.mockResolvedValueOnce({ isConfirmed: true });
    
    try {
      await this.api.delete(`/task-comments/comments/${commentId}`);
      
      // Rafraîchir les commentaires
      await this.fetchComments(taskId);
      
      this.swal.fire({
        title: 'Supprimé!',
        text: 'Le commentaire a été supprimé.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
      
      return true;
    } catch (error) {
      this.swal.fire({
        title: 'Erreur!',
        text: 'Impossible de supprimer le commentaire. Veuillez réessayer.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return false;
    }
  }
}

describe('Gestionnaire de commentaires', () => {
  let commentsHandler;
  
  beforeEach(() => {
    // Réinitialiser les mocks
    apiMock.get.mockReset();
    apiMock.post.mockReset();
    apiMock.put.mockReset();
    apiMock.delete.mockReset();
    swalMock.fire.mockReset();
    
    commentsHandler = new CommentsHandler(apiMock, swalMock);
  });
  
  describe('fetchComments', () => {
    test('récupère les commentaires d\'une tâche avec succès', async () => {
      const mockComments = [
        { id: 1, content: 'Comment 1', task_id: 1 },
        { id: 2, content: 'Comment 2', task_id: 1 }
      ];
      
      apiMock.get.mockResolvedValueOnce({
        data: { comments: mockComments }
      });
      
      const result = await commentsHandler.fetchComments(1);
      
      expect(apiMock.get).toHaveBeenCalledWith('/task-comments/tasks/1/comments');
      expect(result).toEqual(mockComments);
      expect(commentsHandler.comments[1]).toEqual(mockComments);
    });
    
    test('gère les erreurs lors de la récupération des commentaires', async () => {
      apiMock.get.mockRejectedValueOnce(new Error('API error'));
      
      const result = await commentsHandler.fetchComments(1);
      
      expect(apiMock.get).toHaveBeenCalledWith('/task-comments/tasks/1/comments');
      expect(result).toEqual([]);
    });
  });
  
  describe('addComment', () => {
    test('ajoute un commentaire avec succès', async () => {
      apiMock.post.mockResolvedValueOnce({
        data: { comment: { id: 3, content: 'New comment', task_id: 1 } }
      });
      
      apiMock.get.mockResolvedValueOnce({
        data: { comments: [
          { id: 1, content: 'Comment 1', task_id: 1 },
          { id: 2, content: 'Comment 2', task_id: 1 },
          { id: 3, content: 'New comment', task_id: 1 }
        ]}
      });
      
      const result = await commentsHandler.addComment(1, 'New comment');
      
      expect(apiMock.post).toHaveBeenCalledWith('/task-comments/tasks/comments', {
        content: 'New comment',
        task_id: 1
      });
      
      expect(apiMock.get).toHaveBeenCalledWith('/task-comments/tasks/1/comments');
      expect(swalMock.fire).toHaveBeenCalled();
      expect(result).toBe(true);
    });
    
    test('utilise la route alternative lorsque la première échoue', async () => {
      // Premier appel échoue
      apiMock.post.mockRejectedValueOnce(new Error('API error'));
      
      // Second appel réussit
      apiMock.post.mockResolvedValueOnce({
        data: { comment: { id: 3, content: 'New comment', task_id: 1 } }
      });
      
      apiMock.get.mockResolvedValueOnce({
        data: { comments: [
          { id: 1, content: 'Comment 1', task_id: 1 },
          { id: 2, content: 'Comment 2', task_id: 1 },
          { id: 3, content: 'New comment', task_id: 1 }
        ]}
      });
      
      const result = await commentsHandler.addComment(1, 'New comment');
      
      expect(apiMock.post).toHaveBeenCalledTimes(2);
      expect(apiMock.post).toHaveBeenNthCalledWith(2, '/comments', {
        content: 'New comment',
        task_id: 1
      });
      
      expect(apiMock.get).toHaveBeenCalledWith('/task-comments/tasks/1/comments');
      expect(swalMock.fire).toHaveBeenCalled();
      expect(result).toBe(true);
    });
    
    test('gère les erreurs lorsque les deux routes échouent', async () => {
      // Les deux appels échouent
      apiMock.post.mockRejectedValueOnce(new Error('API error 1'));
      apiMock.post.mockRejectedValueOnce(new Error('API error 2'));
      
      const result = await commentsHandler.addComment(1, 'New comment');
      
      expect(apiMock.post).toHaveBeenCalledTimes(2);
      expect(swalMock.fire).toHaveBeenCalled();
      expect(result).toBe(false);
    });
    
    test('ignore les commentaires vides', async () => {
      const result = await commentsHandler.addComment(1, '   ');
      
      expect(apiMock.post).not.toHaveBeenCalled();
      expect(apiMock.get).not.toHaveBeenCalled();
      expect(swalMock.fire).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });
});