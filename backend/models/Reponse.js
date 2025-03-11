const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reponse = sequelize.define('Reponse', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  question_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Questions',
      key: 'id'
    }
  },
  utilisateur_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Utilisateurs',
      key: 'id'
    }
  },
  texte_reponse: {
    type: DataTypes.STRING
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false
});

module.exports = Reponse;
