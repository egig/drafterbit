const mongoose = require('mongoose');
const { Project } = require('../model');

const Schema = mongoose.Schema;

let contentTypeSchema = mongoose.Schema({
    name: String,
    slug: String,
    description: String,
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    fields: [{
        type_id: Number,
        name: String,
        label: String
    }]
});

module.exports = contentTypeSchema;