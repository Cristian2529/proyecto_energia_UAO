const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./database');

const app = express();
const SECRET_KEY = 'clave_secreta_jwt';

app.use(cors());
app.use(express.json());

// --- MICROSERVICIO 1: USUARIOS & AUTENTICACIÓN ---
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM usuarios WHERE username = ?", [username], (err, user) => {
        if (err || !user) return res.status(401).json({ error: 'Usuario no encontrado' });

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) return res.status(401).json({ error: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '2h' });
        res.json({ token, role: user.role, username: user.username });
    });
});

// --- MICROSERVICIO 2: CONSUMO ---
app.get('/api/consumo', (req, res) => {
    const limit = req.query.limit || 50;
    db.all("SELECT * FROM consumo LIMIT ?", [limit], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// --- MICROSERVICIO 3: ESTADÍSTICAS ---
app.get('/api/estadisticas/resumen', (req, res) => {
    const sql = `
        SELECT 
            AVG(global_active_power) as promedio_potencia,
            MAX(global_active_power) as max_potencia,
            MIN(global_active_power) as min_potencia,
            AVG(voltage) as promedio_voltaje
        FROM consumo
    `;
    db.get(sql, [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
});

app.listen(3000, () => {
    console.log('Backend escuchando en http://localhost:3000');
});
