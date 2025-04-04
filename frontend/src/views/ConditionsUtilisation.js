import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import '../styles/LegalPages.css';

const ConditionsUtilisation = () => {
  return (
    <div 
      className="legal-page" 
      role="main" 
      aria-labelledby="page-title"
      lang="fr"
    >
      <Helmet>
        <title>Conditions d'Utilisation - Manage Task</title>
        <meta 
          name="description" 
          content="Conditions d'utilisation de l'application Manage Task" 
        />
      </Helmet>


      <div className="legal-page">
      <h1>Conditions Générales d'Utilisation</h1>
      </div>

      <main id="main-content" tabIndex="-1">
        <section aria-labelledby="introduction-section">
          <h2 id="introduction-section">Introduction</h2>
          <p>
            Les présentes Conditions Générales d'Utilisation (CGU) définissent les règles 
            d'utilisation de l'application Manage Task. En utilisant cette application, 
            vous acceptez sans réserve l'ensemble de ces conditions.
          </p>
        </section>

        <section aria-labelledby="acces-section">
          <h2 id="acces-section">Accès à l'Application</h2>
          <ul>
            <li>
              <strong>Accès Public :</strong> Consultation de la page d'accueil et 
              inscription/connexion
            </li>
            <li>
              <strong>Accès Restreint :</strong> Fonctionnalités de gestion de tâches 
              réservées aux utilisateurs connectés
            </li>
          </ul>
        </section>

        <section aria-labelledby="obligations-section">
          <h2 id="obligations-section">Obligations des Utilisateurs</h2>
          <p>L'utilisateur s'engage à :</p>
          <ul>
            <li>Fournir des informations exactes lors de l'inscription</li>
            <li>Protéger la confidentialité de ses identifiants</li>
            <li>Utiliser l'application de manière responsable et éthique</li>
            <li>Ne pas partager son compte</li>
            <li>Respecter l'intégrité de l'application</li>
          </ul>
        </section>

        <section aria-labelledby="fonctionnalites-section">
          <h2 id="fonctionnalites-section">Fonctionnalités Principales</h2>
          <ul>
            <li>Création et gestion de tâches personnelles</li>
            <li>Création et gestion de listes personnalisées</li>
            <li>Personnalisation des tâches (priorité, catégorie, statut)</li>
            <li>Modification du profil utilisateur</li>
          </ul>
        </section>

        <section aria-labelledby="responsabilite-section">
          <h2 id="responsabilite-section">Limitation de Responsabilité</h2>
          <p>
            L'application est développée à titre personnel et académique. 
            Le développeur décline toute responsabilité concernant :
          </p>
          <ul>
            <li>Les pertes de données</li>
            <li>Les dysfonctionnements techniques</li>
            <li>L'utilisation inadéquate de l'application</li>
          </ul>
        </section>

        <section aria-labelledby="donnees-section">
          <h2 id="donnees-section">Protection des Données</h2>
          <p>
            Les données personnelles sont collectées et traitées conformément 
            à la politique de confidentialité de l'application. 
            Aucune donnée n'est partagée avec des tiers.
          </p>
        </section>

        <section aria-labelledby="evolution-section">
          <h2 id="evolution-section">Évolution des Conditions</h2>
          <p>
            Les présentes conditions peuvent être modifiées à tout moment. 
            Les utilisateurs seront informés de toute modification substantielle.
          </p>
        </section>

        <section aria-labelledby="contact-section">
          <h2 id="contact-section">Contact</h2>
          <p>
            <strong>Email :</strong> manage.task@gmail.com
          </p>
          <p>
            Pour toute question relative à l'utilisation de l'application.
          </p>
        </section>
      </main>
    </div>
  );
};

export default ConditionsUtilisation;