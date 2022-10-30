import React from 'react';
import Link from 'next/link';
import {
  useActiveListings,
  useContract,
  MediaRenderer,
} from '@thirdweb-dev/react';
import { ListingType } from '@thirdweb-dev/sdk';
import Header from '../components/layout-components/Header';
// import Listings from "../components/Listings"

// type Props = {};

function Home() {
  // {}: Props
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    'marketplace'
  );

  const { data: listings, isLoading: loadingListings } =
    useActiveListings(contract);

  console.log(listings);

  return (
    <main className='pb-10'>
      <Header />
      <section className='pb-16 max-w-6xl px-6 mx-auto'>
        {loadingListings ? (
          <p className='text-center animate-pulse text-blue-500'>
            loading listings...
          </p>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-auto'>
            {listings?.map((each) => {
              return (
                <div key={each.id}>
                  <Link href={`/listing/${each.id}`}>
                    <div className='flex flex-col card hover:scale-105 transition-all duration-200 ease-out'>
                      <div className='bg--secondary px-3 py-8 border rounded-md sm:min-h-[350px]'>
                        <div className='flex-1 flex flex-col pb-3 items-center'>
                          <MediaRenderer
                            className='w-full rounded-lg'
                            src={each.asset.image}
                          />
                        </div>
                        <div className='mt-3'>
                          <h2 className='text-lg truncate font-bold py-1'>
                            {each.asset.name}
                          </h2>
                          <hr />
                          <p className='truncate text-sm my-2'>
                            {each.asset.description}
                          </p>
                          <div className='flex gap-1 text-[12px]'>
                            <span className='font-bold'>
                              {each.buyoutCurrencyValuePerToken.displayValue}
                            </span>
                            <span>
                              {each.buyoutCurrencyValuePerToken.symbol}
                            </span>
                          </div>
                          <section className='flex flex-row-reverse mt-4'>
                            <div
                              className={`flex gap-2 text-sm items-center justify-center px-3 py-2 rounded-md text-white ${
                                each.type === ListingType.Direct
                                  ? 'bg-blue-500'
                                  : 'bg-red-500'
                              }`}
                            >
                              <span>
                                {each.type === ListingType.Direct
                                  ? 'Buy Now'
                                  : 'Auction'}
                              </span>
                              <span>
                                {each.type === ListingType.Direct ? (
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
                                      d='M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z'
                                    />
                                  </svg>
                                ) : (
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
                                      d='M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z'
                                    />
                                  </svg>
                                )}
                              </span>
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;
