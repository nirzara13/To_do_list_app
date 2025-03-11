// import React from 'react';
// import './AnimatedButton.css';  // Assurez-vous d'importer le fichier CSS du bouton animé

// const AnimatedButton = ({ text }) => {
//   return (
//     <button className="animated-button">
//       {text} {/* Affichage du texte passé en prop */}
//     </button>
//   );
// };

// export default AnimatedButton;

import React from 'react';
import '../styles/AnimatedButton.css';


const AnimatedButton = ({ text }) => {
  return <button className="animated-button">{text}</button>;
};

export default AnimatedButton;

