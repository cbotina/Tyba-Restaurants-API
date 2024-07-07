# Tyba Restaurants API

Este repositorio contiene una API REST desarrollada para la prueba técnica de ingreso al equipo de backend de Tyba. La API proporciona funcionalidades de registro de usuarios e inicio de sesión. Para usuarios autenticados, se permite consultar los restaurantes cercanos a una ubicación en específico (Definida por coordenadas y un radio de búsqueda), historial de transacciones realizadas (En este contexto se consideró 'transacciones' a las peticiones históricas realizadas al endpoint de restaurantes) y gestión de usuarios.

Se manejó un RBAC (Control de acceso basado en Roles) para la autorización en los endpoints a lo largo de la aplicación. El rol de cada usuario puede ser `customer` o `admin`. Al ejecutar el proyecto, se crea automáticamente un usuario `admin` por defecto, cuyas credenciales se especifican en el archivo `.env` proporcionado.

En ese contexto, se implementaron las siguientes reglas

- El usuario `admin` puede acceder a todos los endpoints y recursos, consultar la lista completa de usuarios, consultar transacciones historicas de todos los usuarios y de transacciones historicas de un usuario en particular

- El usuario `customer` puede acceder al endpoint de búsqueda de restaurantes

- El usuario `customer` puede consultar sus busquedas historicas

- El usuario `customer` **no** puede consultar busquedas historicas de otros usuarios

Adicionalmente, se utilizo docker-compose para empaquetar el proyecto en modo de desarrollo y producción

## Tecnologías Utilizadas

- NodeJS
- NestJS
- Base de Datos: PostgreSQL (Almacenamiento de usuarios), MongoDB (Almacenamiento de transacciones)
- Autenticación: Json Web Token (JWT)
- Docker y docker-compose para entorno de desarrollo

## Requisitos

- Google Maps API Key (Obtenerla de https://developers.google.com/maps)

## Instalación y Ejecución Local

1. Clonar este repositorio:

   ```bash
   git clone https://github.com/cbotina/Tyba-Restaurants-API
   ```

2. Navegar a la raiz del proyecto y ejecutar el siguiente comando

   ```bash
   docker-compose -f docker-compose.yml up --build

   ```

   (Para producción reemplazar docker-compose.yml por docker-compose.prod.yml)

3. Crear un archivo '.env.development.local' e incluir las siguientes variables

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
   ```

   (Para producción el archivo se debe llamar '.env')

   > Nota: `GOOGLE_PLACES_API_URL` puede variar dependiendo de la version. Para este proyecto se utilizó la url https://places.googleapis.com/v1/places

## Endpoints

### Autenticación

#### POST /auth/register

Endpoint público. Utilizar para registrar usuarios. Por defecto estos usuarios tendrán el rol de `customer`.

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

#### POST/auth/login

Utilizar este enpoint para inicio de sesión de usuario. Se retornará un JWT que se utilizará para autenticación en los siguientes endpoints

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

### Restaurantes

#### GET /restaurants

Endpoint para consultar los restaurantes cercanos a una ubicación definida por coordenadas y un radio de búsqueda. Los resultados de la API de Google son mapeados a la clase `IRestaurant`

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

Endpoint disponible únicamente para usuarios `admin`. Retorna una lista de todos los usuarios registrados.

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

Endpoint disponible únicamente para usuarios `admin`. Retorna una lista de todas las transacciones realizadas históricamente, incluyendo detalles como el método, url, origen, body y fecha de la transacción.

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

Endpoint para consultar las transacciones históricas de un usuario, donde [userId] es el id del usuario. Usuarios con rol de `customer` pueden consultar sus propio historial de transacciones, pero no pueden consultar el historial de transacciones de otros usuarios. Nótese que en este endpoint se omiten algunas propiedades de cada transacción.

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

## Pruebas automatizadas

Para correr las pruebas, ejecutar el comando

```bash
npm run test
```
