// Requiriendo los módulos necesarios
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const cors = require('cors');
const axios = require('axios');
const fs = require('fs'); // Asegúrate de incluir esto
// Creando una nueva aplicación Express.
const app = express();

// Configuración de middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Establecer EJS como el Motor de plantillas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Configuración de CORS para permitir solicitudes desde el puerto 4000
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:4000'], // Puedes restringir esto a 'http://localhost:4000' si prefieres, o para todos:'*'
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Definiendo la ruta Home
app.get("/", (req, res) => {
    res.render("bienvenida");
});

// Configuración de multer para manejar la carga de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "files_emails")); // Ruta donde se guardarán los archivos adjuntos
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });

// Configuración del servicio de correo electrónico
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "jeissuvan@gmail.com",
        pass: "sjfkulqlgqihvwif", // Asegúrate de usar una contraseña de aplicación si usas Gmail
    },
});

// Ruta para procesar el registro de usuario
app.post("/Users", (req, res) => {
    const userData = req.body; // Datos del usuario desde el formulario
    // Aquí puedes agregar la lógica para guardar `userData` en la base de datos

    res.status(201).send("Usuario registrado con éxito");
});

// Ruta para enviar correo de verificación
app.post("/enviar-verificacion", (req, res) => {
    const { correo_electronico, id} = req.body;

    // Generar el enlace de verificación
    const verificationLink = `http://localhost:5000/verificar-correo/${id}`;
    
    const verificationMailOptions = {
        from: "jeissuvan@gmail.com",
        to: correo_electronico,
        subject: "Verificación de correo",
        html: `
            <p>Hola, gracias por registrarte. Por favor verifica tu correo haciendo clic en el siguiente botón:</p>
            <a href="${verificationLink}" style="display:inline-block;padding:10px 20px;font-size:16px;color:#fff;background-color:#007bff;border-radius:5px;text-decoration:none;">Verificar correo</a>
            <p>O puedes copiar y pegar el siguiente enlace en tu navegador:</p>
            <p>${verificationLink}</p>
        `,
    };

    transporter.sendMail(verificationMailOptions, (error, info) => {
        if (error) {
            console.log("Error al enviar el correo de verificación:", error);
            return res.status(500).send("Error al enviar el correo de verificación");
        } else {
            console.log("Correo de verificación enviado:", info.response);
            return res.status(200).send("Correo de verificación enviado");
        }
    });
});

// Ruta que hace una solicitud al API en el puerto 4000
app.get("/Users", async (req, res) => {
    try {
        // Haciendo una solicitud GET al puerto 4000
        const response = await axios.get('http://localhost:4000/Users');
        res.status(200).json(response.data); // Enviar los datos obtenidos al cliente
    } catch (error) {
        console.error('Error al hacer la solicitud al API del puerto 4000:', error);
        res.status(500).send('Error al obtener los datos del API');
    }
});
//verificacion-correo
// Nueva ruta para verificar el correo del usuario
app.get("/verificar-correo/:id", (req, res) => {
    const userId = req.params.id;
    const filePath = path.join(__dirname, 'trabajo.json');

    // Leer el archivo JSON
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send("Error al leer el archivo.");
        }

        // Parsear los datos del archivo JSON
        const usuariosData = JSON.parse(data);
        const usuarios = usuariosData.Users;

        // Buscar el usuario por ID
        const usuarioIndex = usuarios.findIndex(u => u.id === userId);
        
        if (usuarioIndex === -1) {
            return res.status(404).send("Usuario no encontrado.");
        }

        // Cambiar el estado del usuario a 'Activo'
        usuarios[usuarioIndex].estado = "Activo";

        // Guardar los cambios en el archivo JSON
        fs.writeFile(filePath, JSON.stringify(usuariosData, null, 2), (err) => {
            if (err) {
                return res.status(500).send("Error al guardar los cambios.");
            }

            res.send("Correo verificado exitosamente.");
        });
    });
});

// Iniciar el servidor con Express
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor de correos escuchando en http://localhost:${PORT}`);
});
