const mongoose=require('mongoose');

const reviewSchema = mongoose.Schema(
    {
        reviewId: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: [true, 'User name is required.']
        },
        rating: {
            type: Number,
            trim: true,
            min: [1, 'Minimum rating of 1 is allowed.'],
            max: [10, 'Maximum rating of 10 is allowed.'],
            required: [true, 'Rating is required'],
            validate: {
                validator: function (value) {
                  return Number.isInteger(value);
                },
                message: 'Rating must be an integer number.',
            }
        },
        review: {
            type: String,
            required: [true, 'Review is required'],
            validate: {
                validator: function (value) {
                  const words = value.trim().split(/\s+/); 
                  return words.length <= 50;
                },
                message: 'Review should not exceed 50 words.',
            }
        }
    },
    {
        timestamps: true
    }
);

reviewSchema.pre('save', function (next) {
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

const Review=mongoose.model('Review', reviewSchema, 'Reviews');

module.exports=Review;