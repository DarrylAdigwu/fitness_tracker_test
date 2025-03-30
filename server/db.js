import mysql from "mysql2/promise";
import dotenv from "dotenv";
import * as argon2 from "argon2";
import { hashPassword } from "./utils.js";

/* Configure .env files */
dotenv.config();

/* Configure Database */
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


/* Register user to database */
export async function registerUser(username, password) {
  const hash = await hashPassword(password);
  const register = await db.query(`INSERT INTO users (username, hash)
          VALUES(?, ?)`, [username, hash]);
  return register;
}

// Get user by username
export async function getUserByUsername(username, info = "id") {
  // SQL query statemt
  let getUserQuery = `SELECT id, username 
          FROM users 
          WHERE username = ?`;
  
  // Parameters to be added to query
  let getUserInsert = [username];
  
  // Format escaped query
  getUserQuery = mysql.format(getUserQuery, getUserInsert);
  
  const [userQuery] = await db.query(getUserQuery);
  
  console.log(userQuery)
  if(!userQuery[0]) {
    return false
  } 
  if(info === "username") {
    return userQuery[0].username
  } else {
    return userQuery[0].id
  }

}


/* Authenticate user login */
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


/* Search for duplicate workouts */
export async function checkWorkouts(id, username, workout, date) {
  let checkWorkoutsQuery = `Select * FROM workouts 
          WHERE user_id = ? 
          AND user_name = ? 
          AND exercise = ? 
          AND date = ?`;
  
  let checkWorkoutsInsert = [id, username, workout, date];

  checkWorkoutsQuery = mysql.format(checkWorkoutsQuery, checkWorkoutsInsert);

  const [workoutsQuery] = await db.query(checkWorkoutsQuery);
  if(workoutsQuery[0]) {
    return true;
  } else {
    return false;
  }
}


/* Store workout */
export async function storeExercise(id, username, workout, muscleGroup, reps, date) {
  // Check if entry already exists
  if(await checkWorkouts(id, username, workout, date)) {
    return "Workout already exists";
  }

  // Store new workouts
  let storeExerciseQuery = `INSERT INTO workouts 
          (user_id, user_name, exercise, muscle_group, reps, date)
          VALUES(?, ?, ?, ?, ?, ?)`;
  
  let storeExerciseInsert = [id, username, workout, muscleGroup, reps, date];

  storeExerciseQuery = mysql.format(storeExerciseQuery, storeExerciseInsert);

  const exerciseQuery = await db.query(storeExerciseQuery);

  return exerciseQuery;
}


// Get all user workouts for the day
export async function getUsersExercises(id, date) {
  // Get stored workouts
  let getWorkoutsQuery = `SELECT id, exercise, muscle_group, reps, date FROM workouts
          WHERE user_id = ?
          AND date =?`;
  
  let getWorkoutsInsert = [id, date];

  getWorkoutsQuery = mysql.format(getWorkoutsQuery, getWorkoutsInsert);

  const [getExercisesQuery] = await db.query(getWorkoutsQuery);
  
  if(getExercisesQuery.length === 0) {
    return null
  }
  return getExercisesQuery;
}