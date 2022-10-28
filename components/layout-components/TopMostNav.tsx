import React from 'react';
import dynamic from 'next/dynamic';
import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react';
import Link from 'next/link';

const DynamicThemeSwitcher = dynamic(() => import('../ThemeSwitcher'), {
  ssr: false,
});

type Props = {};

function TopMostNav({}: Props) {
  const connectWithMetamask = useMetamask();
  const disconnect = useDisconnect();
  const address = useAddress();

  return (
    <>
      <nav className='flex justify-between'>
        <section className='flex items-center gap-3 md:gap-6'>
          {address ? (
            <button
              className='btn--colors_regular_blue rounded p-2 sm:px-4 sm:py-3 w-[130px] sm:w-[170px] text-[10px] md:text-[12px]'
              onClick={disconnect}
            >
              Hi, {address.slice(0, 4) + '...' + address.slice(-4)}
            </button>
          ) : (
            <button
              className='btn--colors_regular_blue rounded p-2 sm:px-4 sm:py-3 w-[130px] sm:w-[170px] text-[10px] md:text-[12px]'
              onClick={connectWithMetamask}
            >
              Connect your wallet
            </button>
          )}
          <div className='flex gap-2 sm:gap-4'>
            <span className='header-link'>Daily Deals</span>
            <span className='header-link'>Help & Contact</span>
          </div>
        </section>
        <section className='flex gap-2 md:gap-4 items-center'>
          <span className='header-link'>Ship to</span>
          <span className='header-link'>Sell</span>
          <span className='header-link'>Watchlist</span>

          <Link
            href='add-item'
            className='text-[10px] md:text-[12px] flex gap-1 items-center hover:underline cursor-pointer hover:text-blue-500'
          >
            <span>Add to Inventory</span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-4 h-4'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M19.5 8.25l-7.5 7.5-7.5-7.5'
              />
            </svg>
          </Link>
          <button>
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
                d='M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0'
              />
            </svg>
          </button>
          <button>
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
                d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
              />
            </svg>
          </button>
          <DynamicThemeSwitcher />
        </section>
      </nav>
    </>
  );
}

export default TopMostNav;
