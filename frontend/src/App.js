import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './views/Signup';
import Login from './views/Login';
import Home from './views/Home';
import Contact from './views/Contact';
import MentionsLegales from './views/MentionsLegales';
import UserProfile from './views/UserProfile';
import Dashboard from './views/Dashboard';
import PolitiqueConfidentialite from './views/PolitiqueConfidentialite';
import ConditionsUtilisation from './views/ConditionsUtilisation';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute'; // Nous allons créer ce composant
import TasksPage from './views/TasksPage';
import TaskForm from './views/TaskForm'; // À créer
import TaskDetails from './views/TaskDetails';

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
          <Route path="/conditions-utilisation" element={<ConditionsUtilisation />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/tasks" element={<TasksPage />} />
  <Route path="/tasks/new" element={<TaskForm />} />
  <Route path="/tasks/edit/:id" element={<TaskForm />} />
  <Route path="/tasks/:id" element={<TaskDetails />} />
          
          {/* Utiliser un composant pour protéger la route */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;