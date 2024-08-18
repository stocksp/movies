// @ts-nocheck
import mysql from 'mysql2/promise';
import { MYSQLPW } from '$env/static/private';

export const mysql = await mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    database: 'videos',
    password: MYSQLPW
  }
);
