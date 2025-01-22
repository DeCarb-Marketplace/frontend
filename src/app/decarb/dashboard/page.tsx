"use client"
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { chainConfig } from '@/utils/Config/chainConfig'; // Adjust path as necessary
import StatsCard from "@/Components/Dashboard/Overview/carbondetail";
import LearnCardsContainer from "@/Components/Dashboard/Overview/learncontainer";

// ERC-20 ABI for balance checking
const erc20ABI = [
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  }
];

// Example contract addresses - Replace these with actual addresses from Celo Testnet
const nctAddress = '0xfb60a08855389F3c0A66b29aB9eFa911ed5cbCB5'; // NCT token address
const tco2ExampleAddress = '0xB297F730E741a822a426c737eCD0F7877A9a2c22'; // Example TCO2 token address, you might check for multiple

const page = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<string | null>(null);
  const [carbonCredits, setCarbonCredits] = useState<{ nct: string, tco2: string }>({ nct: '0', tco2: '0' });
  const statsData = [
    { value: "135", label: "Total Carbon Locked" },
    { value: "₹16000", label: "Total Liquidity" },
    { value: "42", label: "Total Carbon Retired" },
  ];

  useEffect(() => {
    const fetchWalletData = async () => {
      const storedWalletAddress = window.localStorage.getItem('walletAddress');
      if (storedWalletAddress) {
        setWalletAddress(storedWalletAddress);
        console.log("Wallet Address:", storedWalletAddress);

        try {
          // Initialize Web3 with the RPC of your chain
          const web3 = new Web3(new Web3.providers.HttpProvider(chainConfig.rpcTarget));

          // Fetch CELO balance
          const balanceWei = await web3.eth.getBalance(storedWalletAddress);
          const balanceCelo = web3.utils.fromWei(balanceWei, 'ether');
          setWalletBalance(balanceCelo);
          console.log("Wallet Balance:", balanceCelo, "CELO");

          // Check for Carbon Credits (NCT and TCO2)
          const nctContract = new web3.eth.Contract(erc20ABI, nctAddress);
          const tco2Contract = new web3.eth.Contract(erc20ABI, tco2ExampleAddress); // Here you might want to check multiple TCO2 contracts

          const nctBalance = await nctContract.methods.balanceOf(storedWalletAddress).call();
          const tco2Balance = await tco2Contract.methods.balanceOf(storedWalletAddress).call();

          setCarbonCredits({
            nct: web3.utils.fromWei(nctBalance, 'ether'), // Assuming 18 decimals, adjust if different
            tco2: web3.utils.fromWei(tco2Balance, 'ether') // Same assumption for TCO2
          });

          console.log("NCT Carbon Credits:", web3.utils.fromWei(nctBalance, 'ether'));
          console.log("TCO2 Carbon Credits:", web3.utils.fromWei(tco2Balance, 'ether'));

        } catch (error) {
          console.error("Failed to fetch wallet data:", error);
        }
      }
    };

    fetchWalletData();
  }, []);

  return (
    <div className="flex-1 flex flex-col p-6 w-full">
      <h1 className="text-2xl font-semibold pl-3 pt-2">Overview</h1>
      <div className="w-full mb-6 mt-5">
        <StatsCard stats={statsData} />
      </div>
      <div className="absolute bottom-6 w-auto">
        <LearnCardsContainer />
      </div>
    </div>
  );
};

export default page;