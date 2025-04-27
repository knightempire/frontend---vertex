import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import SignupPage from './components/SignupPage';
import ForgotPassword from './components/ForgotPassword';
import Cards from './components/Cards';
import PasswordSettings from './components/PasswordSettings';

import AdminDashboard from './admin/AdminDashboard';
import UsersPage from './admin/UsersPage';
import ProductsPage from './admin/ProductPage';
import UserRequestsPage from './admin/UserRequestsPage'; // Import the new component
import UserProfile from './admin/UserProfile';
import RedditFeed from './dashboard/RedditFeed';
import Profile from './dashboard/profile';
import ViewProfile from './dashboard/viewprofile';
import ConnectionsPage from './dashboard/Connection';
import Game from './game/game';
import ChatBot from './dashboard/chat'
import Collection from './dashboard/collection';

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  
  // Check if the current path is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/SignupPage" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/password" element={<PasswordSettings />} />+
        <Route path="/feed" element={<RedditFeed />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/viewprofile" element={<ViewProfile />} />
        <Route path="/connections" element={<ConnectionsPage />} />
        <Route path="/game" element={<Game />} />
        <Route path='/collection' element={<Collection />} />


        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<ProductsPage />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/users/profile/:userId" element={<UserProfile />} />
        <Route path="/admin/requests" element={<UserRequestsPage />} /> {/* New route for User Requests */}
      </Routes>
      
      {!isAdminRoute && location.pathname !== '/password' && <ChatBot />}


    </>
  );
};

export default App;