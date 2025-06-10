import { useState } from "react";
import ProductManagement from "../components/ProductManagement";
import OrderManagement from "../components/OrderManagement";
import CouponManagement from "../components/CouponManagement";
import Analytics from "../components/Analytics";

const AdminPage = () => {
	const [activeTab, setActiveTab] = useState("products");

	const tabs = [
		{ id: "products", label: "Products" },
		{ id: "orders", label: "Orders" },
		{ id: "coupons", label: "Coupons" },
		{ id: "analytics", label: "Analytics" }
	];

	const renderContent = () => {
		switch (activeTab) {
			case "products":
				return <ProductManagement />;
			case "orders":
				return <OrderManagement />;
			case "coupons":
				return <CouponManagement />;
			case "analytics":
				return <Analytics />;
			default:
				return null;
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold text-emerald-400 mb-8">Admin Dashboard</h1>
			
			<div className="bg-gray-800 p-1 rounded-lg mb-6">
				<div className="flex space-x-1">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`px-4 py-2 rounded-md transition-colors ${
								activeTab === tab.id
									? "bg-emerald-600 text-white"
									: "text-gray-300 hover:bg-gray-700"
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>
			</div>

			<div className="mt-6">
				{renderContent()}
			</div>
		</div>
	);
};

export default AdminPage;
