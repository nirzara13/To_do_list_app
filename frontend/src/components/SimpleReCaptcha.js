import React, { useEffect } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import config from '../config';  // Importation du fichier de configuration

const SimpleReCaptcha = () => {
  const siteKey = config.recaptchaSiteKey;
  
  useEffect(() => {
    console.log("SimpleReCaptcha - Clé du site:", siteKey);
  }, [siteKey]);

  // Fonction qui sera appelée lorsque reCAPTCHA est résolu
  const handleChange = (token) => {
    console.log("reCAPTCHA résolu avec le token:", token);
  };

  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Test Simple de reCAPTCHA</h2>
      
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '20px' }}>
        <h3>Information de clé</h3>
        <div>
          <strong>Clé reCAPTCHA:</strong> {siteKey || "Non définie"}
        </div>
      </div>
      
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Composant reCAPTCHA</h3>
        {siteKey ? (
          <ReCAPTCHA
            sitekey={siteKey}
            onChange={handleChange}
          />
        ) : (
          <div style={{ color: 'red', padding: '10px', backgroundColor: '#ffeeee', borderRadius: '5px' }}>
            La clé reCAPTCHA n'est pas définie. Vérifiez votre fichier config.js
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleReCaptcha;