const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configurer Nodemailer pour envoyer des emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Route pour envoyer le message de contact
router.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  // Vérifier que les champs sont remplis
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  // Configurer le contenu de l'email
  const mailOptions = {
    from: email,
    to: process.env.EMAIL_RECEIVER,
    subject: `Nouveau message de contact de ${name}`,
    text: message
  };

  // Envoyer l'email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email.' });
    } else {
      console.log('Email envoyé avec succès:', info.response);
      return res.status(200).json({ message: 'Message envoyé avec succès !' });
    }
  });
});

module.exports = router;
