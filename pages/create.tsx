import React, { useState, FormEvent } from 'react';
import {
  useAddress,
  useContract,
  MediaRenderer,
  useNetwork,
  useNetworkMismatch,
  useOwnedNFTs,
  useCreateAuctionListing,
  useCreateDirectListing,
} from '@thirdweb-dev/react';
import {
  ChainId,
  NFT,
  NATIVE_TOKENS,
  NATIVE_TOKEN_ADDRESS,
} from '@thirdweb-dev/sdk';
import network from '../utils/network';

import Header from '../components/layout-components/Header';
import { useRouter } from 'next/router';

type Props = {};

function Create({}: Props) {
  const router = useRouter();
  const [selectedNft, setSelectedNft] = useState<NFT>();

  const address = useAddress();
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    'marketplace'
  );

  const { contract: collectionContract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    'nft-collection'
  );

  const ownedNfts = useOwnedNFTs(collectionContract, address);

  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  const {
    mutate: createDirectListing,
    isLoading,
    error,
  } = useCreateDirectListing(contract);

  const {
    mutate: createAuctionListing,
    isLoading: isLoadingDirect,
    error: errorDirect,
  } = useCreateAuctionListing(contract);

  const handleCreateListing = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (networkMismatch) {
      switchNetwork && switchNetwork(network);
      return;
    }

    if (!selectedNft) return;

    const target = e.target as typeof e.target & {
      elements: { listingType: { value: string }; price: { value: string } };
    };

    const { listingType, price } = target.elements;

    if (listingType.value === 'directListing') {
      createDirectListing(
        {
          assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
          tokenId: selectedNft.metadata.id,
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          listingDurationInSeconds: 60 * 60 * 24 * 7, // 1 week
          quantity: 1,
          buyoutPricePerToken: price.value,
          startTimestamp: new Date(),
        },
        {
          onSuccess(data, variables, context) {
            console.log('SUCCESS: ', data, variables, context);
            router.push('/');
          },
          onError(error, variables, context) {
            console.log('ERROR: ', error, variables, context);
          },
        }
      );
    }

    if (listingType.value === 'auctionListing') {
      createAuctionListing(
        {
          assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
          buyoutPricePerToken: price.value,
          tokenId: selectedNft.metadata.id,
          startTimestamp: new Date(),
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          listingDurationInSeconds: 60 * 60 * 24 * 7, // 1 week
          quantity: 1,
          reservePricePerToken: 0,
        },
        {
          onSuccess(data, variables, context) {
            console.log('SUCCESS: ', data, variables, context);
            router.push('/');
          },
          onError(error, variables, context) {
            console.log('ERROR: ', error, variables, context);
          },
        }
      );
    }
  };

  console.log(selectedNft);
  return (
    <main className='pb-10'>
      <Header />
      <section className='max-w-6xl mx-auto px-6 md:px-10 py-10 border'>
        <section className='mb-6'>
          <h1 className='text-3xl md:text-4xl font-bold'>
            Add an item to the marketplace
          </h1>
          <h2 className='text-xl font-semibold pt-4'>Item Details</h2>
          <hr className='my-3' />
          <p>
            Below you will find NFTs that you would like to sell. Click on any
            NFT to get started.
          </p>
        </section>
        <section className='flex overflow-x-scroll space-x-4 py-4 w-full px-3'>
          {ownedNfts?.data?.map((each) => {
            return (
              <>
                <div
                  className={`card bg--secondary px-3 py-8 border rounded-md sm:min-h-[300px] w-[250px] ${
                    each.metadata.id === selectedNft?.metadata.id
                      ? 'border-blue-500 scale-105 transition-all duration-300 ease-out'
                      : 'border-transparent'
                  }`}
                  key={each.metadata.id}
                  onClick={() => setSelectedNft(each)}
                >
                  <div className='flex-1 flex flex-col pb-3 items-center w-full'>
                    <MediaRenderer
                      className='w-full rounded-lg'
                      src={each.metadata.image}
                    />
                  </div>
                  <div className='mt-3'>
                    <h2 className='text-lg truncate font-bold py-1'>
                      {each.metadata.name}
                    </h2>
                    <p className='truncate text-sm'>
                      {each.metadata.description}
                    </p>
                  </div>
                </div>
              </>
            );
          })}
        </section>
        <section className='mt-3'>
          {selectedNft && (
            <form className='flex flex-col py-3' onSubmit={handleCreateListing}>
              <div className='form-group flex justify-between items-center mt-3'>
                <label className=' font-semibold' htmlFor='direct-listing'>
                  Direct Listing / Fixed Price
                </label>
                <input type='radio' name='listingType' value='directListing' />
              </div>
              <div className='form-group flex justify-between items-center mt-3'>
                <label htmlFor='direct-listing' className='font-semibold'>
                  Auction
                </label>
                <input type='radio' name='listingType' value='auctionListing' />
              </div>
              <div className='form-group flex justify-between items-center mt-3'>
                <label className='font-semibold' htmlFor='price'>
                  Price
                </label>
                <input
                  id='price'
                  name='price'
                  className='custom--input w-[200px] bg--secondary px-4 py-3 border outline-none text--gray rounded-lg'
                  placeholder='0.05'
                  type='text'
                />
              </div>
              <button
                className='btn--colors_regular_blue rounded-lg px-10 w-full py-3 mt-6 mx-auto outline-none'
                type='submit'
              >
                Create Listing
              </button>
            </form>
          )}
        </section>
      </section>
    </main>
  );
}

export default Create;
