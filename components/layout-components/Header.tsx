import React from 'react';
import TopMostNav from './TopMostNav';
import MidNav from './MidNav';
import CategoriesNav from './CategoriesNav';

type Props = {};

function Header({}: Props) {
  return (
    <header className='max-w-6xl mx-auto py-6 p-3'>
      <TopMostNav />
      <MidNav />
      <CategoriesNav />
    </header>
  );
}

export default Header;
