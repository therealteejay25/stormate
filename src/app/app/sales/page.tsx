"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { withAuth } from "@/hooks/useAuth"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

interface Product {
  id: string
  name: string
}

interface Sale {
  id: string
  product: Product
  quantity: number
  total_amount: number
  created_at: string
}

const SalesPage = () => {
  const [sales, setSales] = useState<Sale[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSales() {
      setLoading(true)

      const { data: salesData, error: salesError } = await supabase
        .from("sales")
        .select("id, quantity, total_amount, created_at, product:product_id(id, name)")
        .order("created_at", { ascending: false })

      if (!salesError && salesData) {
        // salesData is: { id, quantity, total_amount, created_at, product: [{ id, name }] }[]
        // We need to map product: [{id, name}] to product: {id, name}
        const normalizedSales: Sale[] = (salesData as any[]).map((sale) => ({
          id: sale.id,
          quantity: sale.quantity,
          total_amount: sale.total_amount,
          created_at: sale.created_at,
          product: Array.isArray(sale.product) ? sale.product[0] : sale.product,
        }))
        setSales(normalizedSales)
      }

      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("id, name")

      if (!productError && productData) setProducts(productData as Product[])

      setLoading(false)
    }

    fetchSales()
  }, [])

  // Group sales by date
  const grouped = sales.reduce<Record<string, Sale[]>>((acc, sale) => {
    const date = new Date(sale.created_at).toLocaleDateString()
    if (!acc[date]) acc[date] = []
    acc[date].push(sale)
    return acc
  }, {})

  if (loading) return <p className="p-6">Loading sales...</p>

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <h1 className="text-2xl font-bold mb-8">Sales Report</h1>

      {/* Product Select Dropdown */}
      <div className="mb-6">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            {products
              .filter((p) => p.id) // ignore undefined
              .map((p) => (
                <SelectItem key={p.id!} value={p.id!}>
                  {p.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {Object.keys(grouped).map((date) => (
        <Card key={date} className="mb-6">
          <CardHeader>
            <CardTitle>{date}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grouped[date].map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{sale.product?.name}</TableCell>
                    <TableCell>{sale.quantity}</TableCell>
                    <TableCell>₦{sale.total_amount.toLocaleString()}</TableCell>
                    <TableCell>
                      {new Date(sale.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Separator className="my-4" />
            <div className="flex justify-end font-semibold">
              Total: ₦
              {grouped[date]
                .reduce((sum, s) => sum + s.total_amount, 0)
                .toLocaleString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default withAuth(SalesPage)
