import * as argon2 from "argon2";
import jwt from "jsonwebtoken";

export async function checkString(str) {
  const regex = /\W/;
  const match = await str.match(regex);
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
