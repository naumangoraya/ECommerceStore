import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
	try {
		const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });
		res.json(coupon || null);
	} catch (error) {
		console.log("Error in getCoupon controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const validateCoupon = async (req, res) => {
	try {
		const { code } = req.body;
		const coupon = await Coupon.findOne({ code: code, userId: req.user._id, isActive: true });

		if (!coupon) {
			return res.status(404).json({ message: "Coupon not found" });
		}

		if (coupon.expirationDate < new Date()) {
			coupon.isActive = false;
			await coupon.save();
			return res.status(404).json({ message: "Coupon expired" });
		}

		res.json({
			message: "Coupon is valid",
			code: coupon.code,
			discountPercentage: coupon.discountPercentage,
		});
	} catch (error) {
		console.log("Error in validateCoupon controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Admin Controllers
export const createCoupon = async (req, res) => {
	try {
		const { code, discountPercentage, expirationDate, userId } = req.body;

		// Validate required fields
		if (!code || !discountPercentage || !expirationDate || !userId) {
			return res.status(400).json({ message: "All fields are required" });
		}

		// Check if coupon code already exists
		const existingCoupon = await Coupon.findOne({ code });
		if (existingCoupon) {
			return res.status(400).json({ message: "Coupon code already exists" });
		}

		const coupon = await Coupon.create({
			code,
			discountPercentage,
			expirationDate: new Date(expirationDate),
			userId,
			isActive: true,
		});

		res.status(201).json(coupon);
	} catch (error) {
		console.log("Error in createCoupon controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getAllCoupons = async (req, res) => {
	try {
		const coupons = await Coupon.find().populate('userId', 'name email');
		res.json(coupons);
	} catch (error) {
		console.log("Error in getAllCoupons controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteCoupon = async (req, res) => {
	try {
		const { id } = req.params;
		await Coupon.findByIdAndDelete(id);
		res.json({ message: "Coupon deleted successfully" });
	} catch (error) {
		console.log("Error in deleteCoupon controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
