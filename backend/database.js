const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const readline = require('readline');
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./energia.db');

db.serialize(() => {
    // Tabla de usuarios
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT
    )`);

    // Tabla de mediciones de consumo
    db.run(`CREATE TABLE IF NOT EXISTS consumo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        time TEXT,
        global_active_power REAL,
        global_reactive_power REAL,
        voltage REAL,
        global_intensity REAL
    )`);

    // Insertar usuarios iniciales (Admin y Usuario standard)
    const salt = bcrypt.genSaltSync(10);
    const passAdmin = bcrypt.hashSync('admin123', salt);
    const passUser = bcrypt.hashSync('user123', salt);

    db.run(`INSERT OR IGNORE INTO usuarios (username, password, role) VALUES ('admin', '${passAdmin}', 'ADMIN')`);
    db.run(`INSERT OR IGNORE INTO usuarios (username, password, role) VALUES ('usuario', '${passUser}', 'USER')`);

    // Cargar datos del CSV limpio si la tabla está vacía
    db.get("SELECT COUNT(*) AS count FROM consumo", (err, row) => {
        if (row.count === 0) {
            console.log("Cargando datos limpios en la base de datos...");
            const rl = readline.createInterface({
                input: fs.createReadStream('datos_limpios.csv'),
                crlfDelay: Infinity
            });

            let isHeader = true;
            db.run("BEGIN TRANSACTION");
            const stmt = db.prepare(`INSERT INTO consumo (date, time, global_active_power, global_reactive_power, voltage, global_intensity) VALUES (?, ?, ?, ?, ?, ?)`);

            rl.on('line', (line) => {
                if (isHeader) { isHeader = false; return; }
                const parts = line.split(',');
                if (parts.length >= 6) {
                    stmt.run(parts[0], parts[1], parseFloat(parts[2]), parseFloat(parts[3]), parseFloat(parts[4]), parseFloat(parts[5]));
                }
            });

            rl.on('close', () => {
                stmt.finalize();
                db.run("COMMIT");
                console.log("Carga de base de datos finalizada.");
            });
        }
    });
});

module.exports = db;
