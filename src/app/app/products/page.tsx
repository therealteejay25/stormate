"use client"

import React, { useEffect, useState } from "react"
import PageHeader from "../components/page-header"
import { supabase } from "@/lib/client"
import { Product } from "./components/EditModal"
import { withAuth } from "@/hooks/useAuth"
import ProductCard from "./components/ProductCard"
import EditModal from "./components/EditModal"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Loader, Loader2, Plus } from "lucide-react"
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
  const [isExistingOpen, setIsExistingOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [newStock, setNewStock] = useState<number>(0)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isAddingStock, setIsAddingStock] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [userId, setUserId] = useState<string | null>(null)

  // Fetch session + products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      setErrorMessage("")
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError

        if (!session?.user?.id) {
          setUserId(null)
          setProducts([])
          return
        }

        setUserId(session.user.id)

        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("created_by", session.user.id)

        if (error) throw error
        setProducts(data || [])
      } catch (err: any) {
        console.error("Fetch error:", err)
        setErrorMessage(err.message || "Something went wrong.")
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const showMessage = (type: "error" | "success", message: string) => {
    if (type === "error") {
      setErrorMessage(message)
      setSuccessMessage("")
    } else {
      setSuccessMessage(message)
      setErrorMessage("")
    }
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(id)
    const { error } = await supabase.from("products").delete().eq("id", id)
    if (error) showMessage("error", error.message)
    else {
      setProducts((prev) => prev.filter((p) => p.id !== id))
      showMessage("success", "Product deleted successfully.")
    }
    setIsDeleting(null)
  }

  const handleSave = async (updated: Product) => {
    if (!userId) return
    setIsSaving(true)

    if (!updated.id) {
      // INSERT new product
      const { data, error } = await supabase
        .from("products")
        .insert({
          name: updated.name,
          stock: updated.stock,
          cost_price: updated.cost_price,
          selling_price: updated.selling_price,
          created_by: userId,
        })
        .select()

      if (error) showMessage("error", error.message)
      else if (data && data.length > 0) {
        setProducts((prev) => [...prev, data[0]])
        showMessage("success", "Product added successfully!")
        setEditingProduct(null)
      }
    } else {
      // UPDATE existing product
      const { data, error } = await supabase
        .from("products")
        .update({
          name: updated.name,
          stock: updated.stock,
          cost_price: updated.cost_price,
          selling_price: updated.selling_price,
        })
        .eq("id", updated.id)
        .eq("created_by", userId)
        .select()

      if (error) showMessage("error", error.message)
      else if (data && data.length > 0) {
        setProducts((prev) =>
          prev.map((p) => (p.id === updated.id ? data[0] : p))
        )
        showMessage("success", "Product updated successfully!")
        setEditingProduct(null)
      }
    }
    setIsSaving(false)
  }

  const handleAddStock = async () => {
    if (!userId || !selectedProductId || newStock <= 0) {
      showMessage("error", "Select a product and enter stock > 0")
      return
    }

    setIsAddingStock(true)
    const product = products.find((p) => p.id === selectedProductId)
    if (!product) return

    const updatedStock = product.stock + newStock
    const { data, error } = await supabase
      .from("products")
      .update({ stock: updatedStock })
      .eq("id", selectedProductId)
      .eq("created_by", userId)
      .select()

    if (error) showMessage("error", error.message)
    else if (data && data.length > 0) {
      setProducts((prev) =>
        prev.map((p) => (p.id === selectedProductId ? data[0] : p))
      )
      showMessage("success", "Stock updated successfully!")
      setIsExistingOpen(false)
      setSelectedProductId("")
      setNewStock(0)
    }

    setIsAddingStock(false)
  }

  return (
    <div>
      <PageHeader text="Your Products." />

      {errorMessage && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-700 text-sm">
          {successMessage}
        </div>
      )}

      <div className="flex justify-between my-4">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="mb-4 w-2xl"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus size={20} /> Add Product
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() =>
                setEditingProduct({
                  id: "",
                  name: "",
                  stock: 0,
                  cost_price: 0,
                  selling_price: 0,
                } as Product)
              }
            >
              New Product
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsExistingOpen(true)}>
              Existing Product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* New Product / Edit Modal */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent>
          {editingProduct && (
            <EditModal
              product={editingProduct}
              onSave={handleSave}
              isSaving={isSaving}
            />
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
  {products
    .filter((p): p is Product & { id: string } => !!p.id) // type guard
    .map((p) => (
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

          <Button onClick={handleAddStock} disabled={isAddingStock}>
            {isAddingStock && <Loader2 className="animate-spin mr-2" size={16} />}
            Add Stock
          </Button>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="flex h-[30rem] w-full items-center justify-center">
          <Loader className="animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-muted-foreground mt-10">
          No products found. Add one to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products
            .filter((p) =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                price={product.selling_price}
                stock={product.stock}
                onEdit={() => setEditingProduct(product)}
                handleDelete={() => handleDelete(product.id)}
                isDeleting={isDeleting === product.id}
              />
            ))}
        </div>
      )}
    </div>
  )
}

export default withAuth(Page)
