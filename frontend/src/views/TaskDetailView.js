import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import TaskCommentSection from './TaskCommentSection';

const TaskDetailView = () => {
  const [task, setTask] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await api.get(`/tasks/${id}`);
        setTask(response.data.task);
      } catch (error) {
        console.error('Erreur de récupération des détails', error);
      }
    };

    fetchTaskDetails();
  }, [id]);

  if (!task) return <div>Chargement...</div>;

  return (
    <div className="container mt-4">
      <h1>{task.title}</h1>
      
      {/* Détails de la tâche */}
      <div className="card mb-3">
        <div className="card-body">
          <p><strong>Description :</strong> {task.description}</p>
          <p><strong>Statut :</strong> {task.status}</p>
          <p><strong>Priorité :</strong> {task.priority}</p>
        </div>
      </div>

      {/* Section des commentaires */}
      <TaskCommentSection taskId={task.id} />
    </div>
  );
};

export default TaskDetailView;