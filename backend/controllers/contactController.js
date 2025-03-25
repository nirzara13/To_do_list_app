const axios = require('axios');
const nodemailer = require('nodemailer');
const qs = require('querystring');

const sendContactEmail = async (req, res) => {
  console.log('📧 DÉBUT DU TRAITEMENT DU CONTACT');
  console.log('Variables d\'environnement SMTP:', {
    SMTP_USER: process.env.SMTP_USER ? 'Présent' : 'Manquant',
    SMTP_PASS: process.env.SMTP_PASS ? 'Présent' : 'Manquant',
    EMAIL_RECIPIENT: process.env.EMAIL_RECIPIENT
  });

  const { name, email, message, recaptchaToken } = req.body;

  try {
    // Validation des données reçues
    if (!name || !email || !message) {
      console.error('❌ Données incomplètes');
      return res.status(400).json({
        message: 'Données du formulaire incomplètes'
      });
    }

    // Vérification du token reCAPTCHA
    console.log('🔍 Vérification reCAPTCHA en cours');
    const captchaResponse = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      qs.stringify({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: recaptchaToken
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    console.log('✅ Réponse reCAPTCHA:', captchaResponse.data);

    // Vérifier le score reCAPTCHA
    if (!captchaResponse.data.success || captchaResponse.data.score < 0.5) {
      console.log('❌ Vérification reCAPTCHA échouée');
      return res.status(400).json({
        message: 'Vérification de sécurité échouée',
        details: captchaResponse.data
      });
    }

    // Configuration du transporteur Nodemailer
    // Configuration du transporteur Nodemailer
console.log('📨 Configuration du transporteur email');
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: process.env.SMTP_PORT, // Utiliser le port défini dans .env
  secure: process.env.SMTP_PORT === '465', // Utiliser SSL si le port est 465, sinon utiliser STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    // Accepter les certificats auto-signés en dev local
    rejectUnauthorized: false
  }
});

    // Options de l'email
    const mailOptions = {
      from: `"Formulaire de Contact" <${process.env.SMTP_USER}>`,
      to: process.env.EMAIL_RECIPIENT,
      subject: `Nouveau message de contact de ${name.trim()}`,
      html: `
        <html>
          <head>
            <style>
              body {
                background-color: #081f53;
                padding: 20px;
                font-family: Arial, sans-serif;
              }
              .container {
                background-color: #ffffff;
                padding: 30px;
                border-radius: 5px;
                color: #081f53; 
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              h1 {
                color: #081f53;
                text-align: center;
                margin-bottom: 30px;
                font-size: 24px;
              }
              p {
                color: #081f53;
                font-size: 18px;
                margin-bottom: 10px;
              }
              .message {
                color: #ffffff;
                background-color: #667dda;
                padding: 20px;
                border-radius: 5px;
                font-size: 18px;
                margin-top: 30px;
              }
              .button {
                display: inline-block;
                padding: 15px 30px;
                background-color: #b4b4e8;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-size: 18px;
                font-weight: bold;
                text-transform: uppercase;
                transition: all 0.3s ease;  
                margin-top: 30px;
              }
              .button:hover {
                background-color: #667dda;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Nouveau message de contact</h1>
              <p><strong>Nom:</strong> ${name.trim()}</p>  
              <p><strong>Email:</strong> ${email}</p>
              <p class="message"><strong>Message:</strong><br>${message}</p>
              <div style="text-align: center;">
                <a href="http://localhost:3000" class="button">Visiter le site</a>
              </div>
            </div>
          </body>
        </html>
      `
    };

    // Envoi de l'email
    console.log('✉️ Tentative d\'envoi de l\'email');
    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email envoyé avec succès:', info);

    res.status(200).json({
      message: 'Message envoyé avec succès',
      details: info
    });
  } catch (error) {
    console.error('❌ ERREUR GLOBALE DÉTAILLÉE:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });

    res.status(500).json({
      message: 'Erreur lors du traitement de la demande',
      errorDetails: error.message,
      errorName: error.name
    });
  }
};

module.exports = { sendContactEmail };