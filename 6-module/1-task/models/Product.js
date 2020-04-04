const mongoose = require('mongoose');
const connection = require('../libs/connection');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose.ObjectId,
        ref: 'categorySchema',
        required: true,
    },
    subcategory: {
        type: mongoose.ObjectId,
        ref: 'subCategorySchema',
        required: true,
    },
    images: [String],
});

module.exports = connection.model('Product', productSchema);
