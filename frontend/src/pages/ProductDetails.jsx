import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Send } from "lucide-react";
import axios from "../lib/axios";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    images: [],
  });
  const { addToCart } = useCartStore();
  const { user } = useUserStore();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const [productRes, reviewsRes] = await Promise.all([
          axios.get(`/products/${id}`),
          axios.get(`/reviews/product/${id}`),
        ]);
        setProduct(productRes.data.product);
        setReviews(reviewsRes.data.reviews);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError(
          error.response?.data?.message || "Error fetching product details"
        );
        toast.error("Error fetching product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add products to cart");
      navigate("/login");
      return;
    }
    addToCart(product);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a review");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post("/reviews", {
        productId: id,
        ...newReview,
      });
      setReviews([response.data.review, ...reviews]);
      setNewReview({ rating: 5, comment: "", images: [] });
      toast.success("Review submitted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting review");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!product)
    return <div className="text-center mt-8">Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[500px] object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-white">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(product.averageRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-400"
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-300">
              ({product.totalReviews} reviews)
            </span>
          </div>

          <p className="text-2xl font-bold text-emerald-400">
            ${product.price.toFixed(2)}
          </p>

          <p className="text-gray-300">{product.description}</p>

          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
          >
            <ShoppingCart className="mr-2" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Review Form */}
      {user && (
        <div className="mt-12 bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Write a Review</h2>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="block text-white mb-2">Rating</label>
              <div className="flex items-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() =>
                      setNewReview({ ...newReview, rating: i + 1 })
                    }
                  >
                    <Star
                      className={`w-6 h-6 ${
                        i < newReview.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-white mb-2">Comment</label>
              <textarea
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-emerald-500"
                rows="4"
                required
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Review
            </button>
          </form>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">Customer Reviews</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-400">No reviews yet</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white">
                      {review.user.name}
                    </span>
                    {review.isVerifiedPurchase && (
                      <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-300">{review.comment}</p>
                {review.images && review.images.length > 0 && (
                  <div className="mt-4 flex space-x-2">
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Review image ${index + 1}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
