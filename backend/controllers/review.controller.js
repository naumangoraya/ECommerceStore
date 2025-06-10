import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

// Create a new review
export const createReview = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { productId, rating, comment, images } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!productId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Product ID, rating, and comment are required",
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
    });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // Check if user has purchased the product
    const hasPurchased = await Order.findOne({
      user: userId,
      "products.product": productId,
      status: "delivered",
    });

    const review = await Review.create({
      user: userId,
      product: productId,
      rating,
      comment,
      images,
      isVerifiedPurchase: !!hasPurchased,
    });

    // Update product's average rating and total reviews
    const allReviews = await Review.find({ product: productId });
    const totalRating = allReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    product.averageRating = totalRating / allReviews.length;
    product.totalReviews = allReviews.length;
    product.reviews.push(review._id);
    await product.save();

    // Populate user information before sending response
    await review.populate("user", "name");

    res.status(201).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("Error in createReview:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const reviews = await Review.find({ product: productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
      averageRating: product.averageRating,
      totalReviews: product.totalReviews,
    });
  } catch (error) {
    console.error("Error in getProductReviews:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { reviewId } = req.params;
    const { rating, comment, images } = req.body;
    const userId = req.user._id;

    const review = await Review.findOne({ _id: reviewId, user: userId });
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found or unauthorized",
      });
    }

    // Update review fields
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    if (images) review.images = images;
    await review.save();

    // Update product's average rating
    const product = await Product.findById(review.product);
    const allReviews = await Review.find({ product: review.product });
    const totalRating = allReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    product.averageRating = totalRating / allReviews.length;
    await product.save();

    // Populate user information before sending response
    await review.populate("user", "name");

    res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("Error in updateReview:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findOne({ _id: reviewId, user: userId });
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found or unauthorized",
      });
    }

    await review.deleteOne();

    // Update product's average rating and total reviews
    const product = await Product.findById(review.product);
    const allReviews = await Review.find({ product: review.product });

    if (allReviews.length > 0) {
      const totalRating = allReviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      product.averageRating = totalRating / allReviews.length;
    } else {
      product.averageRating = 0;
    }

    product.totalReviews = allReviews.length;
    product.reviews = product.reviews.filter(
      (id) => id.toString() !== reviewId
    );
    await product.save();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteReview:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
