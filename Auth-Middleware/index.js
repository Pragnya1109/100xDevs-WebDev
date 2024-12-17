/*
ASSIGNMENT #4 - Creating an auth middleware

Can you try creating a `middleware` called `auth` that verifies if a user is logged in and 
ends the request early if the user isn’t logged in?
*/

const express = require("express");

const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

const users = [];

const JWT_SECRET = "secret_key";

// Create a post request for the signup route
app.post("/signup", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (users.find((user) => user.username === username)) {
        return res.json({
            message: "You are already signed up!",
        });
    }

    users.push({
        username: username,
        password: password, 
    });

    res.json({
        message: "You have signed up successfully!",
    });
});

// Create a post request for the signin route
app.post("/signin", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    const user = users.find((user) => user.username === username && user.password === password);

    if (user) {
        const token = jwt.sign(
            {
                username: user.username,
            },
            JWT_SECRET
        );

        return res.json({
            message: "You have signed in successfully!",
            token: token,
        });
    } else {
        return res.json({
            message: "Invalid username or password!",
        });
    }
});

// Create a middleware called auth to verify if the user is logged in or not
function auth(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.json({
            message: "Token is missing!",
        });
    } 

    jwt.verify(token, JWT_SECRET, function (err, decoded) {
        if (err) {
            return res.json({
                message: "Unauthorized!",
            });
        }

        
        req.user = decoded;

        next();
    });
}

// Create a get request 
app.get("/", auth, function (req, res) {
    const user = req.user;
    res.json({
        username: user.username,
    });
});

app.listen(3000);