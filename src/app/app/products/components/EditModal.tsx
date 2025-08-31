"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ProductSchema } from "@/lib/validations/ProductSchema"
import { useSession } from "next-auth/react"

export interface Product {
  id: string
  name: string
  stock: number
  cost_price: number
  selling_price: number
}

interface EditModalProps {
  product: Product
  onSave: (updated: Product & { created_by: string }) => void
}

const EditModal = ({ product, onSave }: EditModalProps) => {
  const { data: session } = useSession()

  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: product.name,
      costPrice: product.cost_price,
      sellingPrice: product.selling_price,
      stock: product.stock,
    },
  })

  const submit = (data: z.infer<typeof ProductSchema>) => {
    if (!session?.user?.id) {
      console.error("No user logged in")
      return
    }

    onSave({
      ...product,
      name: data.name,
      cost_price: data.costPrice,
      selling_price: data.sellingPrice,
      stock: data.stock,
      created_by: session.user.id, // ✅ now always safe
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
                <Input type="number" {...field} />
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
                <Input type="number" {...field} />
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
                <Input type="number" {...field} />
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
