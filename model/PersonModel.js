const mongoose = require('mongoose');

// Schema: decsribes the content of a database document
const PersonSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        photoURL: {
            type: String,
        },
        date: {
            type: Date,
            default: Date
        }
    }
)

// Model
const PersonModel = mongoose.model('person', PersonSchema);

module.exports = PersonModel;