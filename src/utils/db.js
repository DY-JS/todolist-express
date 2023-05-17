import pkg from 'pg';
const { Client } = pkg;

export const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: 'postgres',
  port: 5433,
});

await client.connect();
