# Sistema de Gestión de Usuarios

## Descripción General

Este proyecto es un sistema de gestión de usuarios con autenticación, manejo de roles (administrador y cliente) y capacidad para almacenar información personal junto con la carga de documentos (fotografía, currículum vitae y recibos de servicios).

La aplicación está construida con una arquitectura cliente-servidor:
- **Backend**: API RESTful desarrollada con Node.js, Express y MongoDB
- **Frontend**: Aplicación SPA (Single Page Application) desarrollada con Vue.js 3

## Estructura del Proyecto

El proyecto está organizado en dos directorios principales:

```
crud/
├── backend/         # Servidor API REST
└── frontend/        # Aplicación cliente Vue.js
```

### Estructura del Backend

```
backend/
├── package.json     # Dependencias y scripts
├── src/
│   ├── index.js     # Punto de entrada de la aplicación
│   ├── config/      # Configuraciones (base de datos, variables de entorno)
│   ├── controllers/ # Controladores para las operaciones CRUD
│   │   ├── auth.controller.js    # Lógica de autenticación
│   │   ├── file.controller.js    # Gestión de archivos
│   │   └── user.controller.js    # Operaciones CRUD de usuarios
│   ├── middleware/  # Middlewares para autenticación y manejo de errores
│   │   └── auth.middleware.js    # Verificación de token JWT
│   ├── models/      # Modelos de datos (esquemas Mongoose)
│   │   └── user.model.js         # Esquema de usuario
│   ├── routes/      # Definición de rutas API
│   │   ├── auth.routes.js        # Rutas de autenticación
│   │   ├── file.routes.js        # Rutas para gestión de archivos
│   │   └── user.routes.js        # Rutas para gestión de usuarios
│   ├── uploads/     # Carpeta donde se almacenan los archivos subidos
│   │   ├── bills/   # Recibos de servicios
│   │   ├── cv/      # Currículums vitae
│   │   └── photos/  # Fotografías de perfil
│   └── utils/       # Utilidades y funciones helper
```

### Estructura del Frontend

```
frontend/
├── package.json     # Dependencias y scripts
├── public/          # Archivos públicos estáticos
│   └── index.html   # Plantilla HTML principal
├── src/
│   ├── App.vue      # Componente raíz
│   ├── main.js      # Punto de entrada de la aplicación
│   ├── assets/      # Recursos estáticos (imágenes, estilos)
│   │   └── main.css # Estilos globales
│   ├── components/  # Componentes reutilizables
│   ├── router/      # Configuración de rutas
│   │   └── index.js # Definición de rutas
│   ├── store/       # Estado global (Vuex)
│   │   └── index.js # Configuración del store
│   └── views/       # Componentes de página
│       ├── AdminPanel.vue  # Panel de administración
│       ├── Home.vue        # Página principal
│       ├── Login.vue       # Inicio de sesión
│       ├── NotFound.vue    # Página 404
│       ├── Profile.vue     # Perfil de usuario
│       └── Register.vue    # Registro de usuario
```

## Modelos de Datos

### Usuario (User)

El modelo de usuario incluye la siguiente información:

- **name**: Nombre del usuario (obligatorio)
- **email**: Correo electrónico (obligatorio, único)
- **password**: Contraseña encriptada (obligatorio)
- **age**: Edad (obligatorio)
- **city**: Ciudad (obligatorio)
- **gender**: Sexo, opciones: 'masculino', 'femenino', 'otro' (obligatorio)
- **role**: Rol, opciones: 'admin', 'cliente' (por defecto: 'cliente')
- **photo**: Ruta a la fotografía del usuario
- **cv**: Ruta al currículum vitae
- **bill**: Ruta al recibo de servicio
- **createdAt**: Fecha de creación

## Roles y Permisos

El sistema maneja dos tipos de roles:

### Administrador (admin)
- Puede ver la lista de todos los usuarios
- Puede eliminar usuarios
- Tiene acceso al panel de administración
- Puede gestionar su propio perfil

### Cliente (cliente)
- Puede gestionar su propio perfil
- Puede subir y actualizar sus documentos
- No tiene acceso al panel de administración

## Funcionalidades Principales

### Autenticación
- Registro de usuario
- Inicio de sesión
- Cierre de sesión
- Autenticación basada en JWT (JSON Web Token)

### Gestión de Perfil
- Actualización de información personal
- Cambio de fotografía de perfil
- Subida de currículum vitae
- Subida de recibo de servicio

### Administración (solo rol admin)
- Listado de todos los usuarios
- Visualización de documentos subidos por usuarios
- Eliminación de usuarios

## Subida de Archivos

El sistema permite la carga de tres tipos de documentos con las siguientes restricciones:

### Fotografía
- **Formatos permitidos**: JPG, PNG, GIF y cualquier formato de imagen
- **Tamaño máximo**: 5MB

### Currículum Vitae
- **Formatos permitidos**: PDF, DOC, DOCX
- **Tamaño máximo**: 5MB

### Recibo de Teléfono/Luz
- **Formatos permitidos**: PDF, JPG, PNG y cualquier formato de imagen
- **Tamaño máximo**: 5MB

## Configuración e Instalación

### Requisitos Previos
- Node.js (v12 o superior)
- MongoDB (v4 o superior)
- npm (v6 o superior)

### Instalación

1. Instalar dependencias (desde la carpeta raíz del proyecto):
   ```
   npm run setup
   ```
   Este comando instalará todas las dependencias necesarias tanto para el backend como para el frontend.

### Inicio del Proyecto

Para iniciar tanto el backend como el frontend simultáneamente:
   ```
   npm run dev
   ```

Con este único comando:
- El backend se iniciará en `http://localhost:5000`
- El frontend se iniciará en `http://localhost:8080`

> **Nota:** No es necesario iniciar el backend y el frontend por separado, ya que el proyecto está configurado para ejecutar ambos con un solo comando.
