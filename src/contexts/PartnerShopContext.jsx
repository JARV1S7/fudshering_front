import React, { createContext, useContext, useState, useEffect } from 'react';

const PartnerShopContext = createContext(null);

export const PartnerShopProvider = ({ children }) => {
  const [partnerShop, setPartnerShop] = useState(() => {
    const saved = localStorage.getItem('partnerShop');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (partnerShop) {
      localStorage.setItem('partnerShop', JSON.stringify(partnerShop));
    } else {
      localStorage.removeItem('partnerShop');
    }
  }, [partnerShop]);

  return (
    <PartnerShopContext.Provider value={{ partnerShop, setPartnerShop }}>
      {children}
    </PartnerShopContext.Provider>
  );
};

export const usePartnerShop = () => useContext(PartnerShopContext);