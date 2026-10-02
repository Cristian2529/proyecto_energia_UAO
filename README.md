# ⚡ Sistema Web para el Análisis y Visualización del Consumo de Energía Eléctrica

[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Data%20Cleaner-Python%20%2F%20Pandas-blue.svg)](https://pandas.pydata.org/)
[![Nginx](https://img.shields.io/badge/Frontend%20Server-Nginx-brightgreen.svg)](https://nginx.org/)
[![Database](https://img.shields.io/badge/Database-SQLite%20%2F%20PostgreSQL-blue.svg)](https://sqlite.org/)
[![Architecture](https://img.shields.io/badge/Architecture-Microservices%20%2F%20REST%20API-orange.svg)](#5-arquitectura-de-microservicios)

---

## 📌 1. Problemática
El consumo de energía eléctrica genera grandes cantidades de datos que resultan difíciles de analizar e interpretar cuando se encuentran almacenados únicamente en tablas o archivos de datos raw. 

Las personas encargadas de supervisar el consumo carecen de herramientas que les permitan identificar fácilmente patrones, comparar periodos y detectar comportamientos inusuales o consumos elevados.

---

## 🎯 2. Objetivo General
Desarrollar una aplicación web para la consulta, análisis y visualización de datos de consumo de energía eléctrica mediante **dashboards interactivos**, utilizando una arquitectura basada en **microservicios** y **APIs REST**.

### Objetivos Específicos
* Seleccionar y preparar un dataset existente (*UCI Machine Learning Repository*).
* Diseñar e implementar una arquitectura distribuida basada en microservicios.
* Desarrollar APIs REST para la gestión de usuarios, consumo de datos y estadísticas.
* Crear un frontend dinámico con soporte para gráficos interactivos (Chart.js).
* Implementar mecanismos de seguridad y autenticación basados en roles (Admin / Usuario).
* Desplegar el sistema en una arquitectura distribuida de dos servidores independientes (Frontend y Backend).
* Configurar el acceso cliente mediante resolución de nombres de dominio local.

---

## 📊 3. Dataset Seleccionado
Se utilizó el dataset **Individual Household Electric Power Consumption** del *UCI Machine Learning Repository*. Contiene mediciones de consumo eléctrico de una vivienda en Sceaux, Francia (2006 - 2010), registradas cada minuto.

| Variable | Descripción | Unidad |
| :--- | :--- | :---: |
| `Date` | Fecha de la medición (dd/mm/yyyy) | - |
| `Time` | Hora de la medición (hh:mm:ss) | - |
| `Global_active_power` | Potencia activa global | kW |
| `Global_reactive_power` | Potencia reactiva global | kW |
| `Voltage` | Voltaje promedio | V |
| `Global_intensity` | Intensidad de corriente | A |
| `Sub_metering_1` | Consumo en área de cocina | Wh |
| `Sub_metering_2` | Consumo en área de lavandería | Wh |
| `Sub_metering_3` | Consumo en calentador de agua y aire acondicionado | Wh |

> **Procesamiento de datos:** El dataset original cuenta con un ~1.25% de valores faltantes (`?`), los cuales son filtrados y saneados mediante un script de limpieza en Python (`data_cleaner.py` con Pandas).

---

## 🏗 4. Arquitectura de Microservicios

```text
                 ┌─────────────────┐
                 │    FRONTEND     │
                 │    Dashboard    │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │   API GATEWAY   │
                 └────────┬────────┘
                          │
          ┌───────────────┼────────────────┐
          │               │                │
          ▼               ▼                ▼
   ┌────────────┐  ┌────────────┐  ┌──────────────┐
   │  Usuarios  │  │  Consumo   │  │ Estadísticas │
   │  Service   │  │  Service   │  │   Service    │
   └────────────┘  └────────────┘  └──────────────┘
          │               │                │
          └───────────────┼────────────────┘
                          ▼
                  ┌──────────────┐
                  │  BASE DATOS  │
                  └──────────────┘
```

---

## 🖥 5. Topología de Servidores y Despliegue

La aplicación se encuentra completamente desacoplada y desplegada en dos entornos de servidor basados en **Ubuntu Server**:

| Componente | Servidor / Entorno | IP Asignada | Software / Tecnologías |
| :--- | :--- | :---: | :--- |
| **Frontend** | Servidor 1 (Ubuntu Server) | `192.168.18.10` | Nginx, HTML5, CSS3, JavaScript (ES6+), Chart.js |
| **Backend** | Servidor 2 (Ubuntu Server) | `192.168.18.11` | Node.js, Express, SQLite / PostgreSQL, JWT |
| **Cliente** | Estación Windows | Dinámica | Navegador Web, Archivo Hosts (`energia-dashboard.local`) |

### Flujo de Acceso
```text
Cliente Windows  ───>  energia-dashboard.local  ───>  Servidor Frontend (Nginx:80)
                                                                │
                                                            API REST
                                                                ▼
                                                      Servidor Backend (Node:3000)
                                                                │
                                                                ▼
                                                           Base de Datos
```

---

## 👤 6. Tipos de Usuarios y Roles

| Función | Administrador (`ADMIN`) | Usuario Estándar (`USER`) |
| :--- | :---: | :---: |
| Autenticación mediante credenciales / JWT | ✅ | ✅ |
| Consulta e interacción con Dashboard general | ✅ | ✅ |
| Filtrado de datos por fecha o periodos | ✅ | ✅ |
| Visualización de métricas (Potencia, Voltaje, Intensidad) | ✅ | ✅ |
| Consulta de estadísticas avanzadas de consumo | ✅ | ❌ |
| Gestión de usuarios del sistema | ✅ | ❌ |

---

## 📋 7. Requerimientos Cumplidos

### Functional Requirements (RF)
* **RF01/RF02:** Inicio de sesión con autenticación y detección automática de rol de usuario.
* **RF03/RF04:** Consulta y navegación por los registros de consumo energético.
* **RF05/RF07:** Renderizado de dashboards interactivos mediante gráficos temporales.
* **RF08/RF09:** Cálculo y visualización de promedios, valores máximos e historial de consumo.
* **RF10:** Comunicación cliente-servidor exclusivamente mediante APIs REST.
* **RF11:** Gestión administrativa de cuentas de usuario.

### Non-Functional Requirements (RNF)
* **RNF01/RNF05:** Acceso multi-plataforma mediante navegadores web desde clientes Windows.
* **RNF02:** Despliegue independiente del Frontend y Backend en servidores físicos/virtuales separados.
* **RNF03:** Arquitectura orientada a microservicios desacoplados mediante JSON/REST APIs.
* **RNF04:** Almacenamiento persisitente y relacional para usuarios y telemetría de consumo.
* **RNF06:** Mapeo de DNS para resolución mediante el dominio `http://energia-dashboard.local`.
* **RNF07:** Seguridad mediante cifrado de contraseñas (Bcrypt) y tokens de sesión.

---

## 🚀 8. Estructura del Proyecto

```text
proyecto_energia_UAO/
├── backend/
│   ├── data_cleaner.py       # Script Python para limpieza del dataset UCI
│   ├── database.js           # Inicializador de BD y carga masiva
│   ├── server.js             # API REST (Auth, Consumo, Estadísticas)
│   └── package.json          # Dependencias Node.js
├── dataset/
│   └── household_power_consumption.txt # Dataset original raw
└── frontend/
    └── index.html            # Dashboard Web (HTML/JS/Chart.js)
```

---

## 🛠 9. Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/proyecto_energia_UAO.git
   cd proyecto_energia_UAO
   ```

2. **Limpiar datos con Python:**
   ```bash
   cd backend
   python data_cleaner.py
   ```

3. **Iniciar el servidor Backend:**
   ```bash
   npm install
   node server.js
   ```

4. **Abrir el Frontend:**
   Servir la carpeta `frontend/` mediante Nginx, Live Server o abrir `index.html` en el navegador. Acceder con credenciales por defecto:
   * **Admin:** `admin` / `admin123`
   * **Usuario:** `usuario` / `user123`