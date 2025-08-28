import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DotIcon, Menu, Package2, PenBoxIcon, TrashIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

type CardData = {
    name: string
    price: number
    stock: number
    onEdit: () => void
    handleDelete: () => void
}

const ProductCard = ({name, price, stock, onEdit, handleDelete}: CardData) => {
  return (
    <div className='bg-white shadow justify-between transition-all duration-300 shadow-gray-100 border border-gray-50 flex items-center gap-3 rounded-xl p-3 px-5'>
        {/* <div className='bg-gray-100 h-16 w-16 flex items-center justify-center rounded-lg'>
            <Package2 size={36} color='#6a7282' />
        </div> */}
        <div className='flex flex-col gap-2'>
            <h3 className='text-lg font-medium'>{name}</h3>
            <div className='flex items-center gap-2'>
                <p className='text-gray-600'>₦ {price}</p>
                {stock < 10 && (
                    <div className='text-xs p-[6px] px-3  rounded-full bg-orange-100 text-orange-500'>
                    In Stock: {stock}
                </div>
                )}
                {stock > 10 && (
                    <div className='text-xs p-[6px] px-3  rounded-full bg-green-100 text-green-500'>
                    In Stock: {stock}
                </div>
                )}
                {stock === 0 && (
                    <div className='text-xs p-[6px] px-3  rounded-full bg-red-100 text-red-500'>
                   Out of Stock
                </div>
                )}
            </div>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger>
            <Image src='/menu.svg' alt='Menu Icon' height={28}  width={28}/>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={onEdit}>
                    <PenBoxIcon />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete}>
                    <TrashIcon/>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  )
}

export default ProductCard