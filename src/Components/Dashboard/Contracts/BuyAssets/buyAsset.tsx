'use client';
import { useState } from 'react';
import MyButton from '../../MyButton';
import { z } from 'zod';
import Image from 'next/image';
import Link from 'next/link';

const quantitySchema = z.number().min(1);

type BuyCharComponentProps = {
  walletAmount: number;
};

const BuyCharComponent: React.FC<BuyCharComponentProps> = ({ walletAmount }) => {
  const [state, setState] = useState({
    quantity: 0,
    price: 0,
    loading: false,
  });

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsedValue = parseFloat(value);
    if (!value || isNaN(parsedValue)) {
      setState((prev) => ({ ...prev, quantity: 0, price: 0 }));
      return;
    }

    const quantityValidation = quantitySchema.safeParse(parsedValue);
    if (quantityValidation.success) {
      setState((prev) => ({
        ...prev,
        quantity: parsedValue,
        price: parsedValue * 25,
      }));
    } else {
      console.error(quantityValidation.error.errors[0].message);
    }
  };

  const handleBuy = async () => {
    if (state.price > walletAmount) {
      alert('Insufficient funds in your wallet.');
      return;
    }

    // Simulate buy logic (you can replace this with an API call)
    alert('Purchase successful!');
    setState((prev) => ({ ...prev, quantity: 0, price: 0 }));
  };

  return (
    <div className="bg-blue-50 rounded-lg p-6 w-auto mx-auto shadow-md font-sans">
      <div className="flex justify-between">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">
          Choose the quantity you would like to buy
        </h2>
        <h2 className="text-sm font-semibold text-gray-700 mb-2">
          DeCarb BioChar Carbon Pool (CHAR)
        </h2>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <p className="text-sm font-medium text-gray-600 pr-2">Quantity:</p>
          <input
            id="quantity"
            type="text"
            value={state.quantity}
            onChange={handleQuantityChange}
            className="text-xl border pl-2 border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            disabled={state.loading}
          />
          <p className="pl-4 text-sm text-gray-600">
            Price:{' '}
            <span className="text-lg font-semibold text-gray-800">${state.price.toFixed(2)}</span>
          </p>
        </div>

        <div className="flex justify-end">
          <h1 className="text-3xl p-2 font-semibold">DCO2</h1>
          <Image
            src="/images/decarbtoken.png"
            alt="Token"
            width={48}
            height={48}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <p className="text-sm text-gray-600">
          Amount in Wallet:{' '}
          <span className="text-lg font-semibold text-indigo-600">${walletAmount.toFixed(2)}</span>
        </p>

        <div className="flex justify-end space-x-4">
          <Link href="/decarb/contracts">
            <MyButton text="BACK" variant="red" />
          </Link>
          <MyButton
            text="BUY CHAR"
            onClick={handleBuy}
            variant="green"
            disabled={state.loading || state.quantity === 0}
          />
        </div>
      </div>
    </div>
  );
};

export default BuyCharComponent;
