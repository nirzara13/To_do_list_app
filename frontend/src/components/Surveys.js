import React, { useEffect, useState } from 'react';
import '../styles/Surveys.css';
import { useNavigate } from 'react-router-dom';

const Surveys = () => {
  const [surveys, setSurveys] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/surveys');
        const data = await response.json();
        setSurveys(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des sondages:', error);
      }
    };

    fetchSurveys();
  }, []);

  const handleTakeSurvey = (id) => {
    navigate(`/survey/${id}`);
  };

  return (
    <div className="surveys-container">
      <h1>Sondages Disponibles</h1>
      {surveys.map((survey) => (
        <div key={survey.id} className="survey-card">
          <h2>{survey.title}</h2>
          <p>{survey.description}</p>
          <button onClick={() => handleTakeSurvey(survey.id)} className="animated-button">Participer</button>
        </div>
      ))}
    </div>
  );
};

export default Surveys;
