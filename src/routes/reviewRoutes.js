const express = require('express');
const router = express.Router();
const {postReview, getReviews, getReview, updateReview, deleteReview}=require('../controllers/reviewController');

router.post('/products/:productId/reviews', postReview);

router.get('/products/:productId/reviews', getReviews);

router.get('/products/:productId/reviews/:reviewId', getReview);

router.patch('/products/:productId/reviews/:reviewId', updateReview);

router.delete('/products/:productId/reviews/:reviewId', deleteReview);

module.exports=router;