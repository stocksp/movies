// @ts-nocheck
import mysql2 from 'mysql2/promise';
import { MYSQLPW } from '$env/static/private';

  {

export const pool = mysql2.createPool({
  host: 'localhost',
  user: 'cap',
  database: 'videos',
  password: MYSQLPW,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
    host: '5.78.117.222',