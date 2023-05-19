import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
  host: 'localhost',
  port: 5433,
  dialect: 'postgres',
});

// Connection ч-з Client от pg
// import pkg from 'pg';
// const { Client } = pkg;

// export const client = new Client({
//   host: 'localhost',
//   user: 'postgres',
//   password: 'postgres',
//   port: 5433,
// });

// await client.connect();
