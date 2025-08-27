"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, FileText } from "lucide-react";
import { supabase } from "@/lib/client";
import jsPDF from "jspdf";

interface Product {
  id: string;
  name: string;
  selling_price: number;
}

interface SelectedProduct extends Product {
  quantity: number;
  selected: boolean;
}

export default function CheckoutPage() {
  const [products, setProducts] = useState<SelectedProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("id, name, selling_price");
        if (error) throw error;
        setProducts(
          (data || []).map((p) => ({ ...p, quantity: 1, selected: false }))
        );
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setProducts((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, selected: checked } : p))
        .sort((a, b) => Number(b.selected) - Number(a.selected))
    );
  };

  const handleQuantityChange = (id: string, qty: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity: Math.max(1, qty) } : p
      )
    );
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  const selectedItems = products.filter((p) => p.selected);

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.selling_price * item.quantity,
    0
  );
  const shipping = selectedItems.length > 0 ? 5.0 : 0;
  const total = subtotal + shipping;

  const handleDownloadCSV = () => {
    const headers = ["Product Name", "Quantity", "Price", "Total"];
    const rows = selectedItems.map((item) => [
      item.name,
      item.quantity.toString(),
      `₦${item.selling_price.toLocaleString()}`,
      `₦${(item.selling_price * item.quantity).toLocaleString()}`,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
      ["", "", "Subtotal", `₦${subtotal.toLocaleString()}`],
      ["", "", "Shipping", `₦${shipping.toLocaleString()}`],
      ["", "", "Total", `₦${total.toLocaleString()}`],
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute(
      "download",
      `storemate_order_${new Date().toISOString()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("StoreMate Invoice", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);

    // Table headers
    doc.text("Product", 20, 60);
    doc.text("Quantity", 80, 60);
    doc.text("Price", 120, 60);
    doc.text("Total", 160, 60);

    // Table rows
    let y = 70;
    selectedItems.forEach((item) => {
      doc.text(item.name, 20, y);
      doc.text(item.quantity.toString(), 80, y);
      doc.text(`₦${item.selling_price.toLocaleString()}`, 120, y);
      doc.text(`₦${(item.selling_price * item.quantity).toLocaleString()}`, 160, y);
      y += 10;
    });

    // Totals
    y += 10;
    doc.text("Subtotal", 120, y);
    doc.text(`₦${subtotal.toLocaleString()}`, 160, y);
    y += 10;
    doc.text("Shipping", 120, y);
    doc.text(`₦${shipping.toLocaleString()}`, 160, y);
    y += 10;
    doc.text("Total", 120, y);
    doc.text(`₦${total.toLocaleString()}`, 160, y);

    doc.save(`storemate_invoice_${new Date().toISOString()}.pdf`);
  };

  return (
    <div className="min-h-screen py-12 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Product List */}
        <div className="md:col-span-2 border border-gray-100 rounded-xl p-6 shadow-sm h-50vh overflow-y-auto relative">
          <h1 className="text-2xl font-semibold mb-6">Select Products</h1>

          {/* Search Input */}
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="mb-4"
          />

          {/* Dropdown for matches */}
          {searchQuery && filteredProducts.length > 0 && (
            <div className="absolute bg-white border rounded-md shadow-lg w-full max-h-60 overflow-y-auto z-50">
              {filteredProducts.map((product) => (
                <label
                  key={product.id}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <Checkbox
                    checked={product.selected}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(product.id, Boolean(checked))
                    }
                  />
                  <span>{product.name}</span>
                </label>
              ))}
            </div>
          )}

          {loading && <p>Loading products...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* Product Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox
                      checked={product.selected}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(product.id, Boolean(checked))
                      }
                    />
                  </TableCell>
                  <TableCell className="flex items-center gap-3">
                    {product.name}
                  </TableCell>
                  <TableCell>₦{product.selling_price.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleQuantityChange(product.id, product.quantity - 1)
                        }
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        value={product.quantity}
                        className="w-12 text-center"
                        onChange={(e) =>
                          handleQuantityChange(
                            product.id,
                            parseInt(e.target.value) || 1
                          )
                        }
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleQuantityChange(product.id, product.quantity + 1)
                        }
                      >
                        +
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    ₦{(product.selling_price * product.quantity).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Order Summary */}
        <div className="bg-muted/30 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {selectedItems.length === 0 ? (
            <>
              <p className="text-muted-foreground">No products selected</p>
              <div className="flex flex-col gap-2 mt-6">
                <Button variant="outline" onClick={handleDownloadCSV} className="hover:bg-black hover:text-white">
                  <Download className="mr-2 h-4 w-4" /> Download as CSV
                </Button>
                <Button variant="outline" onClick={handleDownloadPDF} className="hover:bg-black hover:text-white">
                  <FileText className="mr-2 h-4 w-4" /> Download Invoice
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₦{shipping.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-6">
                <Button variant="outline" onClick={handleDownloadCSV} className="hover:bg-black hover:text-white">
                  <Download className="mr-2 h-4 w-4" /> Download as CSV
                </Button>
                <Button variant="outline" onClick={handleDownloadPDF} className="hover:bg-black hover:text-white">
                  <FileText className="mr-2 h-4 w-4" /> Download Invoice
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
