// src/ComparativoContext.js
import React, { createContext, useContext, useState } from 'react';

const ComparativoContext = createContext();

export const ComparativoProvider = ({ children }) => {
    const [comparativoData, setComparativoData] = useState({
        marketQuantity: 0,
        selectedProductsCount: 0,
        totalMinPrice: 0,
        produtos: [],
        melhorMercado: {
            nome: 'Não disponível',
            distancia: 'Não disponível',
            quantidadeProdutos: 0,
            custo: Infinity
        },
    });

    return (
        <ComparativoContext.Provider value={{ comparativoData, setComparativoData }}>
            {children}
        </ComparativoContext.Provider>
    );
};

export const useComparativo = () => {
    return useContext(ComparativoContext);
};
