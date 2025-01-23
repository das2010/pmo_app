import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import SectorsList from './components/SectorsList';
import ProfilesList from './components/ProfilesList'; // Nuevo componente
import ResourcesList from './components/ResourcesList';
import ClientsList from './components/ClientsList';
import ServicesList from './components/ServicesList';
import PermissionGroupsList from './components/PermissionGroupsList';
import UsersList from './components/UsersList';


function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sectors" element={<SectorsList />} />
            <Route path="/profiles" element={<ProfilesList />} /> {/* NUEVO */}
			<Route path="/resources" element={<ResourcesList />} />
			<Route path="/clients" element={<ClientsList />} />
			<Route path="/services" element={<ServicesList />} />
			<Route path="/system-admin/permission-groups" element={<PermissionGroupsList />} />
			<Route path="/system-admin/users" element={<UsersList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
