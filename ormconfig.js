module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
  entities: ['build/database/models/**/*.js'],
  migrations: ['build/database/migration/**/*.js'],
  subscribers: ['build/database/subscriber/**/*.js'],
  cli: {
    entitiesDir: 'src/database/models',
    migrationsDir: 'src/database/migration',
    subscribersDir: 'src/database/subscriber',
  },
  extra: {
    max: 25,
    connectionTimeoutMillis: 1000,
  },
};
