import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAddress, useContract } from '@thirdweb-dev/react';
import { FormEvent } from 'react';
import Header from '../components/layout-components/Header';

type Props = {};

function AddItem({}: Props) {
  const [preview, setPreview] = useState<string>();
  const [image, setImage] = useState<File>();
  const router = useRouter();

  const { contract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    'nft-collection'
  );

  const mintNft = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!contract || !address) return;

    if (!image) {
      alert('Please select an image');
      return;
    }

    const target = e.target as typeof e.target & {
      name: { value: string };
      description: { value: string };
    };

    const metadata = {
      name: target.name.value,
      description: target.description.value,
      image: image,
    };

    try {
      const tx = await contract.mintTo(address, metadata);

      const reciept = tx.receipt; //the transaction reciept
      const tokenId = tx.id;
      const nft = await tx.data();

      console.log(reciept, tokenId, nft);
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  const address = useAddress();

  console.log(contract);
  return (
    <>
      <Header />
      <section className='max-w-6xl mx-auto px-6 md:px-10 py-10 border'>
        <section className='mb-6'>
          <h1 className='text-3xl md:text-4xl font-bold'>
            Add an item to the marketplace
          </h1>
          <h2 className='text-xl font-semibold pt-4'>Item Details</h2>
          <div>
            By adding an item to the marketplace, you're essentially Minting an
            NFT of the item into your wallet which we can then list for sale.
          </div>
        </section>
        <section className='flex flex-col md:flex-row md:gap-6 items-center'>
          <div>
            <img
              className='border w-80 h-80 object-contain'
              src={preview || 'https://links.papareact.com/ucj'}
              alt='back up image'
            />
          </div>
          <form
            onSubmit={mintNft}
            className='mt-6 md:mt-0 flex flex-col flex-1 gap-3 pb-12'
          >
            <div className='form-group gap-2 flex flex-col'>
              <label className='font-semibold' htmlFor='NFT-name'>
                Name of item
              </label>
              <input
                id='NFT-name'
                name='name'
                className='custom--input px-4 py-3 border outline-none text-gray rounded-lg'
                placeholder='Name of item...'
                type='text'
              />
            </div>
            <div className='form-group gap-2 flex flex-col'>
              <label className='font-semibold' htmlFor='description'>
                Description
              </label>
              <input
                id='description'
                name='description'
                className='custom--input px-4 py-3 border outline-none text-gray rounded-lg'
                placeholder='Enter Description...'
                type='text'
              />
            </div>
            <div className='form-group gap-2 flex flex-col'>
              <label className='font-semibold' htmlFor='file'>
                Image of the item
              </label>
              <input
                id='file'
                name='file'
                type='file'
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setPreview(URL.createObjectURL(e.target.files[0]));
                    setImage(e.target.files[0]);
                  }
                }}
              />
            </div>
            <button
              className='btn--colors_regular_blue rounded-lg px-10 py-3 mt-6 w-full mx-auto outline-none'
              type='submit'
            >
              Add/Mint
            </button>
          </form>
        </section>
      </section>
    </>
  );
}

export default AddItem;
