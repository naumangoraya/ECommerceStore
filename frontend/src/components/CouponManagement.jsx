import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";
import { Trash2 } from "lucide-react";

const CouponManagement = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        code: "",
        discountPercentage: "",
        expirationDate: "",
        userId: "",
    });
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchCoupons();
        fetchUsers();
    }, []);

    const fetchCoupons = async () => {
        try {
            const response = await axios.get("/coupons/all");
            setCoupons(response.data);
        } catch (error) {
            toast.error("Failed to fetch coupons");
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get("/auth/users");
            setUsers(response.data.users);
        } catch (error) {
            toast.error("Failed to fetch users");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/coupons/create", formData);
            toast.success("Coupon created successfully");
            fetchCoupons();
            setFormData({
                code: "",
                discountPercentage: "",
                expirationDate: "",
                userId: "",
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create coupon");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/coupons/${id}`);
            toast.success("Coupon deleted successfully");
            fetchCoupons();
        } catch (error) {
            toast.error("Failed to delete coupon");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-emerald-400">Create New Coupon</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Coupon Code</label>
                        <input
                            type="text"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Discount Percentage</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={formData.discountPercentage}
                            onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Expiration Date</label>
                        <input
                            type="datetime-local"
                            value={formData.expirationDate}
                            onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">User</label>
                        <select
                            value={formData.userId}
                            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white px-3 py-2"
                            required
                        >
                            <option value="">Select a user</option>
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
                    >
                        Create Coupon
                    </button>
                </form>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-emerald-400">Active Coupons</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Code
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Discount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Expiration
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {coupons.map((coupon) => (
                                <tr key={coupon._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                        {coupon.code}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                        {coupon.discountPercentage}%
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                        {new Date(coupon.expirationDate).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                        {coupon.userId?.name || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                coupon.isActive
                                                    ? "bg-emerald-900 text-emerald-200"
                                                    : "bg-red-900 text-red-200"
                                            }`}
                                        >
                                            {coupon.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                        <button
                                            onClick={() => handleDelete(coupon._id)}
                                            className="text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CouponManagement; 