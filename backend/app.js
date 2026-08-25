require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const {MongoStore} = require('connect-mongo');
const app = express();

const authRouter = require("./routes/authRouter");

const store = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  collectionName: 'sessions'
});

app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  store: store
}));

app.use(express.json());
app.use("/api/auth", authRouter);

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
  app.listen(3001);
  console.log("Connected to MongoDB");
})
.catch((err)=>{
  console.error("Error connecting to MongoDB", err);
});