import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {

  // Estado local para mostrar u ocultar el submenú
  const [showSystemAdminSubmenu, setShowSystemAdminSubmenu] = useState(false);

  // Función que alterna el estado
  const toggleSystemAdmin = () => {
    setShowSystemAdminSubmenu(!showSystemAdminSubmenu);
  };	
	
  return (
    <div style={{
      width: '200px',
      backgroundColor: '#f4f4f4',
      padding: '20px',
      minHeight: '100vh'
    }}>
      <h2>PMO-App</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/sectors">Administrar Sectores</Link>
        </li>
        <li>
          <Link to="/profiles">Administrar Perfiles</Link> {/* NUEVO */}
        </li>
		<li>
		  <Link to="/resources">Administrar Recursos</Link>
		</li>
		<li>
		  <Link to="/clients">Administrar Clientes</Link>
		</li>
		<li>
		  <Link to="/services">Administrar Servicios</Link>
		</li>
		<li>
		  <div>Administración del Sistema</div>
		  <ul>
			<li>
			  <Link to="/system-admin/permission-groups">Grupos de Permisos</Link>
			</li>
			<li>
			  <Link to="/system-admin/users">Usuarios</Link>
			</li>
		  </ul>
		</li>		
      </ul>
    </div>
  );
}

export default Sidebar;
