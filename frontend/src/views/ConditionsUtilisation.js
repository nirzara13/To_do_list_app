import React from 'react';
import '../styles/Legal.css'; // Assurez-vous de créer ce fichier CSS pour les styles communs

const ConditionsUtilisation = () => {
  return (
    <div className="legal-page">
      <h1>Conditions d'Utilisation</h1>
      <p>Les présentes conditions d'utilisation sont conclues entre le propriétaire du site internet <strong>www.sondageplus.com</strong> et l’utilisateur.</p>
      
      <h2>1. Acceptation des conditions :</h2>
      <p>En accédant à ce site, vous acceptez sans réserve les présentes conditions d'utilisation.</p>
      
      <h2>2. Utilisation du site :</h2>
      <p>Vous vous engagez à ne pas utiliser ce site à des fins illégales ou interdites par les lois ou règlements en vigueur.</p>
      
      <h2>3. Limitation de responsabilité :</h2>
      <p>Le propriétaire du site ne pourra être tenu pour responsable des dommages directs et indirects causés au matériel de l’utilisateur, lors de l’accès au site <strong>www.monsite.com</strong>.</p>
    </div>
  );
};

export default ConditionsUtilisation;
