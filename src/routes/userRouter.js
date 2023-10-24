const express = require('express');
const userRouter = express.Router();
const jwt = require("jsonwebtoken");

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();


userRouter.use(express.json()); // Configuración para analizar el cuerpo en formato JSON

userRouter.get('/', (req, res) => {
    res.send('user');
});

userRouter.get('/getusers', async (req, res) => {
    try {
        const users = await prisma.userBicyrent.findMany();
        res.status(200).json({ data: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

userRouter.post('/signup', async (req, res) => {
    try {
        const { email } = req.body;

        // Verificar si el correo electrónico ya existe en la base de datos
        const existingUser = await prisma.userBicyrent.findUnique({ where: { email } });

        if (existingUser) {
            // El correo electrónico ya existe, así que no se puede crear el usuario.
            return res
                .status(400)
                .json({ error: 'El correo electrónico ya está registrado.' });
        }

        // Si el correo electrónico no existe, crea el nuevo usuario.
        const newUser = await prisma.userBicyrent.create( { data:  req.body } );

        const user = req.user;
        // Genera un JWT con la información del usuario del auth
        const token = jwt.sign({ user }, process.env.JWT_SECRET);
      
        res.status(200).json(token);

        res.status(200).json({ msg: 'Usuario creado', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
});

userRouter.post('/login', async (req, res) => {
    try {
        const userLogging = await prisma.userBicyrent.findUnique
        ({
            where: { email: req.body.email },
        });

        if (userLogging) {
            const isPasswordCorrect =
                req.body.password === userLogging.password;

            if (isPasswordCorrect) {
                 
                // JWT
                const payload = userLogging
                const token = jwt.sign(payload, process.env.JWT_SECRET);

                console.log(payload);
                return res.status(200).json({ token });

                //return res.status(200).json({ msg: 'Inicio de sesión exitoso' });
            }

            return res.status(401).json({ msg: 'Contraseña incorrecta' });
        } else {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

module.exports = userRouter;
