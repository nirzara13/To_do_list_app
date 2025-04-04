import React from 'react';
import { Helmet } from 'react-helmet';
import '../styles/LegalPages.css';

const MentionsLegales = () => {
  return (
    <div 
      className="legal-page" 
      role="main" 
      aria-labelledby="page-title"
      lang="fr"
    >
      <Helmet>
        <title>Mentions Légales - Manage Task</title>
        <meta 
          name="description" 
          content="Mentions légales de l'application Manage Task" 
        />
      </Helmet>

<br />
<br />
      <h1 
        id="page-title" 
        tabIndex="0"
      >
        Mentions Légales
      </h1>

      <main id="main-content" tabIndex="-1">
        <section aria-labelledby="editeur-section">
          <h2 id="editeur-section">Informations Éditeur</h2>
          <p><strong>Nom de l'application :</strong> Manage Task</p>
          <p><strong>Nature :</strong> Application personnelle de gestion de tâches</p>
          <p><strong>Développeur :</strong> Nirzara BARUA</p>
          <p><strong>Contexte :</strong> Projet académique de développement web</p>
        </section>

        <section aria-labelledby="technologie-section">
          <h2 id="technologie-section">Technologies Utilisées</h2>
          <ul>
            <li>Frontend : React.js</li>
            <li>Backend : Node.js avec Express</li>
            <li>Base de données : MySQL (Laragon)</li>
            <li>Versionnement : GitHub</li>
          </ul>
        </section>

        <section aria-labelledby="hebergement-section">
          <h2 id="hebergement-section">Hébergement</h2>
          <p>Projet développé localement dans un cadre personnel et académique. Aucun hébergement commercial n'est utilisé.</p>
        </section>

        <section aria-labelledby="responsabilite-section">
          <h2 id="responsabilite-section">Responsabilité</h2>
          <p>L'application est fournie "en l'état", sans garantie de fonctionnement parfait. Développée à des fins personnelles et éducatives.</p>
        </section>

        <section aria-labelledby="contact-section">
          <h2 id="contact-section">Contact</h2>
          <p><strong>Email :</strong> manage.task@gmail.com</p>
        </section>
      </main>
    </div>
  );
};

export default MentionsLegales;