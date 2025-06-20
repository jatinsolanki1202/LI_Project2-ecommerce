import React from 'react'
import heroImg from '../assets/images/iqoo13HeroImg3.jpg'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='flex flex-col h-[75vh] justify-between sm:flex-row border border-gray-400 bg-white mt-5'>
      {/* Hero Left Side */}
      <div className='w-full sm:w-1/3 flex items-center justify-center py-10 sm:py-0'>
        <div className='text-[#414141]'>
          <div className='flex items-center gap-2'>
            <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
            <p className='font-medium text-sm md:text-base uppercase'>Our Best Seller</p>
          </div>

          <h1 className='text-3xl sm:py-3 lg:text-5xl leading-relaxed uppercase'>Latest Arrivals</h1>
          <div className='flex gap-2 items-center'>
            <Link to={'/product/150002'} className='font-semibold text-sm md:text-base uppercase'>Shop Now</Link>
            <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
          </div>
        </div>
      </div>

      {/* Hero Right Side */}
      <img src={heroImg} className='w-full sm:w-2/3 h-full object-cover' />
    </div>
  )
}

export default Hero