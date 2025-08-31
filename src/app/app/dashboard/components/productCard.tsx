"use client";

import React from "react";
import  Link  from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

const products: Product[] = [
  { id: "1", name: "Product A", price: 2500, stock: 12 },
  { id: "2", name: "Product B", price: 5000, stock: 3 },
  { id: "3", name: "Product C", price: 1200, stock: 0 },
  { id: "4", name: "Product D", price: 2500, stock: 12 },
  { id: "5", name: "Product E", price: 5000, stock: 3 },
  { id: "6", name: "Product F", price: 1200, stock: 0 },
];

// ✅ return just color keywords instead of full classes
const getStockColor = (stock: number): "green" | "yellow" | "red" => {
  if (stock === 0) return "red";
  if (stock < 5) return "yellow";
  return "green";
};

export default function ProductCard() {
  return (
    <div className="bg-white shadow rounded-2xl p-4 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Products</h2>
        <Link href="/dashboard/products">
  <button className="text-gray-500 text-sm border border-gray-200 rounded-2xl py-2 px-6">
    See All
  </button>
</Link>
      </div>

      <div className="space-y-3">
        {products.map((product) => {
          const stockColor = getStockColor(product.stock);

      
          const stockClasses: Record<string, string> = {
            green: "border-green-500 bg-green-500/10 text-green-500",
            red: "border-red-500 bg-red-500/10 text-red-500",
            yellow: "border-yellow-500 bg-yellow-500/10 text-yellow-500",
          };

          return (
            <div
              key={product.id}
              className="flex justify-between items-center border border-gray-100 rounded-2xl p-4"
            >
              <span>{product.name}</span>
              <span className="text-xl text-gray-400">
                ₦{product.price.toLocaleString()}
              </span>
              <span
                className={`border rounded-full text-sm px-3 py-1 ${stockClasses[stockColor]}`}
              >
                {product.stock} in stock
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
