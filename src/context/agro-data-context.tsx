
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
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { BananaWrapping, CacaoSale, BananaSale, FertilizerApplication } from '@/lib/types';
import { initialBananaWrappings, initialCacaoSales, initialBananaSales, initialFertilizerApplications } from '@/lib/data';

interface AgroDataContextType {
  bananaWrappings: BananaWrapping[];
  cacaoSales: CacaoSale[];
  bananaSales: BananaSale[];
  fertilizerApplications: FertilizerApplication[];
  addBananaWrapping: (wrapping: Omit<BananaWrapping, 'id' | 'date' | 'sold'>) => Promise<void>;
  updateBananaWrapping: (id: string, wrapping: Partial<Omit<BananaWrapping, 'id'>>) => Promise<void>;
  deleteBananaWrapping: (id: string) => Promise<void>;
  addCacaoSale: (sale: Omit<CacaoSale, 'id' | 'date'>) => Promise<void>;
  updateCacaoSale: (id: string, sale: Partial<Omit<CacaoSale, 'id'>>) => Promise<void>;
  deleteCacaoSale: (id: string) => Promise<void>;
  addBananaSale: (sale: Omit<BananaSale, 'id' | 'date' | 'tapeColor'> & { wrappingId: string }) => Promise<void>;
  updateBananaSale: (id: string, sale: Partial<Omit<BananaSale, 'id' | 'wrappingId'>>) => Promise<void>;
  deleteBananaSale: (id: string) => Promise<void>;
  addFertilizerApplication: (application: Omit<FertilizerApplication, 'id' | 'date'>) => Promise<void>;
  updateFertilizerApplication: (id: string, application: Partial<Omit<FertilizerApplication, 'id'>>) => Promise<void>;
  deleteFertilizerApplication: (id: string) => Promise<void>;
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
        getDocs(query(collections.bananaWrappings, orderBy('date', 'asc'))),
        getDocs(query(collections.cacaoSales, orderBy('date', 'asc'))),
        getDocs(query(collections.bananaSales, orderBy('date', 'asc'))),
        getDocs(query(collections.fertilizerApplications, orderBy('date', 'asc'))),
      ]);

      const bananaWrappingsData = bananaWrappingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), date: (doc.data().date as Timestamp).toDate() } as BananaWrapping));
      if (bananaWrappingsData.length > 0) {
        setBananaWrappings(bananaWrappingsData);
      } else {
        setBananaWrappings(initialBananaWrappings);
        // One-time write of initial data if collection is empty
        const batch = writeBatch(db);
        initialBananaWrappings.forEach(item => {
            const { id, ...data } = item;
            const docRef = doc(db, 'bananaWrappings', id);
            batch.set(docRef, {...data, date: Timestamp.fromDate(data.date as Date)});
        });
        await batch.commit();
      }


      const cacaoSalesData = cacaoSalesSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), date: (doc.data().date as Timestamp).toDate() } as CacaoSale));
      if (cacaoSalesData.length > 0) {
        setCacaoSales(cacaoSalesData);
      } else {
        setCacaoSales(initialCacaoSales);
        const batch = writeBatch(db);
        initialCacaoSales.forEach(item => {
            const { id, ...data } = item;
            const docRef = doc(db, 'cacaoSales', id);
            batch.set(docRef, {...data, date: Timestamp.fromDate(data.date as Date)});
        });
        await batch.commit();
      }

      const bananaSalesData = bananaSalesSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), date: (doc.data().date as Timestamp).toDate() } as BananaSale));
      if(bananaSalesData.length > 0) {
        setBananaSales(bananaSalesData);
      } else {
        setBananaSales(initialBananaSales);
        const batch = writeBatch(db);
        initialBananaSales.forEach(item => {
            const { id, ...data } = item;
            const docRef = doc(db, 'bananaSales', id);
            batch.set(docRef, {...data, date: Timestamp.fromDate(data.date as Date)});
        });
        await batch.commit();
      }
      
      const fertilizerApplicationsData = fertilizerApplicationsSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), date: (doc.data().date as Timestamp).toDate() } as FertilizerApplication));
      if(fertilizerApplicationsData.length > 0) {
        setFertilizerApplications(fertilizerApplicationsData);
      } else {
        setFertilizerApplications(initialFertilizerApplications);
        const batch = writeBatch(db);
        initialFertilizerApplications.forEach(item => {
            const { id, ...data } = item;
            const docRef = doc(db, 'fertilizerApplications', id);
            batch.set(docRef, {...data, date: Timestamp.fromDate(data.date as Date)});
        });
        await batch.commit();
      }


    } catch (error) {
      console.error("Error fetching data: ", error);
       // Fallback to initial data if there's an error (e.g., Firebase not configured)
      setBananaWrappings(initialBananaWrappings);
      setCacaoSales(initialCacaoSales);
      setBananaSales(initialBananaSales);
      setFertilizerApplications(initialFertilizerApplications);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Banana Wrapping Functions
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

  const updateBananaWrapping = async (id: string, wrapping: Partial<Omit<BananaWrapping, 'id'>>) => {
    try {
      const { date, ...rest } = wrapping;
      const dataToUpdate: any = { ...rest };
      if (date) dataToUpdate.date = Timestamp.fromDate(date as Date);

      const wrappingRef = doc(db, 'bananaWrappings', id);
      await updateDoc(wrappingRef, dataToUpdate);
      fetchData();
    } catch (error) {
      console.error("Error updating banana wrapping: ", error);
    }
  };

  const deleteBananaWrapping = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'bananaWrappings', id));
      fetchData();
    } catch (error) {
      console.error("Error deleting banana wrapping: ", error);
    }
  };

  // Cacao Sale Functions
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

  const updateCacaoSale = async (id: string, sale: Partial<Omit<CacaoSale, 'id'>>) => {
    try {
      const { date, ...rest } = sale;
      const dataToUpdate: any = { ...rest };
      if (date) dataToUpdate.date = Timestamp.fromDate(date as Date);

      await updateDoc(doc(db, 'cacaoSales', id), dataToUpdate);
      fetchData();
    } catch (error) {
      console.error("Error updating cacao sale: ", error);
    }
  };

  const deleteCacaoSale = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'cacaoSales', id));
      fetchData();
    } catch (error) {
      console.error("Error deleting cacao sale: ", error);
    }
  };

  // Banana Sale Functions
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

  const updateBananaSale = async (id: string, sale: Partial<Omit<BananaSale, 'id' | 'wrappingId'>>) => {
    try {
      const { date, ...rest } = sale;
      const dataToUpdate: any = { ...rest };
      if (date) dataToUpdate.date = Timestamp.fromDate(date as Date);

      await updateDoc(doc(db, 'bananaSales', id), dataToUpdate);
      fetchData();
    } catch (error) {
      console.error("Error updating banana sale: ", error);
    }
  };

  const deleteBananaSale = async (id: string) => {
    const saleToDelete = bananaSales.find(sale => sale.id === id);
    if (!saleToDelete) {
        console.error("Sale not found in local state");
        return;
    }

    try {
      const batch = writeBatch(db);
      
      // 1. Reference to the sale to be deleted
      const saleRef = doc(db, 'bananaSales', id);
      batch.delete(saleRef);
      
      // 2. Reference to the associated wrapping lot to update it
      if (saleToDelete.wrappingId) {
        const wrappingRef = doc(db, 'bananaWrappings', saleToDelete.wrappingId);
        batch.update(wrappingRef, { sold: false });
      }

      await batch.commit();
      fetchData();
    } catch (error) {
      console.error("Error deleting banana sale and updating wrapping: ", error);
    }
  };

  // Fertilizer Application Functions
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

  const updateFertilizerApplication = async (id: string, application: Partial<Omit<FertilizerApplication, 'id'>>) => {
    try {
      const { date, ...rest } = application;
      const dataToUpdate: any = { ...rest };
      if (date) dataToUpdate.date = Timestamp.fromDate(date as Date);

      await updateDoc(doc(db, 'fertilizerApplications', id), dataToUpdate);
      fetchData();
    } catch (error) {
      console.error("Error updating fertilizer application: ", error);
    }
  };

  const deleteFertilizerApplication = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'fertilizerApplications', id));
      fetchData();
    } catch (error) {
      console.error("Error deleting fertilizer application: ", error);
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
        updateBananaWrapping,
        deleteBananaWrapping,
        addCacaoSale,
        updateCacaoSale,
        deleteCacaoSale,
        addBananaSale,
        updateBananaSale,
        deleteBananaSale,
        addFertilizerApplication,
        updateFertilizerApplication,
        deleteFertilizerApplication,
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

    
    