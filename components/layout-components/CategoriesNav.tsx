import React from 'react';

type Props = {};

function CategoriesNav({}: Props) {
  return (
    <nav className='py-4 text-[12px] flex w-full align-items justify-center gap-6'>
      <span>Home</span>
      <span>Electronics</span>
      <span>Computers</span>
      <span className='hidden sm:inline'>Video Games</span>
      <span className='hidden sm:inline'>Home & Garden</span>
      <span className='hidden md:inline'>Health & Beauty</span>
      <span className='hidden lg:inline'> Collectibles and Art</span>
      <span className='hidden lg:inline'>Books</span>
      <span className='hidden lg:inline'>Music</span>
      <span className='hidden xl:inline'>Deals</span>
      <span className='hidden xl:inline'>Others</span>
      <span>More</span>
    </nav>
  );
}

export default CategoriesNav;
