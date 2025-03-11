import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EditProfile.css';

const EditProfile = () => {
  const [user, setUser] = useState({ nom: '', email: '' });
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

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('user'));
    await fetch(`http://localhost:3001/api/users/${storedUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
    navigate('/dashboard');
  };

  return (
    <div className="edit-profile-container">
      <h1>Modifier le Profil</h1>
      <form onSubmit={handleUpdateProfile} className="edit-profile-form">
        <label htmlFor="nom">Nom</label>
        <input
          type="text"
          id="nom"
          value={user.nom}
          onChange={(e) => setUser({ ...user, nom: e.target.value })}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          required
        />

        <button type="submit" className="animated-button">Mettre à Jour</button>
      </form>
    </div>
  );
};

export default EditProfile;
