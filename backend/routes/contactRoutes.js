const express = require('express'); 
const router = express.Router(); 
const { sendContactEmail } = require('../controllers/contactController');  

// Ajoutez un middleware de log 
router.post('/', (req, res, next) => {   
  console.log('Route de contact atteinte. Données reçues:', req.body);   
  next(); 
}, sendContactEmail);  

module.exports = router;