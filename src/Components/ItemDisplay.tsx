"use client";

import React from "react";

type ItemValue = string | number | { type: 'button'; label: string; onClick: () => void } | { type: 'input'; value: number | string; onChange: (value: string) => void };

type ItemDisplayProps = {
  items: Array<{ [key: string]: ItemValue }>;
  headers: string[];
  quantityMode?: 'display' | 'input';
  onQuantityChange?: (index: number, value: string) => void;
  bgColor?: string; // Background color for the table container (hex, RGB, etc.)
  itemBgColor?: string; // Single background color for all item boxes (hex, RGB, etc.)
};

// Ensure ItemDisplay is explicitly a React.FC
const ItemDisplay: React.FC<ItemDisplayProps> = ({ items, headers, quantityMode = 'display', onQuantityChange, bgColor, itemBgColor }) => {
  const renderValue = (value: ItemValue, header: string, index: number) => {
    if (typeof value === 'object') {
      if (value?.type === 'button') {
        return <button onClick={value.onClick} className="ml-2 text-blue-500 hover:underline">{value.label}</button>;
      } else if (value?.type === 'input' && quantityMode === 'input' && header === 'Quantity') {
        return (
          <input
            type="number"
            min="1"
            max="3"
            value={value.value?.toString() || '0'}
            onChange={(e) => value.onChange?.(e.target.value)}
            className="w-16 border border-gray-300 rounded px-2 py-1 text-center"
          />
        );
      }
    }
    // Handle undefined or null values
    return value?.toString() || '-';
  };

  // Convert hex colors to RGBA with specified opacity
  const parseColorWithOpacity = (hex: string | undefined, opacity: number = 1) => {
    if (!hex) return {};
    // Remove # if present and parse hex to RGB
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return { backgroundColor: `rgba(${r}, ${g}, ${b}, ${opacity})` };
  };

  const tableStyle = {
    ...parseColorWithOpacity(bgColor, 0.1), // Apply 10% opacity (0.1) to bgColor (#c2e8ef)
  };

  const itemStyle = {
    ...parseColorWithOpacity(itemBgColor), // Apply full opacity (1) to itemBgColor (#6bc6d9)
  };

  return (
    <div style={tableStyle} className="rounded-lg p-6 space-y-4">
      <div className="flex justify-between text-gray-500 font-bold text-sm border-b border-gray-300 pb-2">
        {headers.map((header, idx) => (
          <div key={idx} className="flex-1 text-center">
            {header}
          </div>
        ))}
      </div>
      <div className="space-y-4">
        {items.length > 0 ? items.map((item, index) => (
          <div key={index} style={itemStyle} className="flex justify-between p-4 rounded-lg shadow-md">
            {headers.map((header) => (
              <div key={header} className="flex-1 text-center">
                {renderValue(item[header], header, index)}
              </div>
            ))}
          </div>
        )) : <div className="text-gray-500 text-center">No items available</div>}
      </div>
    </div>
  );
};

export default ItemDisplay;