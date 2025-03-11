import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/SurveyDetail.css';

const SurveyDetail = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/surveys/${id}`);
        const data = await response.json();
        setSurvey(data);
      } catch (error) {
        console.error('Erreur lors de la récupération du sondage:', error);
      }
    };

    fetchSurvey();
  }, [id]);

  return (
    <div className="survey-detail-container">
      {survey ? (
        <>
          <h1>{survey.title}</h1>
          <p>{survey.description}</p>
          <div className="questions-container">
            {survey.Questions.map((question) => (
              <div key={question.id} className="question-card">
                <h2>{question.texte_question}</h2>
                {/* Ajouter ici le formulaire pour répondre à la question */}
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
};

export default SurveyDetail;
