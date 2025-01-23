// frontend/src/components/UsersList.js
import React, { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/userService';
import { getGroups } from '../services/permissionGroupService';

function UsersList() {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [groupId, setGroupId] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchAllGroups();
  }, []);

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const fetchAllGroups = async () => {
    const data = await getGroups();
    setGroups(data);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setUsername('');
    setPassword('');
    setGroupId('');
    setShowForm(true);
  };

  const handleEdit = (usr) => {
    setSelectedUser(usr);
    setUsername(usr.username);
    setPassword(''); // no mostramos el pass actual
    setGroupId(usr.group_id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este usuario?')) {
      await deleteUser(id);
      fetchUsers();
    }
  };

  const handleSave = async () => {
    if (!username || !groupId) return;
    if (selectedUser) {
      // update
      await updateUser(selectedUser.id, {
        username,
        password: password || undefined, // si no se cambia
        group_id: Number(groupId),
      });
    } else {
      // create
      if (!password) {
        alert('La contraseña es obligatoria en un usuario nuevo');
        return;
      }
      await createUser({
        username,
        password,
        group_id: Number(groupId),
      });
    }
    setShowForm(false);
    setSelectedUser(null);
    fetchUsers();
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedUser(null);
  };

  return (
    <div>
      <h2>Usuarios</h2>
      {!showForm && (
        <button onClick={handleCreate}>Crear Usuario</button>
      )}

      {showForm ? (
        <div style={{ marginTop: '10px' }}>
          <label>Username:</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label style={{ marginLeft: '10px' }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label style={{ marginLeft: '10px' }}>Grupo:</label>
          <select
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
          >
            <option value="">-- Seleccionar --</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          <button onClick={handleSave} style={{ marginLeft: '10px' }}>Guardar</button>
          <button onClick={handleCancel}>Cancelar</button>
        </div>
      ) : (
        <table border="1" cellPadding="5" style={{ marginTop: '10px' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Grupo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.group_name}</td>
                <td>
                  <button onClick={() => handleEdit(u)}>Editar</button>
                  <button onClick={() => handleDelete(u.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UsersList;
