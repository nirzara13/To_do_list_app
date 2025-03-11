import React from 'react';
import '../styles/Legal.css'; // Assurez-vous de créer ce fichier CSS pour les styles communs

const MentionsLegales = () => {
  return (
    <div className="legal-page">
      <h1>Mentions Légales</h1>
      <p>Conformément aux dispositions des articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la Confiance dans l’économie numérique, dite L.C.E.N., nous portons à la connaissance des utilisateurs et visiteurs du site : <strong>www.sondageplus.com</strong> les informations suivantes :</p>
      
      <h2>1. Informations légales :</h2>
      <p>
        Statut du propriétaire : <br />
        Propriétaire du site : MonSite <br />
        Responsable de la publication : M. Dupont - contact@monsite.com <br />
        Conception et développement : MonSite Team <br />
        Hébergeur : OVH - 2 rue Kellermann 59100 Roubaix
      </p>
      
      <h2>2. Conditions d'utilisation :</h2>
      <p>L’utilisation du site <strong>www.monsite.com</strong> implique l’acceptation pleine et entière des conditions générales d’utilisation ci-après décrites.</p>
      
      <h2>3. Services fournis :</h2>
      <p>Le site <strong>www.monsite.com</strong> a pour objet de fournir une information concernant l’ensemble des activités de la société.</p>
      
      <h2>4. Propriété intellectuelle :</h2>
      <p>Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de : MonSite.</p>
    </div>
  );
};

export default MentionsLegales;
