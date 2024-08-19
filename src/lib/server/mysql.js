// @ts-nocheck
import mysql2 from 'mysql2/promise';
import { MYSQLPW } from '$env/static/private';

export const mysql = await mysql2.createConnection(
  {
    host: '5.78.117.222',
    user: 'cap',
    database: 'videos',
    password: MYSQLPW
  }
);
