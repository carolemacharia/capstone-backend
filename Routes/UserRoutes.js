const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const secret = process.env.SECRET;

const UserModel = require('../model/UserModel');


//create a new user using POST

router.post(
    '/register',
    (req, res) => {
        const formData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            
        };

        // 1. Make sure email is unique
        UserModel
        .findOne({ email: req.body.email })
        .then(
            async (document)=> {
                // if document exists, they already have an account
                // so reject registration
                if(document) {
                    res.send({msg: "An account with that email exists"})
                }

                // otherwise, they are a new user so create their account
                else {
                    // 2. Extract password
                    const newUser = new UserModel(formData);

                  

                    // 3. Generate salt
                    bcrypt.genSalt(
                        (err, salt) => {
                            
                            // 4. Use salt and password to create encrypted password
                            bcrypt.hash(
                                newUser.password,
                                salt,
                                (err, encryptedPassword) => {
                                    // 5. Replace password with encryption in formData
                                    newUser.password = encryptedPassword;

                                    // 6. Save formData in MongoDB
                                    newUser
                                    .save()
                                    .then(
                                        (document) => {
                                            console.log('document', document)
                                            res.send(document);
                                        }
                                    )
                                    .catch(
                                        (e) => {
                                            console.log('error', e);
                                            res.send({ e: e })
                                        }
                                    )
                                }
                            )

                        }
                    )
                }
            }
        )
    }
);
//login a user
router.post(
    '/login',
    (req, res) => {

        // 1. See if email has been send in POST request
        if(req.body.email) {
            UserModel
            .findOne({email: req.body.email})
            .then(
                (document) => {
                    // 2a. Check to see if email exists
                    if(document) {
                        // 3. If email correct, compare the password
                        bcrypt
                        .compare(req.body.password, document.password)
                        .then(
                            (passwordMatch)=> {
                                // 4a. If .compare() returns true, generate JWT
                                if(passwordMatch) {
                                    // 5. Creating a payload for JWT
                                    const payload = {
                                        id: document._id,
                                        email: document.email
                                    }

                                    // 6. Generate the JWT
                                    jwt.sign(
                                        payload, 
                                        secret,
                                        (err, theJWT) => {
                                            // 7. Send the JWT to client
                                            res.send({ token: theJWT })
                                        }
                                    ) 
                                }
                                // 4b. reject login
                                else {
                                    res.send({ msg: "Please check your email & password" })
                                }
                            }
                        )
                        .catch(
                            (e) => {
                                console.log('e', e)
                            }
                        )
                    } 
                    //2b. If email incorrect, reject login 
                    else {
                        res.send({ msg: "Please check your email & password" })
                    }
                }
            )
            .catch(
                (e) => {
                    console.log('e', e)
                    res.send({ e: e })
                }
            )
        }
    }
);


router.post(
    '/image-upload',
    (req, res) => {
        const files = Object.values(req.files);
        cloudinary.uploader.upload(
            files[0].path,
            (result, err) => {
                console.log(result);
                res.send(result);
            }
        )
    }
)



module.exports = router;