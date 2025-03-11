import React from 'react';
import '../styles/Legal.css'; // Assurez-vous de créer ce fichier CSS pour les styles communs

const PolitiqueConfidentialite = () => {
  return (
    <div className="legal-page">
      <h1>Politique de Confidentialité</h1>
      <p>Cette politique de confidentialité s’applique au site : <strong>www.sondageplus.com</strong>.</p>
      
      <h2>1. Collecte des informations :</h2>
      <p>Nous recueillons des informations lorsque vous vous inscrivez sur notre site, lorsque vous vous connectez à votre compte, faites un achat, participez à un concours, et/ou lorsque vous vous déconnectez.</p>
      
      <h2>2. Utilisation des informations :</h2>
      <p>Toutes les informations que nous recueillons auprès de vous peuvent être utilisées pour :</p>
      <ul>
        <li>Personnaliser votre expérience et répondre à vos besoins individuels</li>
        <li>Fournir un contenu publicitaire personnalisé</li>
        <li>Améliorer notre site</li>
        <li>Améliorer le service client et vos besoins de prise en charge</li>
        <li>Vous contacter par e-mail</li>
        <li>Administrer un concours, une promotion, ou une enquête</li>
      </ul>
      
      <h2>3. Confidentialité des informations :</h2>
      <p>Nous sommes les seuls propriétaires des informations recueillies sur ce site.</p>
    </div>
  );
};

export default PolitiqueConfidentialite;
