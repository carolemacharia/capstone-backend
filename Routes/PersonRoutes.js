const express = require('express');
const router = express.Router();
const PersonModel = require('../models/PersonModel');
const cloudinary = require('cloudinary');

router.get(
    '/', 
    (req, res)=>{

        if(req.query.person) {
            // Finding a single person in DB and sending it to client
            PersonModel
            .find({person: req.query.person})
            .then(
                (document) => {
                    res.send(document)
                }
            )
            .catch(
                (e) => {
                    console.log('error', e);
                    res.send({ e: e })
                }
            )
        }
        else {
            // Finding all persons in DB and sending it to client
            PersonModel
            .find()
            .then(
                (document) => {
                    res.send(document)
                }
            )
            .catch(
                (e) => {
                    console.log('error', e)
                }
            )
        }
    }
);

router.post(
    '/',
    (req, res) => {

        // data that will be saved in the collection
        const formData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            age: req.body.age,
            description: req.body.description,
            location: req.body.location,
            photoURL: ''
        };




        PersonModel
        .findOne(
            { 
                firstName: req.body.firstName,
                lastName: req.body.lastName
            }
            )
        .then(
            async (document)=> {
                // if document exists, they were already reported
                // so reject report
                if(document) {
                    res.send({msg: "This person was already reported as missing"})
                }

                // otherwise, they are a new person so report as missing
                else {
                    // 2. Extract password
                    const newPerson = new PersonModel(formData);

                    // 4. Upload the person's avatar
                    const files = Object.values(req.files);

                    await cloudinary.uploader.upload(
                        files[0].path,
                        (cloudinaryResult, err) => {
                            console.log('cloudinaryResult', cloudinaryResult);
                            // Then include the photoURL in formData
                            newPerson.photoURL = cloudinaryResult.url
                        }
                    )


                    // save to database
                    newPerson
                    .save()
                    .then(
                        (document) => {
                            res.send(document);
                        }
                    )
                    .catch(
                        (e) => {
                            console.log('e', e)
                            res.send({e: e})
                        }
                    )

                }
            }    
        )
    }    
);


module.exports = router;