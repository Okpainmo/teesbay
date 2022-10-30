import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/layout-components/Header';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import {
  useContract,
  useNetwork,
  useNetworkMismatch,
  useMakeBid,
  useOffers,
  useMakeOffer,
  useBuyNow,
  MediaRenderer,
  useAddress,
  useListing,
} from '@thirdweb-dev/react';
import { ListingType, NATIVE_TOKENS } from '@thirdweb-dev/sdk';
import Countdown from 'react-countdown';
import network from '../../utils/network';
import { ethers } from 'ethers';

type Props = {};

function ListingPage({}: Props) {
  const router = useRouter();
  const { listingId } = router.query as { listingId: string };
  const [bidAmount, setBidAmount] = useState('');
  const [, switchNetwork] = useNetwork();
  const networkMismatch = useNetworkMismatch();

  const [minimumNextBid, setMinimumNextBid] = useState<{
    displayValue: string;
    symbol: string;
  }>();

  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    'marketplace'
  );

  const { mutate: makeBid } = useMakeBid(contract);

  const { data: offers } = useOffers(contract, listingId);

  const { mutate: makeOffer } = useMakeOffer(contract);

  const { mutate: buyNow } = useBuyNow(contract);

  const { data: listing, isLoading, error } = useListing(contract, listingId);

  useEffect(() => {
    if (!listingId || !contract || !listing) return;

    if (listing.type === ListingType.Auction) {
      fetchMinNextBid();
    }
  }, [listingId, listing, contract]);

  console.log(minimumNextBid);

  const fetchMinNextBid = async () => {
    if (!listingId || !contract) return;

    const { displayValue, symbol } = await contract.auction.getMinimumNextBid(
      listingId
    );

    setMinimumNextBid({
      displayValue: displayValue,
      symbol: symbol,
    });
  };

  const formatPlaceholder = () => {
    if (!listing) return;

    if (listing.type === ListingType.Direct) {
      return 'Enter Offer Amount';
    }

    if (listing.type === ListingType.Auction) {
      return Number(minimumNextBid?.displayValue) === 0
        ? 'Enter Bid Amount'
        : `${minimumNextBid?.displayValue} ${minimumNextBid?.symbol} or more`;
    }
  };

  const buyNft = async () => {
    if (networkMismatch) {
      switchNetwork && switchNetwork(network);
      return;
    }

    if (!listingId || !contract || !listing) return;

    await buyNow(
      {
        id: listingId,
        buyAmount: 1,
        type: listing.type,
      },
      {
        onSuccess(data, variables, context) {
          alert('NFT bought successfully');
          console.log('SUCCESS', data, variables, context);
          router.replace('/');
        },
        onError(error, variables, context) {
          alert('ERROR: NFT could not be bought');
          console.log('ERROR', error, variables);
        },
      }
    );
  };

  const createBidOrOffer = async () => {
    try {
      if (networkMismatch) {
        switchNetwork && switchNetwork(network);
        return;
      }

      //Direct listing

      if (listing?.type === ListingType.Direct) {
        if (
          listing.buyoutPrice.toString() ===
          ethers.utils.parseEther(bidAmount).toString()
        ) {
          console.log('Buyout Price met, buying NFT...');

          buyNft();
          return;
        }

        console.log('Buyout price not met, making offer...');
        await makeOffer(
          {
            quantity: 1,
            listingId,
            pricePerToken: bidAmount,
          },
          {
            onSuccess(data, variables, context) {
              alert('Offer made successfully');
              console.log('SUCCESS', data, variables, context);
              setBidAmount('');
            },
            onError(error, variables, context) {
              alert('ERROR: offer could not be made');
              console.log('ERROR', error, variables, context);
            },
          }
        );
      }

      // Auction Listing

      if (listing?.type === ListingType.Auction) {
        console.log('Making bid...');

        await makeBid(
          {
            listingId,
            bid: bidAmount,
          },
          {
            onSuccess(data, variables, context) {
              alert('Bid made successfully');
              console.log('SUCCESS', data, variables, context);
              setBidAmount('');
            },
            onError(error, variables, context) {
              alert('ERROR: Bid could not be made');
              console.log('ERROR', error, variables, context);
            },
          }
        );
      }
    } catch {
      console.error(error);
    }
  };
  if (isLoading) {
    <div>
      <Header />
      <div className='text-center animate-pulse text-blue-500'>
        <p>Loading Item...</p>
      </div>
    </div>;
  }

  if (!listing) {
    return (
      <>
        <Header />
        <div className='text-center animate-pulse text-blue-500'>
          {/* Listing not found, */}
          Please wait for some seconds items might be loading...
        </div>
        ;
      </>
    );
  }

  return (
    <main className='pb-16'>
      <Header />
      <section className='max-w-6xl mx-auto px-6 flex flex-col lg:flex-row lg:pr-10 lg:gap-8'>
        <div className='p-10 border mx-auto lg:mx-0 max-w-md lg:max-w-xl'>
          <MediaRenderer src={listing.asset.image} />
        </div>
        <section className='pt-4 lg:pt-0'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-xl font-bold'>{listing.asset.name}</h1>
            <p>{listing.asset.description}</p>
            <p className='flex items-center text-xs sm:text-base'>
              <UserCircleIcon className='h-5 pr-1' />
              <span className='font-bold pr-2'>Seller: </span>
              {listing.sellerAddress}
            </p>
          </div>

          <div className='flex justify-between mt-6 items-center'>
            <span className='font-bold'>Listing Type:</span>
            <span>
              {listing.type === ListingType.Direct
                ? 'Direct Listing'
                : 'Auction Listing'}
            </span>
          </div>
          <div className='flex justify-between mt-2 items-center'>
            <span className='font-bold'>Buy It Now Price:</span>
            <span className='text-2xl'>
              {listing.buyoutCurrencyValuePerToken.displayValue}{' '}
              {listing.buyoutCurrencyValuePerToken.symbol}
            </span>
          </div>

          <div className='flex flex-row-reverse my-6'>
            <button
              onClick={buyNft}
              className='btn--colors_regular_blue rounded-full px-10 py-3 w-[150px]'
            >
              Buy Now
            </button>
          </div>

          {/* {If DIRECT, show offers here...} */}

          <div className='flex flex-col'>
            <hr className='w-full' />
            <h3 className='font-bold mt-4 text-xl'>
              {listing.type === ListingType.Direct
                ? 'Make an Offer'
                : 'Bid on this Auction'}
            </h3>
            {listing.type === ListingType.Auction && (
              <div className='mt-3 flex flex-col gap-2'>
                <div className='flex justify-between items-center'>
                  <span className='font-bold'>Current Minimum Bid</span>
                  <span>
                    {minimumNextBid?.displayValue} {minimumNextBid?.symbol}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='font-bold'>Time Remaining</span>
                  <Countdown
                    date={
                      Number(listing.endTimeInEpochSeconds.toString()) * 1000
                    }
                  />
                </div>
              </div>
            )}
            <div className='flex justify-between items-center mt-4'>
              <input
                className='bg--secondary px-4 rounded-lg py-3 w-[200px] outline-none'
                type='text'
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={formatPlaceholder()}
              />
              <div className='flex flex-row-reverse'>
                <button
                  onClick={createBidOrOffer}
                  className='btn--colors_regular_red rounded-full px-10 py-3 w-[150px]'
                >
                  {listing.type === ListingType.Direct ? 'Offer' : 'Bid'}
                </button>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default ListingPage;
