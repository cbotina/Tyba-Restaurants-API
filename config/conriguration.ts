export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.NODE_ENV === 'dev',
  },
  googlePlaces: {
    apiKey: process.env.GOOGLE_PLACES_API_KEY,
    apiUrl: process.env.GOOGLE_PLACES_API_URL,
  },
  jwtSecret: process.env.JWT_SECRET,
  mongoose: {
    uri: process.env.MONGO_DB_URI,
  },
});
