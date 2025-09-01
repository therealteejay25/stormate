"use client"

import React, { useState } from "react"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export interface Product {
  id?: string
  name: string
  stock: number
  cost_price: number
  selling_price: number
}

export interface EditModalProps {
  product: Product
  onSave: (updated: Product) => Promise<void>
  isSaving: boolean
}

const EditModal: React.FC<EditModalProps> = ({ product, onSave, isSaving }) => {
  const [form, setForm] = useState<Product>(product)

  const handleChange = (field: keyof Product, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave(form)
  }

  return (
    <div>
      <DialogHeader>
        <DialogTitle>
          {form.id ? "Edit Product" : "Add New Product"}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <Input
          type="text"
          placeholder="Product name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <Input
          type="number"
          placeholder="Cost price"
          value={form.cost_price}
          onChange={(e) => handleChange("cost_price", Number(e.target.value))}
        />

        <Input
          type="number"
          placeholder="Selling price"
          value={form.selling_price}
          onChange={(e) => handleChange("selling_price", Number(e.target.value))}
        />

        <Input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => handleChange("stock", Number(e.target.value))}
        />

        <Button type="submit" disabled={isSaving} className="w-full">
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </form>
    </div>
  )
}

export default EditModal
