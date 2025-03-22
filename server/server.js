import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import session from "express-session";
import MySQLStore from "express-mysql-session";
import { db, registerUser, authLogin } from "./db.js";
import { checkString } from "./utils.js";


// Create Web App
const server = express();

// Configure .env files
dotenv.config();

//Create SQL connection pool
const SQLStore = MySQLStore(session);

// Create MySQLStore 
const sessionStore = new SQLStore({}, db);

// Create Session
server.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  rolling: true,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

// Set views for ejs
server.set("view engine", "ejs")

// Middleware for web security
server.use(helmet());

// Middleware for cross-origin resources
const corsOptions = {
  origin: ["http://localhost:5173"],
}

server.use(cors(corsOptions));

// Configure middleware for JSON, public folder, and parsing body
server.use(express.static("public"));
server.use(express.json());
server.use(express.urlencoded({extended:true}))

// Global Error Handling
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something unusual occurred");
});

// Log http request
server.use(morgan("dev"))

// Landing page
server.route("/")
.get(async (req, res) => {
  res.send("landing page")
});

// Register page
server.route("/register")
.post(async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const confirmPass = req.body.confirmPassword;
  if(req.method === 'POST') {

    // Validate register form
    if(!username) {
      return res.status(400).json(
        {serverError: {"invalidUsername": "Username is required!"}}
      );
    }

    if(await checkString(username) !== null) {
      return res.status(400).json(
        {serverError: {"invalidChar": "Username cannot not contain special characters!"}}
      )
    }

    if(!password) {
      return res.status(400).json(
        {serverError: {"invalidPassword": "Password is required!"}}
      )
    }

    if(password !== confirmPass) {
      return res.status(400).json(
        {serverError: {"invalidConfirmPass": "Passwords must match!"}}
      )
    }

    
    // If registration is valid
    const register = await registerUser(username, password);
    
    //Return response to client for page redirect
    return res.status(200).json(
      {serverCheck: {"valid": "Data is valid"}}
    )
  }
});

server.route("/login")
.post(async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const authorizeUser = await authLogin(username, password);
  if(req.method === 'POST') {
    // Validate login form
    if(!username) {
      return res.status(400).json(
        {serverError: {"invalidUsername": "Username is required!"}}
      );
    }

    if(!password) {
      return res.status(400).json(
        {serverError: {"invalidPassword": "Password is required!"}}
      )
    }

    if(await checkString(username) !== null) {
      return res.status(400).json(
        {serverError: {"invalidUsername": "Invalid username!"}}
      )
    }

    if(authorizeUser === "Invalid username") {
      return res.status(401).json(
        {serverError: {"unauthUsername": "Username does not exist"}}
      )
    }

    if(authorizeUser === "Password does not match") {
      return res.status(401).json(
        {serverError: {"unauthPassword": "Password does not match!"}}
      )
    }

    //Return response to client for page redirect
    return res.status(200).json(
      {serverCheck: {"valid": "Data is valid"}}
    )
    
  }
})

server.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});