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
  return register;
}

// Get user by username
export async function getUserByUsername(username) {
  // SQL query statemt
  let getUserQuery = `SELECT id, username 
          FROM users 
          WHERE username = ?`;
  
  // Parameters to be added to query
  let getUserInsert = [username];
  
  // Format escaped query
  getUserQuery = mysql.format(getUserQuery, getUserInsert);
  
  const [userQuery] = await db.query(getUserQuery);

  return userQuery[0].id;
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
    return "Invalid username";
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
  } else if(!hashResult){
    return "Password does not match";
  } 

}

// Store workout
export async function storeExercise(id, username, workout, muscleGroup, reps, date) {
  let storeExerciseQuery = `INSERT INTO workouts 
          (user_id, user_name, exercise, muscle_group, reps, date)
          VALUES(?, ?, ?, ?, ?, ?)`;
  
  let storeExerciseInsert = [id, username, workout, muscleGroup, reps, date];

  storeExerciseQuery = mysql.format(storeExerciseQuery, storeExerciseInsert);

  const exerciseQuery = await db.query(storeExerciseQuery);

  return exerciseQuery;
}
