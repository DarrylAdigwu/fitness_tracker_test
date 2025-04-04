import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from 'node:path';
import url from 'node:url';
import cors from "cors";
import helmet from "helmet";
import session from "express-session";
import MySQLStore from "express-mysql-session";
import { db, registerUser, authLogin, getUserByUsername, 
  storeExercise, getUsersExercises } from "./db.js";
import { checkString, JWT, formatDate } from "./utils.js";


// Create Web App
const server = express();

// Configure .env files
dotenv.config();

server.set("trust proxy", 1)

//Create SQL connection pool
const SQLStore = MySQLStore(session);

// Create MySQLStore 
const sessionStore = new SQLStore({}, db);

// Middleware for cross-origin resources and pass header
server.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Configure middleware for JSON, public folder, and parsing body and cookie
server.use(cookieParser());
server.use(express.static("public"));
server.use(express.json());
server.use(express.urlencoded({extended:true}));

// Create Session
server.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  rolling: true,
  cookie: {
    httpOnly: process.env.NODE_ENV === 'production' ? true : false,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge: 1000 * 60 * 60,
    domain: "localhost"
  },
}));

// Set views for ejs
server.set("view engine", "ejs")

// Middleware for web security
server.use(helmet());


// Global Error Handling
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something unusual occurred");
});

// Log http request
server.use(morgan("dev"))

/* Landing page */
server.route("/")
.get(async (req, res) => {
  
});

/* Register Users */
server.route("/register")
.post(async (req, res) => {
  const allRegisterData = req.body.allData;
  const username = allRegisterData.username;
  const password = allRegisterData.password;
  const confirmPass = allRegisterData["confirm-password"];
  
  if(req.method === 'POST') {
    
    // Validate register form
    if(!username) {
      return res.json({
        serverError: {"invalidUsername": "Username is required"}
      });
    }
    
    if(checkString(username) === null) {
      return res.json({
        serverError: {"invalidChar": "Username cannot not contain special characters"}
      });
    }
    
    if(!password) {
      return res.json({
        serverError: {"invalidPassword": "Password is required"}
      });
    }
    
    if(password !== confirmPass) {
      return res.json({
        serverError: {"invalidConfirmPass": "Passwords must match"}
      });
    }

    if(await getUserByUsername(username, "username") !== false) {
      return res.json({
        serverError: {"invalidUsername": "Username already exists"}
      })
    }
    
    
    // If registration is valid
    try{
      await registerUser(username, password);
    } catch (err) {
      console.error("Error:", err)
    }
    
    //Return response to client for page redirect
    return res.status(200).json({
      serverCheck: {"valid": "Registration is valid"}
    });
    
  }
});


/* Login Route/Start Session */
server.route("/login")
.post(async (req, res) => {
  const allLoginData = req.body.allData;
  const redirectParam = req.body.redirectParam;
  const username = allLoginData.username;
  const password = allLoginData.password;
  const loginUser = await authLogin(username, password);
  
  if(req.method === 'POST') {
    
    // Validate login form
    if(!username) {
      return res.status(400).json({
        serverError: {"invalidUsername": "Username is required"}
      });
    }
    
    if(!password) {
      return res.status(400).json({
        serverError: {"invalidPassword": "Password is required"}
      });
    }
    
    if(checkString(username) === null) {
      return res.status(400).json({
        serverError: {"invalidUsername": "Invalid username"}
      });
    }
    
    if(loginUser === "Invalid username") {
      return res.status(401).json({
        serverError: {"unauthUsername": "Username does not exist"}
      });;
    }
    
    if(loginUser === "Password does not match") {
      return res.status(401).json({
        serverError: {"unauthPassword": "Password does not match"}
      });
    }
    
    // Start session
    if(loginUser) {
      const user_id = await getUserByUsername(username, "id");
      const sessionUser = req.session.user = {
        id: user_id, 
        username: username
      };

      req.session.save((err) => {
        if(err) {
          console.error("Error saving session:", err);
          return res.status(500).send("Error saving session");
        }
      })
      
      const tokenID = await JWT({IDtoken: sessionUser.id}, process.env.JWT_TOKEN)
    
      res.cookie("username", `${sessionUser.username}`, {
        maxAge: 1000 * 60 * 60,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      })

      res.cookie("userID", `${tokenID}`, {
        maxAge: 1000 * 60 * 60,
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      });
      
      // Send URL data based on redirectParam value
      if(redirectParam) {
        return res.status(200).json({ 
          message: "Login successful",
          redirectUrl: `http://localhost:5173${redirectParam}/${username}`,
        });
      } else {
        return res.status(200).json({ 
          message: "Login successful",
          redirectUrl: `http://localhost:5173/dashboard/${username}`,
        });
      }
    }
    
  }
});


/* Logout Route */
server.route("/logout")
.post(async (req, res) => {
  if(req.method === "POST") {

  }
})

/* Check authorization */
server.route("/authenticate")
.get(async (req, res) => {
  
  if(req.session.user) {
    return res.status(200).json({
      valid: "Authorized"
    })
  } else {
    return res.json({
      invalid: "Unauthorized", 
    });
  }
});


/* Dashboard route */
server.route("/dashboard/:username")
.get(async (req, res) => {
  if(req.session.user) {
    const user_id = req.session.user.id;
    const url = new URL(`https://localhost:3000${req.url}`)
    const date = url.searchParams.get("date");
    const formattedDate = formatDate(date);

    // Get Stored workout and return to dashboard
    const getWorkout = await getUsersExercises(user_id, formattedDate);
    return res.status(200).json({
        getWorkout,
    })
  }
})
.post(async (req, res) => {
  const allDashboardData = req.body.allData;
  const id = req.session.user.id;
  const username = req.session.user.username;
  const numOfWorkouts = (Object.keys(allDashboardData).length - 1) / 3;
  const date = allDashboardData.displayDate;

  if(req.method === 'POST') {
    
    // Server side validation
    for(const [key, value] of Object.entries(allDashboardData)) {
      
      if(value === null || value === "") {
        return res.status(400).json({
          serverError: {"invalid": "Visible fields must have an answer"}
        })
      }
      
      if(key.startsWith("repInput") && isNaN(value)) {
        return res.status(400).json({
          serverError: {"invalid": `Rep fields must be a number`}
        })
      }
      
      if(key !== "displayDate" && checkString(value) === null) {
        return res.status(400).json({
          serverError: {"invalid": "Inputs cannot contain special characters or spaces"}
        })
      }
    }

    const newDateFormat = formatDate(date)

    // Send Workouts to database
    for(let i = 0; i < numOfWorkouts; i++) {
      const workout = allDashboardData[`workoutInput${i + 1}`];
      const muscleGroup = allDashboardData[`muscleGroupInput${i + 1}`];
      const rep = allDashboardData[`repInput${i + 1}`];
      await storeExercise(id, username, workout, muscleGroup, rep, newDateFormat);
    }

    // Return valid message
    return res.status(200).json({
      serverCheck: {"valid": "Data is valid"}
    })
  }
});


/* Serve static files from React Vite (for build) */
const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);
server.use(express.static(path.join(__dirname, "../client/dist")));
server.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

server.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});

process.on('SIGINT', () => {
  console.info('SIGINT signal received.');
  console.log('Closing http server.');
  server.close(() => {
    console.log('Http server closed.');
    process.exit(0);
  });
});