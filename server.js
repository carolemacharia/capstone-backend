// Import the express library in this file
const express = require('express');
// Assign to server the express library
const server = express();

// Import dotenv
const dotenv = require('dotenv');
dotenv.config();

// Import body-parser
const bodyParser = require('body-parser');

// Import cors
const cors = require('cors');

// Import passport
const passport = require('passport');
const initPassportStrategy = require('./config/passport');
initPassportStrategy(passport);

// Import cloudinary
const cloudinary = require('cloudinary');
cloudinary.config(
    {
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    }
)
// Import express-form-data
const expressFormData = require('express-form-data');


// Import mongoose (for connecting MongoDB)
const mongoose = require('mongoose');
const PersonRoutes = require('./routes/PersonRoutes');
const UserRoutes = require('./routes/UserRoutes');
const dbURL = process.env.DB_URL;

mongoose
    .connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true})
    // for successful promise
    .then( 
        ()=>{
            console.log('Connected to MongoDB')
        } 
    )
    // for failed promise
    .catch(
        (e)=> {
            console.log('an error occured', e)
        }
    );

server.use(bodyParser.urlencoded( {extended: false} ));
server.use(bodyParser.json());
server.use(cors());
server.use(passport.initialize());
server.use(expressFormData.parse());

server.get(
    //1st argument
    '/',
    //2nd argument
    (req, res)=>{
        const theHTML = "<h1>Welcome to My App</h1>";
        res.send(theHTML);
    }
);

server.get(
    '/profile',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        res.send(
            `<h1>Your Profile<h1>  
            <p>your firstname: ${req.user.firstName} </p>
            <p>your lastname: ${req.user.lastName}  </p>`
        );
    }
);

server.get(
    '/account-settings',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        res.send(
            `<h1>Your Account Settings<h1>  
            <p>your firstname: ${req.user.firstName} </p>
            <p>your lastname: ${req.user.lastName}  </p>
            <p>your email: ${req.user.email}  </p>
            `
        );
    }
)

server.use(
    '/person',
    PersonRoutes
)

server.use(
    '/users',
    UserRoutes
);


server.get(
    '/404',
    (req, res) => {
        res.send("<h1>404<h1>");
    }
);

server.get(
    '*',
    (req, res) => {
       res.redirect('/404')
    }
);

server.listen(
    // port number
    process.env.PORT || 3001, 
    // callback when (and if) the connection is OK
    () => {
        console.log('Your server is now running http://localhost:3001/')
    }
)