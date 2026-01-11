
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
  query,
  orderBy,
  updateDoc,
  doc,
  writeBatch,
  where,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { BananaWrapping, CacaoSale, BananaSale, FertilizerApplication } from '@/lib/types';

interface AgroDataContextType {
  bananaWrappings: BananaWrapping[];
  cacaoSales: CacaoSale[];
  bananaSales: BananaSale[];
  fertilizerApplications: FertilizerApplication[];
  addBananaWrapping: (wrapping: Omit<BananaWrapping, 'id' | 'date' | 'sold'>) => Promise<void>;
  addCacaoSale: (sale: Omit<CacaoSale, 'id' | 'date'>) => Promise<void>;
  addBananaSale: (sale: Omit<BananaSale, 'id' | 'date' | 'tapeColor'> & { wrappingId: string }) => Promise<void>;
  addFertilizerApplication: (application: Omit<FertilizerApplication, 'id' | 'date'>) => Promise<void>;
  getUniqueTapeColors: () => { value: string; label: string }[];
  getAvailableWrappings: () => BananaWrapping[];
  loading: boolean;
}

const AgroDataContext = createContext<AgroDataContextType | undefined>(
  undefined
);

export const AgroDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [bananaWrappings, setBananaWrappings] = useState<BananaWrapping[]>([]);
  const [cacaoSales, setCacaoSales] = useState<CacaoSale[]>([]);
  const [bananaSales, setBananaSales] = useState<BananaSale[]>([]);
  const [fertilizerApplications, setFertilizerApplications] = useState<FertilizerApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const collections = {
        bananaWrappings: collection(db, 'bananaWrappings'),
        cacaoSales: collection(db, 'cacaoSales'),
        bananaSales: collection(db, 'bananaSales'),
        fertilizerApplications: collection(db, 'fertilizerApplications'),
      };

      const [bananaWrappingsSnap, cacaoSalesSnap, bananaSalesSnap, fertilizerApplicationsSnap] = await Promise.all([
        getDocs(query(collections.bananaWrappings, orderBy('date', 'desc'))),
        getDocs(query(collections.cacaoSales, orderBy('date', 'desc'))),
        getDocs(query(collections.bananaSales, orderBy('date', 'desc'))),
        getDocs(query(collections.fertilizerApplications, orderBy('date', 'desc'))),
      ]);

      setBananaWrappings(bananaWrappingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), date: (doc.data().date as Timestamp).toDate() } as BananaWrapping)));
      setCacaoSales(cacaoSalesSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), date: (doc.data().date as Timestamp).toDate() } as CacaoSale)));
      setBananaSales(bananaSalesSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), date: (doc.data().date as Timestamp).toDate() } as BananaSale)));
      setFertilizerApplications(fertilizerApplicationsSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), date: (doc.data().date as Timestamp).toDate() } as FertilizerApplication)));

    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addBananaWrapping = async (wrapping: Omit<BananaWrapping, 'id' | 'date' | 'sold'>) => {
    try {
      await addDoc(collection(db, "bananaWrappings"), {
        ...wrapping,
        date: Timestamp.fromDate(new Date()),
        sold: false,
      });
      fetchData();
    } catch (error) {
      console.error("Error adding banana wrapping: ", error);
    }
  };

  const addCacaoSale = async (sale: Omit<CacaoSale, 'id' | 'date'>) => {
     try {
      await addDoc(collection(db, "cacaoSales"), {
        ...sale,
        date: Timestamp.fromDate(new Date()),
      });
      fetchData();
    } catch (error) {
      console.error("Error adding cacao sale: ", error);
    }
  };

  const addBananaSale = async (sale: Omit<BananaSale, 'id' | 'date' | 'tapeColor'> & { wrappingId: string }) => {
    const wrappingRef = doc(db, 'bananaWrappings', sale.wrappingId);
    const wrappingSnap = await getDoc(wrappingRef);

    if (!wrappingSnap.exists()) {
      console.error("Wrapping ID not found");
      return;
    }
    const wrappingData = wrappingSnap.data();

    try {
      const batch = writeBatch(db);
      
      const saleRef = doc(collection(db, 'bananaSales'));
      batch.set(saleRef, {
        ...sale,
        tapeColor: wrappingData.color,
        date: Timestamp.fromDate(new Date()),
      });
      
      batch.update(wrappingRef, { sold: true });
      
      await batch.commit();
      fetchData();
    } catch (error) {
      console.error("Error adding banana sale: ", error);
    }
  };

  const addFertilizerApplication = async (application: Omit<FertilizerApplication, 'id' | 'date'>) => {
    try {
      await addDoc(collection(db, "fertilizerApplications"), {
        ...application,
        date: Timestamp.fromDate(new Date()),
      });
      fetchData(); 
    } catch (error) {
      console.error("Error adding fertilizer application: ", error);
    }
  };

  const getUniqueTapeColors = () => {
    const colors = new Set(bananaWrappings.filter(w => !w.sold).map(w => w.color));
    return Array.from(colors).map(color => ({
      value: color,
      label: color.charAt(0).toUpperCase() + color.slice(1),
    }));
  };

  const getAvailableWrappings = () => {
    return bananaWrappings.filter(w => !w.sold);
  }

  return (
    <AgroDataContext.Provider
      value={{
        bananaWrappings,
        cacaoSales,
        bananaSales,
        fertilizerApplications,
        addBananaWrapping,
        addCacaoSale,
        addBananaSale,
        addFertilizerApplication,
        getUniqueTapeColors,
        getAvailableWrappings,
        loading,
      }}
    >
      {children}
    </AgroDataContext.Provider>
  );
};

export const useAgroData = () => {
  const context = useContext(AgroDataContext);
  if (context === undefined) {
    throw new Error('useAgroData must be used within an AgroDataProvider');
  }
  return context;
};
