export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_jwt_secret', // Fallback value
  },
  database: {
    connectionString:
      process.env.MONGO_URL || 'mongodb://localhost:27017/cowManagement', // Fallback value
  },
});
