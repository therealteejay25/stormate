"use client"

import React, { useEffect, useState } from "react"
import PageHeader from "../components/page-header"
import { supabase } from "@/lib/client"
import { Product } from "./components/EditModal"
import ProductCard from "./components/ProductCard"
import EditModal from "./components/EditModal"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Loader, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import Loader from "@/components/ui/loader"

const Page = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  const handleSave = async (updated: Product) => {
    const { error } = await supabase
      .from("products")
      .update({
        name: updated.name,
        stock: updated.stock,
        cost_price: updated.cost_price,
        selling_price: updated.selling_price,
      })
      .eq("id", updated.id)

    if (!error) {
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      setEditingProduct(null)
    } else {
      console.error(error)
    }
  }

  return (
    <div>
      <PageHeader text="Your Products." />
      <div className="flex justify-end my-4">
        <div>
          <Input placeholder="" />
        </div>
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={20} /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            {editingProduct && (
              <EditModal product={editingProduct} onSave={handleSave} />
            )}
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex h-[30rem] w-full items-center justify-center">
          <div className='animate-spin'>
          <Loader />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.selling_price}
              stock={product.stock}
              onEdit={() => setEditingProduct(product)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Page
