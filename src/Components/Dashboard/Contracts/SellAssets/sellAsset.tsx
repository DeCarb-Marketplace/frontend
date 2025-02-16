"use client";
import { useState } from "react";
import React from "react";
import MyButton from "../../MyButton";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import myServer from "@/utils/Axios/axios";
import { Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import TransactionConfirmationModal from '@/Components/confirm/confirmTransaction';

// Loading Overlay Component
const LoadingOverlay = () => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/50 backdrop-blur-xl">
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-10 shadow-2xl max-w-md w-full border border-white/20">
      <div className="flex flex-col items-center space-y-8">
        <div className="relative">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-800/20 animate-pulse"></div>
          <div className="relative w-20 h-20">
            <Loader2 className="w-20 h-20 text-emerald-800 animate-spin" />
          </div>
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-emerald-900">
            Processing Your Sale
          </h2>
          <p className="text-emerald-700 font-medium">
            Securing your transaction on the blockchain
          </p>
          <p className="text-red-500 font-semibold animate-pulse">
            Please do not refresh or close this page
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-emerald-800 h-2 rounded-full animate-[progress_5s_linear]"
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </div>
  </div>
);

const SellAsset: React.FC<{
  totalQuantity: number;
  totalPrice: number;
  selectedCount: number;
  selectedItems: any[];
}> = ({
  totalQuantity = 0,
  totalPrice = 0,
  selectedCount = 0,
  selectedItems = [],
}) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const isQuantitySelected = selectedItems[0]?.selectedQuantity > 0;

  const handleSell = async () => {
    setShowModal(false);

    // Check if quantity is 0
    if (
      !selectedItems[0]?.selectedQuantity ||
      selectedItems[0]?.selectedQuantity <= 0
    ) {
      toast.error("Cannot sell 0 assets. Please select a valid quantity.");
      return;
    }

    setLoading(true);

    try {
      const encryptedPrivateKey = window.localStorage.getItem(
        "encryptedPrivateKey"
      );
      const data = {
        quantity: selectedItems[0]?.selectedQuantity,
        contractAddress: selectedItems[0]?.id,
        encryptedPrivateKey: encryptedPrivateKey,
      };

      console.log("Data:", data);
      const response = await myServer.post("/sell/sellTransfer", data);
      console.log("Response:", response);

      if (response.status === 200) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        toast.success(
          "Sell successful! Transaction Hash: " + response.data.transactionHash,
          {
            style: { maxWidth: "300px", fontSize: "14px" },
          }
        );
      } else {
        console.error("Error:", response);
      }
    } catch (error) {
      console.error("Sell transaction failed:", error);
      toast.error("Transaction failed. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }

    router.push("/decarb/contracts/sellassets");
  };

  return (
    <div className={`relative ${loading ? "pointer-events-none" : ""}`}>
      <Toaster />
      {loading && <LoadingOverlay />}
      

      <div className="bg-blue-50 rounded-lg p-6 shadow-md font-sans">
        <div className="flex justify-between">
          <h2 className="text-lg font-bold text-gray-700 mb-2">
            {selectedCount} Carbon Assets Selected
          </h2>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            DeCarb BioChar Carbon Pool (CHAR)
          </h2>
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
            <Image
              src="/images/decarbtoken.png"
              alt="Token"
              width={48}
              height={48}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4">
  <Link href="/decarb/contracts">
    <MyButton text="BACK" variant="red" />
  </Link>
  <MyButton
    text="SELL CHAR"
    onClick={() => setShowModal(true)}
    variant="yellow"
    disabled={!isQuantitySelected}
  />
</div>

{showModal && (
  <TransactionConfirmationModal
    type="sell"
    onConfirm={handleSell}
    onCancel={() => setShowModal(false)}
    selectedItems={selectedItems}
  />
)}

      </div>
    </div>
  );
};

export default SellAsset;
