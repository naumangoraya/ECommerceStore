import { useState } from "react";
import CreateProductForm from "./CreateProductForm";
import ProductsList from "./ProductsList";

const ProductManagement = () => {
    const [view, setView] = useState("list"); // "list" or "create"

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button
                    onClick={() => setView(view === "list" ? "create" : "list")}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors"
                >
                    {view === "list" ? "Create New Product" : "View Products"}
                </button>
            </div>

            {view === "list" ? <ProductsList /> : <CreateProductForm />}
        </div>
    );
};

export default ProductManagement; 