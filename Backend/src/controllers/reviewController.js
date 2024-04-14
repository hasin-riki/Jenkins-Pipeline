const Product=require('../models/productModel');
const Review=require('../models/reviewModel');

const postReview = async (req, res) => {
    try {
        //checking if product exists
        const product=await Product.findOne({productId: req.params.productId}).populate('reviews');
        if(!product){
            return res.status(404).json({message: "Product not found."})//Not Found
        }

        //getting id of last review to create new id for new review
        var lastId=0;
        const lastReview=await Review.find().sort({_id:-1}).limit(1);
        if(lastReview[0]!=null){
            const jsonString=JSON.stringify(lastReview[0]);
            const jsonObj=JSON.parse(jsonString);
            lastId=parseInt(jsonObj.reviewId[3]);
        }
        const reviewId=req.body.name[0].toLowerCase()+req.body.name[1].toLowerCase()+"-"+(lastId+1);
    
        const review=await Review.create({
            reviewId: reviewId,
            name: req.body.name,
            rating: req.body.rating,
            review: req.body.review
        });

        product.reviews.push(review._id);
        product.save();
    
        res.status(200).json({message: "Review successfully posted!", review});
    } catch (error) {
        if(error.name==='ValidationError'){
            return res.status(400).json({message: Object.values(error.errors)[0].message});
        }
        
        res.status(500).json({message: "Unable to create review."})
    }
}

const getReviews = async (req, res) => {
    try {
        //checking if product exists
        const product=await Product.findOne({productId: req.params.productId}).populate('reviews');
        if(!product){
            return res.status(404).json({message: "Product not found."})//Not Found
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const reviews = product.reviews.slice(skip, skip + limit);

        const totalReviews=await Review.countDocuments();

        res.status(200).json({page, totalReviews, totalPages: Math.ceil(totalReviews/limit), reviews});
    } catch (error) {
        res.status(500).json({message: 'Unable to get reviews.'});
    }
}

const getReview = async (req, res) => {
    try {
        //checking if product exists
        const product=await Product.findOne({productId: req.params.productId}).populate('reviews');
        if(!product){
            return res.status(404).json({message: "Product not found."})//Not Found
        }

        const review = product.reviews.find((review) => review.reviewId == req.params.reviewId);
        if(!review) {
            return res.status(404).json({message: 'Review not found.'});
        }

        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const updateReview = async (req, res) => {
    try {
        //checking if product exists
        const product=await Product.findOne({productId: req.params.productId}).populate('reviews');
        if(!product){
            return res.status(404).json({message: "Product not found."})//Not Found
        }

        const review = product.reviews.find((review) => review.reviewId == req.params.reviewId);
        if(!review) {
            return res.status(404).json({message: 'Review not found.'});
        }

        for (const field in req.body) {
            switch (field) {
                case 'reviewId':
                    review.reviewId = req.body.reviewId;
                    break;
                case 'name':
                    review.name = req.body.name;
                    break;
                case 'rating':
                    review.rating = req.body.rating;
                    break;
                case 'review':
                    review.review = req.body.review;
                    break;
            }
        }

        const updatedReview=await review.save();
        res.status(200).json({message: "Review successfully updated!", updatedReview});
    } catch (error) {
        if(error.name==='ValidationError'){
            return res.status(400).json({message: Object.values(error.errors)[0].message});
        }
        else if (error.name==='MongoServerError' && error.code===11000) {
            return res.status(409).json({ message: 'Review already exists.' });
        }

        res.status(500).json({ message: error.message});
    }
}

const deleteReview = async (req, res) => {
    try { 
        //checking if product exists
        const product=await Product.findOne({productId: req.params.productId}).populate('reviews');
        if(!product){
            return res.status(404).json({message: "Product not found."})
        }

        const reviewIndex = product.reviews.indexOf(product.reviews.find(review => review.reviewId == req.params.reviewId));
        if (reviewIndex === -1) {
            return res.status(404).json({message: 'Review not found.'});
        }

        product.reviews.splice(reviewIndex, 1);
        await product.save();

        const review = await Review.findOneAndDelete({reviewId: req.params.reviewId});

        res.status(200).json({message: 'Review successfully deleted!', review});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports={
    postReview,
    getReviews,
    getReview,
    updateReview,
    deleteReview
};