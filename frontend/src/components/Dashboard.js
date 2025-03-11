import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        const response = await fetch(`http://localhost:3001/api/users/${storedUser.id}`);
        const userData = await response.json();
        setUser(userData);
      }
    };
    fetchUser();
  }, []);

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleDeleteAccount = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    await fetch(`http://localhost:3001/api/users/${storedUser.id}`, {
      method: 'DELETE'
    });
    localStorage.removeItem('user');
    navigate('/signup');
  };

  return (
    <div className="dashboard-container">
      <h1>Tableau de Bord</h1>
      {user && (
        <div className="profile-card">
          <h2>Mon Profil</h2>
          <p><strong>Nom:</strong> {user.nom}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button onClick={handleEditProfile} className="animated-button">Modifier le Profil</button>
          <button onClick={handleDeleteAccount} className="animated-button">Supprimer le Compte</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
