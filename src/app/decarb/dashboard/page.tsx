"use client"
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { chainConfig } from '@/utils/Config/chainConfig'; // Adjust path as necessary
import StatsCard from '@/Components/Dashboard/overview/carbondetail';
import LearnCardsContainer from '@/Components/Dashboard/overview/learncontainer';
import ImageComponent from '@/Components/Dashboard/overview/ImageComponent';
import BuyCharComp from '@/Components/Dashboard/overview/BuyCharComp';
import DiscoverComp from '@/Components/Dashboard/overview/DiscoverComp';
import Image from 'next/image';

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

// Company contract address
const companyAddress = '0x002206D2FC332b4aBEEb344e343De6c119777B81';
const nctAddress = '0xF0a5bF1336372FdBc2C877bCcb03310D85e0BF81'; 
const tco2Address = '0xB297F730E741a822a426c737eCD0F7877A9a2c22'; 

const page = () => {
  const [companyData, setCompanyData] = useState<{ nct: string, tco2: string }>({ nct: '0', tco2: '0' });
  const [userData, setUserData] = useState<{ celo: string, nct: string, tco2: string, address: string }>({ celo: '0', nct: '0', tco2: '0', address: '' });
  
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        // Initialize Web3 with the RPC of your chain
        const web3 = new Web3(new Web3.providers.HttpProvider(chainConfig.rpcTarget));
        
        // Fetch Carbon Credits (NCT and TCO2) from company contract
        const nctContract = new web3.eth.Contract(erc20ABI, nctAddress);
        const tco2Contract = new web3.eth.Contract(erc20ABI, tco2Address);

        const nctBalance = await nctContract.methods.balanceOf(companyAddress).call();
        const tco2Balance = await tco2Contract.methods.balanceOf(companyAddress).call();

        setCompanyData({
          nct: web3.utils.fromWei(nctBalance, 'ether'), 
          tco2: web3.utils.fromWei(tco2Balance, 'ether') 
        });

      } catch (error) {
        console.error("Failed to fetch company data:", error);
      }
    };

    const fetchUserData = async () => {
      try {
        // Retrieve user's wallet address from local storage
        const userAddress = localStorage.getItem('walletAddress');
        if (!userAddress) {
          console.log("No wallet address found in local storage.");
          return;
        }

        // Initialize Web3 with the RPC of your chain
        const web3 = new Web3(new Web3.providers.HttpProvider(chainConfig.rpcTarget));

        // Fetch user's Celo balance
        const celoBalance = await web3.eth.getBalance(userAddress);

        // Fetch user's NCT and TCO2 balances
        const nctContract = new web3.eth.Contract(erc20ABI, nctAddress);
        const tco2Contract = new web3.eth.Contract(erc20ABI, tco2Address);

        const nctBalance = await nctContract.methods.balanceOf(userAddress).call();
        const tco2Balance = await tco2Contract.methods.balanceOf(userAddress).call();

        // Convert balances to more readable format (Ether for Celo, Wei for tokens)
        setUserData({
          celo: web3.utils.fromWei(celoBalance, 'ether'),
          nct: web3.utils.fromWei(nctBalance, 'ether'),
          tco2: web3.utils.fromWei(tco2Balance, 'ether'),
          address: userAddress
        });

        // Log the user data for debugging
        console.log(`User Address: ${userAddress}`);
        console.log(`User Celo Balance: ${web3.utils.fromWei(celoBalance, 'ether')} CELO`);
        console.log(`User NCT Balance: ${web3.utils.fromWei(nctBalance, 'ether')} NCT`);
        console.log(`User TCO2 Balance: ${web3.utils.fromWei(tco2Balance, 'ether')} TCO2`);

      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchCompanyData();
    fetchUserData();
  }, []);

  const totalCarbonAssets = parseFloat(companyData.nct) + parseFloat(companyData.tco2);
  const totalLiquidity = (parseFloat(companyData.nct) * 4000) + (parseFloat(companyData.tco2) * 2500);
  const totalOffsetEmissions = totalCarbonAssets * 1000; 

  const statsData = [
    { value: totalCarbonAssets.toFixed(2), label: "Total Carbon Assets" },
    { value: `₹${totalLiquidity.toFixed(2)}`, label: "Total Liquidity" },
    { value: `${totalOffsetEmissions.toFixed(2)} kg`, label: "Total Carbon Emissions Offset" },
  ];

  return (
    <div className="flex-1 flex flex-col h-screen p-6 w-full">
      <div className='flex items-center justify-between'>
        <h1 className="text-2xl font-semibold pl-3 pt-2">Welcome to Decarb</h1>
        <div className="overflow-hidden rounded-full w-12 h-12">
          <Image src="/images/greenbg.png" alt="image" height={48} width={48} className='object-cover w-full h-full'/>
        </div> 
      </div>

      <div className="w-full mb-6 mt-5">
        <StatsCard stats={statsData} />
      </div>

      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 w-full mx-auto h-full">
        <div className='flex flex-col justify-between'>
          <DiscoverComp/>
          <ImageComponent />
        </div>
        <div><BuyCharComp /></div>
      </div>
      <div className=" w-auto">
        <LearnCardsContainer />
      </div>
    </div>
  );
};

export default page;
