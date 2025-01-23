require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sectorRoutes = require('./routes/sectorRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const clientRoutes = require('./routes/clientRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const permissionGroupRoutes = require('./routes/permissionGroupRoutes');
const userRoutes = require('./routes/userRoutes');
const moduleRoutes = require('./routes/moduleRoutes');

// Se debe agregar
const profileRoutes = require('./routes/profileRoutes'); 

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/sectors', sectorRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/resources', resourceRoutes); 
app.use('/api/clients', clientRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/permission-groups', permissionGroupRoutes);
app.use('/api/users', userRoutes);
app.use('/api/modules', moduleRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});