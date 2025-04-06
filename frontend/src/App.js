


// import React from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import Signup from './views/Signup';
// import Login from './views/Login';
// import Home from './views/Home';
// import Contact from './views/Contact';
// import MentionsLegales from './views/MentionsLegales';
// import Dashboard from './views/Dashboard';
// import PolitiqueConfidentialite from './views/PolitiqueConfidentialite';
// import ConditionsUtilisation from './views/ConditionsUtilisation';
// import Header from './components/Header';
// import Footer from './components/Footer';
// import ProtectedRoute from './components/ProtectedRoute';
// import TasksPage from './views/TasksPage';
// import TaskForm from './views/TaskForm';
// import TaskDetailView from './views/TaskDetailView';
// import ListsPage from './views/ListsPage';


// const App = () => {
//   return (
//     <Router>
//       <div>
//         <Header />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/home" element={<Home />} />
          
//           {/* Rétablissez la route Contact originale */}
//           <Route path="/contact" element={<Contact />} />
          
//           <Route path="/mentions-legales" element={<MentionsLegales />} />
//           <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
//           <Route path="/conditions-utilisation" element={<ConditionsUtilisation />} />
//           <Route path="/tasks" element={<TasksPage />} />
//           <Route path="/tasks/new" element={<TaskForm />} />
//           <Route path="/tasks/edit/:id" element={<TaskForm />} />
//           <Route path="/lists" element={<ListsPage />} />
//           <Route path="/tasks/:id" element={<TaskDetailView />} />
          
//           {/* Utiliser un composant pour protéger la route */}
//           <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
//           <Route path="*" element={<Navigate to="/login" />} />
//         </Routes>
//         <Footer />
//       </div>
//     </Router>
//   );
// };

// export default App;





//Modification du 05/04/2025


import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './views/Signup';
import Login from './views/Login';
import Home from './views/Home';
import Contact from './views/Contact';
import MentionsLegales from './views/MentionsLegales';
import Dashboard from './views/Dashboard';
import PolitiqueConfidentialite from './views/PolitiqueConfidentialite';
import ConditionsUtilisation from './views/ConditionsUtilisation';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import TasksPage from './views/TasksPage';
import TaskForm from './views/TaskForm';
import TaskDetailView from './views/TaskDetailView';
import ListsPage from './views/ListsPage';
import SessionManager from './utils/SessionManager'; // Importez le SessionManager

const App = () => {
  // Effet pour initialiser le gestionnaire de session
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    
    if (token) {
      // Créer une instance du gestionnaire de session avec un timeout de 30 minutes
      // Pour tester rapidement, vous pouvez réduire à 2 minutes
      const sessionManager = new SessionManager(2);
      sessionManager.init();
      
      // Nettoyage lors du démontage du composant
      return () => {
        sessionManager.cleanup();
      };
    }
  }, []);

  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          
          {/* Rétablissez la route Contact originale */}
          <Route path="/contact" element={<Contact />} />
          
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
          <Route path="/conditions-utilisation" element={<ConditionsUtilisation />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/tasks/new" element={<TaskForm />} />
          <Route path="/tasks/edit/:id" element={<TaskForm />} />
          <Route path="/lists" element={<ListsPage />} />
          <Route path="/tasks/:id" element={<TaskDetailView />} />
          
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