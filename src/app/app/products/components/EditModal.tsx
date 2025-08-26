import React from 'react'
import { z } from 'zod'

const ProductSchema = z.object({
    name: z.string().min(2, {message: 'Prodcut name must be at least 2 characters.'}).max(40, {message: 'Prodcut name must be at most 40 characters.'})
})

const EditModal = () => {
  return (
    <div>EditModal</div>
  )
}

export default EditModal