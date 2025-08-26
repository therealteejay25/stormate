import { Bell } from 'lucide-react';
import PageHeader from './components/page-header'
import Image from 'next/image';
import React from 'react'

const page = () => {

    let time = ''
    const today = new Date
    const currentHour = today.getHours();

    const currentTime = () => {
        if (currentHour < 12) {
            time = "Morning"
        } else if (currentHour < 18) {
            time = "Afternoon"
        } else {
            time = 'Evening'
        }
    };

    currentTime();

  return (
    <div className='w-full h-full'>
       <PageHeader text={`Good ${time}, Tayo`} />
    </div>
  )
}

export default page