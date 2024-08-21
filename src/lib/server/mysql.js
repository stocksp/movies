// @ts-nocheck
import mysql2 from 'mysql2/promise';
import { MYSQLPW } from '$env/static/private';

export const mysql = await mysql2.createConnection(
  {
    host: 'localhost',
    user: 'root',
    database: 'videos',
    password: MYSQLPW
  }
);
