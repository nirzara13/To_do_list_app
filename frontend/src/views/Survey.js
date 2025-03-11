import React, { useEffect, useState } from 'react';
import '../styles/Surveys.css';
import AnimatedButton from '../components/AnimatedButton';
import { useNavigate } from 'react-router-dom';

const Surveys = () => {
  const [surveyList, setSurveyList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch('http://votre-backend-url/api/surveys'); // Remplacez par votre URL d'API
        const data = await response.json();
        setSurveyList(data.surveys);
      } catch (error) {
        console.error('Erreur lors de la récupération des sondages:', error);
      }
    };

    fetchSurveys();
  }, []);

  const handleStartSurvey = (surveyId) => {
    navigate(`/survey/${surveyId}`);
  };

  return (
    <div className="surveys-container">
      <h1>Liste des Sondages</h1>
      {surveyList.map((survey) => (
        <div className="survey-card" key={survey.id}>
          <h3>{survey.title}</h3>
          <p>{survey.description}</p>
          <AnimatedButton text="Participer" onClick={() => handleStartSurvey(survey.id)} />
        </div>
      ))}
    </div>
  );
};

export default Surveys;
