import React from 'react';
import { Helmet } from 'react-helmet';
import '../styles/LegalPages.css';

const PolitiqueConfidentialite = () => {
  return (
    <div 
      className="legal-page" 
      role="main" 
      aria-labelledby="page-title"
      lang="fr"
    >
      <Helmet>
        <title>Politique de Confidentialité - Manage Task</title>
        <meta 
          name="description" 
          content="Politique de confidentialité de l'application Manage Task" 
        />
      </Helmet>

     <br />
     <br />

      <h1 
        id="page-title" 
        tabIndex="0"
      >
        Politique de Confidentialité
      </h1>

      <main id="main-content" tabIndex="-1">
        <section aria-labelledby="introduction-section">
          <h2 id="introduction-section">Introduction</h2>
          <p>
            La présente politique de confidentialité a pour objectif de vous informer 
            de la manière dont vos données personnelles sont collectées, utilisées 
            et protégées au sein de l'application Manage Task.
          </p>
        </section>

        <section aria-labelledby="donnees-section">
          <h2 id="donnees-section">Données Collectées</h2>
          <p>Nous collectons uniquement les informations nécessaires au fonctionnement de l'application :</p>
          <ul>
            <li>Adresse email (pour l'inscription et la connexion)</li>
            <li>Mot de passe (haché pour des raisons de sécurité)</li>
            <li>Nom d'utilisateur</li>
            <li>Données des tâches et listes créées par l'utilisateur</li>
          </ul>
        </section>

        <section aria-labelledby="utilisation-section">
          <h2 id="utilisation-section">Utilisation des Données</h2>
          <p>Les données collectées sont utilisées uniquement pour :</p>
          <ul>
            <li>Permettre la création et la gestion de compte</li>
            <li>Gérer les tâches et les listes personnelles</li>
            <li>Assurer le bon fonctionnement de l'application</li>
          </ul>
          <p><strong>Aucune donnée n'est partagée avec des tiers.</strong></p>
        </section>

        <section aria-labelledby="securite-section">
          <h2 id="securite-section">Sécurité des Données</h2>
          <p>Nous mettons en œuvre plusieurs mesures de sécurité :</p>
          <ul>
            <li>Hashage des mots de passe avec bcrypt</li>
            <li>Stockage sécurisé dans une base de données MySQL locale</li>
            <li>Authentification sécurisée via JSON Web Tokens (JWT)</li>
            <li>Aucun partage de données avec des services externes</li>
          </ul>
        </section>

        <section aria-labelledby="droits-section">
          <h2 id="droits-section">Vos Droits</h2>
          <p>Conformément aux réglementations sur la protection des données, vous disposez des droits suivants :</p>
          <ul>
            <li>Droit d'accès à vos données personnelles</li>
            <li>Droit de modification de vos informations</li>
            <li>Droit de suppression de votre compte et de vos données</li>
          </ul>
          <p>Ces droits sont accessibles directement depuis votre tableau de bord.</p>
        </section>

        <section aria-labelledby="conservation-section">
          <h2 id="conservation-section">Conservation des Données</h2>
          <p>
            Vos données sont conservées uniquement pendant la durée d'utilisation 
            active de l'application. La suppression de votre compte entraîne 
            la suppression définitive de toutes vos données.
          </p>
        </section>

        <section aria-labelledby="contact-section">
          <h2 id="contact-section">Contact</h2>
          <p>
            Pour toute question relative à vos données personnelles, 
            vous pouvez nous contacter à :
          </p>
          <p>
            <strong>Email :</strong> manage.task@gmail.com
          </p>
        </section>
      </main>
    </div>
  );
};

export default PolitiqueConfidentialite;