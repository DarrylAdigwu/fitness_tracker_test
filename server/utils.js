import * as argon2 from "argon2";
import jwt from "jsonwebtoken";

export function checkString(str) {
  const regex = /^[a-zA-Z0-9\s]*$/;
  const match = str.match(regex);
  return match;
}

// Hash password with argon2
export async function hashPassword(password) {
  try{
    const hash = await argon2.hash(password);
    return hash;
  } catch(err) {
    console.error("Error:", err)
  }
}

// JSONWebToken
export async function JWT(payload, privateKey) {
  const token = jwt.sign(payload, privateKey, {expiresIn: `${1000 * 60 * 60}`})
  return token;
}

// Format date 
export function formatDate(date) {
  const passedInDate = Date.parse(date)
  const plannedDate = new Date(passedInDate)
  
  const year = plannedDate.getFullYear();
  const month = String(plannedDate.getMonth() + 1).padStart(2, '0');
  const day = String(plannedDate.getDate()).padStart(2, '0');
  const newFormat = `${year}-${month}-${day}`;
  
  return newFormat;
}


