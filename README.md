# Tyba Restaurants API

Este repositorio contiene una API REST desarrollada para la prueba técnica de ingreso al equipo de backend de Tyba. La API proporciona funcionalidades de registro de usuarios, autenticación, consulta de restaurantes cercanos, historial de transacciones y gestión de usuarios.

## Tecnologías Utilizadas

- NodeJS
- NestJS
- Base de Datos: PostgreSQL, MongoDB
- Docker y Docker Compose para entorno de desarrollo

## Requisitos

- Google Maps API Key (Obtenerla de https://developers.google.com/maps)

## Instalación y Ejecución Local

1. Clonar este repositorio:

   ```bash
   git clone https://github.com/cbotina/Tyba-Restaurants-API
   ```

2. Navegar a la raiz del proyecto y ejecutar el comando (Para producción reemplazar docker-compose.yml por docker-compose.prod.yml)

   ```bash
   docker-compose -f docker-compose.yml up --build

   ```

3. Crear un archivo '.env.development.local' (desarrollo) o '.env' (producción) e incluir las siguientes variables

   ```bash

   PORT=
   DB_USERNAME=
   DB_PASSWORD=
   DB_HOST=
   DB_NAME=
   DB_PORT=
   MONGO_DB_URI=
   JWT_SECRET=
   GOOGLE_PLACES_API_KEY=
   GOOGLE_PLACES_API_URL=
   ADMIN_EMAIL=
   ADMIN_PASSWORD=
   ADMIN_FIRST_NAME=
   ADMIN_LAST_NAME=

   `
   ```

   > Nota: `GOOGLE_PLACES_API_URL` puede variar dependiendo de la version. Para este proyecto se utilizó la url https://places.googleapis.com/v1/places

## Endpoints

### Autenticación

#### POST/auth/login

- Body:

```json
{
  "email": "email@example.com",
  "password": "yourPassword123!"
}
```

- Response (200)

```json
{
  "token": "your_token"
}
```

#### POST /auth/register

- Body:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "password": "yourPassword123!",
  "email": "email@example.com"
}
```

- Response (200)

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "email@example.com",
  "id": "f38901be-9ba1-412f-88a0-8f21b763ccb9",
  "role": "customer"
}
```

### Restaurantes

#### GET /restaurants

- Body:

```json
{
  "maxResultCount": 15, // numero de resultados
  "coordinates": {
    "latitude": 1,
    "longitude": 1
  }, // ubicacion de busqueda
  "radius": 500 // radio (metros) de busqueda
}
```

- Response (200)

```json
[
  {
    "id": "uuid",
    "name": "Restaurante 1",
    "address": "Direccion 1",
    "location": {
      "latitude": 1,
      "longitude": 1
    }
  },
  {
    "id": "uuid",
    "name": "Restaurante 2",
    "address": "Direccion 2",
    "location": {
      "latitude": 1,
      "longitude": 1
    }
  },
  {
    "id": "uuid",
    "name": "Restaurante 3",
    "address": "Direccion 3",
    "location": {
      "latitude": 1,
      "longitude": 1
    }
  }
]
```

### Usuarios

#### GET /users/

```json
[
  {
    "id": "uuid",
    "firstName": "Alice",
    "lastName": "Doe",
    "email": "alice@gmail.com",
    "role": "customer"
  },
  {
    "id": "uuid",
    "firstName": "Bob",
    "lastName": "Doe",
    "email": "bob@gmail.com",
    "role": "admin"
  }
  // Otros usuarios...
]
```

### Historial de transacciones

#### GET /logs/

```json
[
  {
    "_id": "uuid",
    "method": "GET",
    "url": "/restaurants",
    "userId": "uuid",
    "origin": "origin",
    "body": {
      "maxResultCount": 3,
      "coordinates": {
        "latitude": 1,
        "longitude": 1
      },
      "radius": 500
    },
    "timestamp": "2024-07-07T04:18:33.005Z",
    "__v": 0
  }
  // Otras busquedas realizadas por los usuarios
]
```

#### GET /users/:userId/logs/

```json
[
  {
    "_id": "uuid",
    "body": {
      "maxResultCount": 5,
      "coordinates": {
        "latitude": 1,
        "longitude": 1
      },
      "radius": 100
    },
    "timestamp": "2024-07-07T02:05:19.922Z",
    "__v": 0
  }

  // Otras busquedas realizadas por un usuario en particular
]
```
