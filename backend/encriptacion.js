const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(express.json());

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Ruta para iniciar sesión
app.post('/Users', async (req, res) => {
    const { correo_electronico, contrasena } = req.body;

    try {
        // Obtener el usuario de la API externa
        const response = await axios.post('http://localhost:5000/Users', { correo_electronico });

        const user = response.data;

        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Comparar la contraseña proporcionada con la almacenada
        const isMatch = await bcrypt.compare(contrasena, user.contrasena);

        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generar un token JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });

        // Enviar la respuesta sin la contraseña
        res.json({
            user: {
                id: user._id,
                nombres: user.nombres,
                rol: user.rol,
                estado: user.estado,
            },
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Iniciar el servidor con Express
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor API escuchando en http://localhost:${PORT}`);
});
