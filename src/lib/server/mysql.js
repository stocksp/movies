// @ts-nocheck
import mysql from 'mysql2/promise';
import { MYSQLPW } from '$env/static/private';

export const mysql = await mysql.createConnection(
  {
    host: '5.78.117.222',
    user: 'cap',
    database: 'videos',
    password: MYSQLPW
  }
);
