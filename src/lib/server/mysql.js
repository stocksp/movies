// @ts-nocheck
import mysql2 from 'mysql2/promise';
import { MYSQLPW, MYSQLUSER, MYSQLHOST } from '$env/static/private';

export const pool = mysql2.createPool({
  host: MYSQLHOST,
  user: MYSQLUSER,
  database: 'videos',
  password: MYSQLPW,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});