// src/pages/CreateSurvey.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateSurvey = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();  // Pour rediriger après la création du sondage

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/sondages', {
        title,
        description,
      });
      console.log('Sondage créé', response.data);

      // Redirection vers la page d'accueil ou la liste des sondages après la création
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la création du sondage', error);
    }
  };

  return (
    <div>
      <h2>Créer un nouveau sondage</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Titre :</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description :</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Créer</button>
      </form>
    </div>
  );
};

export default CreateSurvey;
