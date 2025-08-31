"use client"

import React, { useEffect, useState } from "react"
import { supabase } from "@/lib/client"
import { Product } from "./components/EditModal"
import ProductCard from "./components/ProductCard"
import EditModal from "./components/EditModal"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Loader, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"

const Page = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Existing product modal state
  const [isExistingOpen, setIsExistingOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [newStock, setNewStock] = useState<number>(0)

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      const { data, error } = await supabase.from("products").select("*")
      if (error) console.error(error)
      else if (Array.isArray(data)) setProducts(data as Product[])
      setIsLoading(false)
    }
    fetchProducts()
  }, [])

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id)
    if (error) {
      console.error("Delete error:", error.message)
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== id))
    }
  }

  const handleSave = async (updated: Product) => {
    const { data, error } = await supabase
      .from("products")
      .update({
        name: updated.name,
        stock: updated.stock,
        cost_price: updated.cost_price,
        selling_price: updated.selling_price,
      })
      .eq("id", updated.id)
      .select()

    if (error) {
      console.error("Update error:", error.message)
    } else if (data && data.length > 0) {
      setProducts((prev) =>
        prev.map((p) => (p.id === updated.id ? data[0] : p))
      )
      setEditingProduct(null)
    } else {
      console.warn("No rows updated. Check if ID exists or RLS is blocking update.")
    }
  }

  const handleAddStock = async () => {
    if (!selectedProductId || newStock <= 0) return

    const product = products.find((p) => p.id === selectedProductId)
    if (!product) return

    const updatedStock = product.stock + newStock

    const { data, error } = await supabase
      .from("products")
      .update({ stock: updatedStock })
      .eq("id", selectedProductId)
      .select()

    if (error) {
      console.error("Add stock error:", error.message)
    } else if (data && data.length > 0) {
      setProducts((prev) =>
        prev.map((p) => (p.id === selectedProductId ? data[0] : p))
      )
      setIsExistingOpen(false)
      setSelectedProductId("")
      setNewStock(0)
    }
  }

  return (
    <div>
      <PageHeader text="Your Products." />
      <div className="flex justify-between my-4">
        <div>
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="mb-4"
          />
        </div>

        {/* Dropdown for Add Product */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus size={20} /> Add Product
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setEditingProduct({} as Product)}>
              New Product
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsExistingOpen(true)}>
              Existing Product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* New Product Modal */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent>
          {editingProduct && (
            <EditModal product={editingProduct} onSave={handleSave} />
          )}
        </DialogContent>
      </Dialog>

      {/* Existing Product Modal */}
      <Dialog open={isExistingOpen} onOpenChange={setIsExistingOpen}>
        <DialogContent>
          <h2 className="text-lg font-semibold mb-4">
            Update Existing Product Stock
          </h2>
          <Select onValueChange={(val) => setSelectedProductId(val)}>
            <SelectTrigger className="mb-4">
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Enter stock to add"
            value={newStock}
            onChange={(e) => setNewStock(Number(e.target.value))}
            className="mb-4"
          />

          <Button onClick={handleAddStock}>Add Stock</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Page
