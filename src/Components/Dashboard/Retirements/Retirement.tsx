"use client"
import React from 'react';
import { useRouter } from 'next/navigation';

interface RetirementProps {
  date: Date;
  quantity: number;
  project: string;
  price: number;
}

const Retirement: React.FC<RetirementProps> = ({ date, quantity, project, price }) => {
  const router = useRouter();
  
  const handleIconClick = () => {
    const certificateData = {
      date: "21-02-2025",
      amount: quantity.toString(),
      project: project,
      retiredBy: "Bll",
      beneficiary: "DeCarb",
      country: "Congo",
      tokenId: "TCO2-VCS-1052-2012",
      vcsId: "1052",
      vintage: "2012",
      methodology: "VM0011",
      transactionHash: "0xadf4e3f7476af990f5328fdf53a5f20205853ad5f7ce811b22",
      tokenContract: "0x2b97730e74a1a82a426c73ecdf787a7a2c22"
    };

    router.push(`/decarb/certificate?data=${encodeURIComponent(JSON.stringify(certificateData))}`);
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-purple-100 rounded-lg shadow-sm">
      <div className="text-sm font-medium text-gray-800">{date.toLocaleDateString()}</div>
      <div className="text-sm font-medium text-gray-800">{quantity.toFixed(3)}</div>
      <div className="text-sm font-medium text-gray-800">{project}</div>
      <div className="text-sm font-medium text-gray-800">{price.toFixed(3)}</div>
      <div className="flex items-center">
        <div 
          className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center cursor-pointer hover:bg-blue-300 transition-colors"
          onClick={handleIconClick}
          role="button"
          aria-label="View certificate"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-blue-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4C7 4 4 7 4 12s3 8 8 8 8-3 8-8-3-8-8-8zm0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Retirement;
