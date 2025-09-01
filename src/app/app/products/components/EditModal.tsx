"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export interface Product {
  id: string
  name: string
  stock: number
  cost_price: number
  selling_price: number
}

interface EditModalProps {
  product: Product
  onSave: (updated: Product) => void
}

type ProductFormValues = {
  name: string
  costPrice: number
  sellingPrice: number
  stock: number
}

const EditModal = ({ product, onSave }: EditModalProps) => {
  const form = useForm<ProductFormValues>({
    defaultValues: {
      name: product.name,
      costPrice: product.cost_price,
      sellingPrice: product.selling_price,
      stock: product.stock,
    },
  })

  const submit = (data: ProductFormValues) => {
    onSave({
      ...product,
      name: data.name,
      cost_price: Number(data.costPrice),
      selling_price: Number(data.sellingPrice),
      stock: Number(data.stock),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="costPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cost Price</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sellingPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Selling Price</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  )
}

export default EditModal
