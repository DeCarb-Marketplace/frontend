"use client";
import { useState } from "react";
import MyButton from "../../MyButton";
import { z } from "zod";
import Image from "next/image";
import Link from "next/link";
import myServer from "@/utils/Axios/axios";

const quantitySchema = z.number().min(1).max(100);

type BuyCharComponentProps = {};

const BuyCharComponent: React.FC<BuyCharComponentProps> = () => {
  const [state, setState] = useState({
    quantity: 0,
    price: 0,
    loading: false,
  });

  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [buyAttempted, setBuyAttempted] = useState(false);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBuyAttempted(false);
    const value = e.target.value;
    const parsedValue = parseFloat(value);

    if (!value || isNaN(parsedValue)) {
      setState((prev) => ({ ...prev, quantity: 0, price: 0 }));
      setValidationMessage("Please enter a valid number.");
      return;
    }

    const quantityValidation = quantitySchema.safeParse(parsedValue);

    if (quantityValidation.success) {
      setState((prev) => ({
        ...prev,
        quantity: parsedValue,
        price: parsedValue * 1275, // Assuming each unit costs ₹25
      }));
      setValidationMessage(null);
    } else {
      setValidationMessage(
        parsedValue > 100
          ? "You can only purchase up to 100 units."
          : "Quantity must be at least 1."
      );
    }
  };

  const resetForm = () => {
    setState((prev) => ({ ...prev, loading: false }));
    setBuyAttempted(false);
  };

  const handleBuy = async () => {
    setBuyAttempted(true);

    if (state.quantity === 0) {
      setValidationMessage("Please enter a quantity before making a purchase.");
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));

    try {
      const amount = state.price;
      const apiKey = "rzp_test_74fvUBAvMzsdVl"; // Replace with actual key

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = async () => {
        console.log("Razorpay script loaded");
        const options = {
          key: apiKey,
          amount: amount * 100,
          currency: "INR",
          name: "DeCarb",
          description: `TCO2 Carbon Credits`,
          image: "/images/decarbtoken.png",
          theme: {
            color: "#2F4F4F",
          },
          handler: async function (response: any) {
            console.log("Payment response:", response);
            try {
              // Send request to backend to confirm purchase after payment success
              const backendResponse = await myServer.get('/buy/buyTest', {
                amount: amount,
                quantity: state.quantity,
                paymentId: response.razorpay_payment_id
              });
              console.log("Backend response status:", backendResponse.status);
              console.log("Backend response data:", backendResponse.data);

              if (backendResponse.status === 200) {
                alert("Purchase successful!");
                setState((prev) => ({ ...prev, quantity: 0, price: 0, loading: false }));
                setBuyAttempted(false);
                setValidationMessage(null);
              } else {
                alert("Payment was successful but there was an issue with the purchase. Please try again.");
                resetForm();
              }
            } catch (error) {
              console.error("Error processing purchase:", error);
              alert("Payment was successful but there was an error processing your order. Please try again.");
              resetForm();
            }
          },
          modal: {
            ondismiss: function () {
              console.log("Payment window closed");
              resetForm();
            }
          }
        };

        const razorpayInstance = new (window as any).Razorpay(options);
        razorpayInstance.open();
      };

      document.body.appendChild(script);
    } catch (error) {
      console.error("Error initiating payment:", error);
      resetForm();
    }
  };

  return (
    <div className="bg-blue-50 rounded-lg p-6 w-auto mx-auto shadow-md font-sans">
      <div className="flex justify-between">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">
          Choose the quantity you would like to buy (Max: 100)
        </h2>
        <h2 className="text-sm font-semibold text-gray-700 mb-2">
          DeCarb BioChar Carbon Pool (CHAR)
        </h2>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <div className="flex items-center">
            <p className="text-sm font-medium text-gray-600 pt-4 pr-2">Quantity:</p>
            <input
              id="quantity"
              type="text"
              value={state.quantity === 0 ? "" : state.quantity}
              onFocus={() => {
                if (!buyAttempted) {
                  setState((prev) => ({ ...prev, quantity: 0 }));
                  setValidationMessage(null);
                }
              }}
              onChange={handleQuantityChange}
              className={`text-xl border pl-2 border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 ${buyAttempted && state.quantity === 0 ? 'border-red-500' : ''
                }`}
              disabled={state.loading}
            />
            <p className="pl-4 text-sm text-gray-600">
              Price:{" "}
              <span className="text-lg font-semibold text-gray-800">
                ₹{state.price.toFixed(2)}
              </span>
            </p>
          </div>
          {/* Reserve space for the validation message */}
          <div style={{ minHeight: "24px" }}>
            {validationMessage && (
              <p className="text-sm text-red-500 mt-2">{validationMessage}</p>
            )}
          </div>
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

      <div className="flex justify-end space-x-4">
        <Link href="/decarb/contracts">
          <MyButton text="BACK" variant="red" />
        </Link>
        <MyButton
          text="BUY CHAR"
          onClick={handleBuy}
          variant="green"
          disabled={state.loading}
        />
      </div>
    </div>
  );
};

export default BuyCharComponent;