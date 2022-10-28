import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

type Props = {};

function MidNav({}: Props) {
  return (
    <>
      <nav className='flex gap-2 py-3 items-center justify-between'>
        <div className='flex gap-2 md:mr-4'>
          <div className='h-12 w-16 sm:w-28 md:w-44 cursor-pointer'>
            <Link href='/'>
              <Image
                className='w-full h-full object-contain'
                src='https://links.papareact.com/bdb'
                alt='teesbay-logo'
                width={100}
                height={100}
              />
            </Link>
          </div>

          <button className='hidden lg:flex items-center gap-2 w-20'>
            <span className='text-[12px]'>Shop By Category</span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-6 h-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M19.5 8.25l-7.5 7.5-7.5-7.5'
              />
            </svg>
          </button>
        </div>
        <div className='relative flex-1'>
          <input className='custom--input outline-none border-[2px] text-[10px] md:text-[12px] rounded p-2 md:py-3 pl-8 pr-4 flex gap-2 md:gap-6 items-center w-full flex-1' />
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-4 h-4 absolute top-[10px] left-[10px] md:top-[15px]'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
            />
          </svg>
        </div>

        <button className='btn--colors_regular_blue rounded text-center p-2 md:py-3 md:px-4 border-[2px] hidden md:inline text-[10px] md:text-[12px] min-w-[100px]'>
          Search
        </button>
        <Link href='/create'>
          <button className='btn--colors_bordered_blue rounded text-center p-2 md:py-3 md:px-4 border-[2px] text-[10px] md:text-[12px] min-w-[100px]'>
            List Item
          </button>
        </Link>
      </nav>
      <hr />
    </>
  );
}

export default MidNav;
