// src/pages/AddSurvey.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddSurvey = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/sondages', {
        title,
        description,
      });

      // Rediriger vers la liste des sondages après ajout
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du sondage', error);
    }
  };

  return (
    <div>
      <h2>Ajouter un sondage</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Titre du sondage</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Ajouter le sondage</button>
      </form>
    </div>
  );
};

export default AddSurvey;
