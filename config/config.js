module.exports = {
  development: {
    username: "Ben",
    password: "postgres",
    database: "pair_project_ecommerce",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    url: process.env.DATABASE_PRODUCTION,
    dialect: "postgres",
  },
};
