"use client";
import React from "react";
import MyButton from "../../MyButton";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import myServer from "@/utils/Axios/axios";

const SellAsset: React.FC<{
  totalQuantity: number;
  totalPrice: number;
  selectedCount: number;
  selectedItems: any[]; // Add this prop
}> = ({ totalQuantity = 0, totalPrice = 0, selectedCount = 0, selectedItems = [] }) => {


  const router = useRouter();

  const handleSell = async () => {
    // Retrieve encrypted private key
    const encryptedPrivateKey = window.localStorage.getItem("encryptedPrivateKey");
    const data = {
      quantity: selectedItems[0].selectedQuantity,
      contractAddress: selectedItems[0].id,
      encryptedPrivateKey: encryptedPrivateKey,
    };
    console.log("Data:", data);
    const response = await myServer.post('/sell/sellTransfer', data);
    console.log("Response:", response);

    if (response.status === 200) {
      alert('Sell successful Transaction Hash: ' + response.data.transactionHash);
    } else {
      console.error('Error:', response);
    }

    router.push("/decarb/contracts/sellassets");
  };


  return (
    <div className="bg-blue-50 rounded-lg p-6 shadow-md font-sans">
      <div className="flex justify-between">
        <h2 className="text-lg font-bold text-gray-700 mb-2">{selectedCount} Carbon Assets Selected</h2>
        <h2 className="text-sm font-semibold text-gray-700 mb-2">DeCarb BioChar Carbon Pool (CHAR)</h2>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <p className="text-md font-medium text-gray-600 pr-2">
            Quantity:{" "}
            <span className="text-lg font-bold text-gray-800">
              {totalQuantity || 0}
            </span>
          </p>

          <p className="text-md text-gray-600">
            Price:{" "}
            <span className="text-lg font-bold text-gray-800">
              {totalPrice ? `₹${totalPrice.toFixed(2)}` : "₹0.00"}
            </span>
          </p>

        </div>
        <div className="flex items-center">
          <h1 className="text-3xl p-2 font-semibold">DCO2</h1>
          <Image src="/images/decarbtoken.png" alt="Token" width={48} height={48} />
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <Link href="/decarb/contracts">
          <MyButton text="BACK" variant="red" />
        </Link>
        <MyButton text="SELL CHAR" onClick={handleSell} variant="yellow" />
      </div>
    </div>
  );
};

export default SellAsset;