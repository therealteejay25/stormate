"use client"
import React, { useEffect, useState } from 'react'
import PageHeader from '../components/page-header'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Plus } from 'lucide-react'
import ProductCard from '../components/product-card'
import { supabase } from '@/lib/client'

type Product = {
    id: string,
    name: string
    stock: number
    cost_price: number
    selling_price: number
}

const page = () => {

    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const { data, error } = await supabase.from('products').select("*")
            if (error) {
                console.log(error)
            } else if (Array.isArray(data)) {
                setProducts(data as Product[])
            }
        }

        fetchProducts();
    }, [])

    console.log(products);

  return (
    <div>
        <PageHeader text='Your Products.' />
        <div>
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger className='bg-gray-900 text-white text-sm py-[10px] my-6 px-5 ml-auto rounded-lg justify-center items-center flex gap-1'>
                        <Plus size={20} color='#fff' />
                        Add Product
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem className='px-5'>
                            New Product
                        </DropdownMenuItem>
                        <DropdownMenuItem className='px-5'>
                            Existing Product
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className='grid grid-cols-1 gap-2 md:grid-cols-3'>
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        name={product.name}
                        price={product.selling_price}
                        stock={product.stock}
                    />
                ))}
            </div>
        </div>
    </div>
  )
}

export default page