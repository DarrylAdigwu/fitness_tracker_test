import mysql from "mysql2/promise";
import dotenv from "dotenv";
import * as argon2 from "argon2";
import { hashPassword } from "./utils.js";

// Configure .env files
dotenv.config();

// Configure Database
export const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  waitForConnections: true,
  maxIdle: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});


// Register user to database
export async function registerUser(username, password) {
  const hash = await hashPassword(password);
  const register = await db.query(`INSERT INTO users (username, hash)
          VALUES(?, ?)`, [username, hash]);
}

// Get user by ID
export async function getUserByID(id) {
  // SQL query statemt
  let getUserQuery = `SELECT id, username 
          FROM users 
          WHERE id = ?`;
  
  // Parameters to be added to query
  let getUserInsert = [id];
  
  // Format escaped query
  getUserQuery = mysql.format(getUserQuery, getUserInsert);
  
  const [userQuery] = await db.query(getUserQuery);

  return userQuery[0];
}

// Authenticate user login 
export async function authLogin(username, password) {
  let hashResult;
  let findUser;

  // Search for matching username
  try {
    [findUser] = await db.query(
            `SELECT username, hash
            FROM users 
            WHERE username = ?`, 
            [username]
    );
    
  } catch (err) {
    console.error("Error:" , err)
  }

  if(!findUser[0]) {
    return false;
  } 

  // Verify password
  try {
    if(await argon2.verify(findUser[0].hash, password)) {
      hashResult =  true;
    } else {
      hashResult =  false;
    }
  } catch(err) {
    console.error('Error:', err)
  }

  // Return boolean based on information
  if(findUser[0].username === username && hashResult) {
    return true;
  } else {
    return false;
  }
  
}

//console.log(await authLogin("dadigwu", "hello"));
//console.log(await getUserByID("1"));
//console.log(await authLogin("dadigwu", "hello"));
//console.log(await registerUser(" dadigwu ", "hey"))