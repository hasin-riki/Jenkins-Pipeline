const mongoose=require('mongoose');
const imageValidation = require('../utils/imageValidation');

const productSchema = mongoose.Schema(
    {
        productId: {
            type: String,
            unique: true,
            trim: true,
            required: [true, 'Product id is required.']
        },
        productName: {
            type: String,
            trim: true,
            required: [true, 'Product name is required.']
        },
        image: {
            type: String,
            trim: true,
            required: [true, 'Image is required.'],
            validate: {
                validator: imageValidation,
                message: 'Invalid image format.'
            }
        },
        price: {
            type: Number,
            required: [true, 'Price is required.'],
            validate: {
                validator: function (value) {
                  return Number.isInteger(value);
                },
                message: 'Price must be an integer number.',
            }
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required.'],
            validate: {
                validator: function (value) {
                  return Number.isInteger(value);
                },
                message: 'Quantity must be an integer number.',
            }
        },
        category: {
            type: String,
            enum: ['Furniture', 'Sports', 'Shoes'],
            required: [true, 'Category is required.']
        },
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Review'
            }
        ]
    },
    {
        timestamps: true
    }
);

productSchema.pre('save', function (next) {
    if (this.createdAt && this.updatedAt) {
        const createdAt = new Date(this.createdAt);
        const updatedAt = new Date(this.updatedAt);
        createdAt.setHours(createdAt.getHours() + 5);
        updatedAt.setHours(updatedAt.getHours() + 5); 
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    next();
});

const Product=mongoose.model('Product', productSchema, 'Products');

module.exports=Product;
