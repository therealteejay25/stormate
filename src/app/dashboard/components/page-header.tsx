import { Bell } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const PageHeader = ({text}:{text: string}) => {
    
  return (
    <div className='flex w-full justify-between items-center bg-white px-6 '>
    <h1 className='text-2xl font-semibold text-gray-900'>{text}</h1>
    <div className='flex items-center gap-2 justify-center'>
        <Bell size={24} color='#101828' />
        <div className="h-8 w-[2.5px] bg-gray-200 rounded-full"></div>
        <Image src='/placeholder-image.jpg' className='rounded-lg'  alt='User Image' height={32} width={32} />
    </div>
</div>
  )
}

export default PageHeader