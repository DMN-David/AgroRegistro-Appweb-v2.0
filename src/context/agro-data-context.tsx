'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  addDoc,
 // getDocs,
  Timestamp,
 // query,
  orderBy,
  updateDoc,
  doc,
  writeBatch,
 // where,
  getDoc,
  deleteDoc,
  onSnapshot,
  query,
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
  addBananaSale: (sale: Omit<BananaSale, 'id' | 'date' | 'tapeColors'> & { wrappingIds: string[] }) => Promise<void>;
  updateBananaSale: (id: string, sale: Partial<Omit<BananaSale, 'id' | 'wrappingIds' | 'tapeColors'>>) => Promise<void>;
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

  useEffect(() => {
    setLoading(true);
    const collections = {
      bananaWrappings: collection(db, 'bananaWrappings'),
      cacaoSales: collection(db, 'cacaoSales'),
      bananaSales: collection(db, 'bananaSales'),
      fertilizerApplications: collection(db, 'fertilizerApplications'),
    };

    const unsubscribes = [
      onSnapshot(query(collections.bananaWrappings, orderBy('date', 'asc')), (snapshot) => {
        if (snapshot.empty) {
          setBananaWrappings(initialBananaWrappings);
          const batch = writeBatch(db);
          initialBananaWrappings.forEach(item => {
              const { id, ...data } = item;
              const docRef = doc(db, 'bananaWrappings', id);
              batch.set(docRef, {...data, date: Timestamp.fromDate(data.date as Date)});
          });
          batch.commit();
        } else {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), date: (doc.data().date as Timestamp).toDate() } as BananaWrapping));
          setBananaWrappings(data);
        }
      }, (error) => {
        console.error("Error fetching banana wrappings: ", error);
        setBananaWrappings(initialBananaWrappings);
      }),

      onSnapshot(query(collections.cacaoSales, orderBy('date', 'asc')), (snapshot) => {
        if (snapshot.empty) {
          setCacaoSales(initialCacaoSales);
          const batch = writeBatch(db);
          initialCacaoSales.forEach(item => {
              const { id, ...data } = item;
              const docRef = doc(db, 'cacaoSales', id);
              batch.set(docRef, {...data, date: Timestamp.fromDate(data.date as Date)});
          });
          batch.commit();
        } else {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), date: (doc.data().date as Timestamp).toDate() } as CacaoSale));
          setCacaoSales(data);
        }
      }, (error) => {
        console.error("Error fetching cacao sales: ", error);
        setCacaoSales(initialCacaoSales);
      }),

      onSnapshot(query(collections.bananaSales, orderBy('date', 'asc')), (snapshot) => {
        if (snapshot.empty) {
          setBananaSales(initialBananaSales);
          const batch = writeBatch(db);
          initialBananaSales.forEach(item => {
              const { id, ...data } = item;
              const docRef = doc(db, 'bananaSales', id);
              batch.set(docRef, {...data, date: Timestamp.fromDate(data.date as Date)});
          });
          batch.commit();
        } else {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), date: (doc.data().date as Timestamp).toDate() } as BananaSale));
          setBananaSales(data);
        }
      }, (error) => {
        console.error("Error fetching banana sales: ", error);
        setBananaSales(initialBananaSales);
      }),

      onSnapshot(query(collections.fertilizerApplications, orderBy('date', 'asc')), (snapshot) => {
        if (snapshot.empty) {
          setFertilizerApplications(initialFertilizerApplications);
          const batch = writeBatch(db);
          initialFertilizerApplications.forEach(item => {
              const { id, ...data } = item;
              const docRef = doc(db, 'fertilizerApplications', id);
              batch.set(docRef, {...data, date: Timestamp.fromDate(data.date as Date)});
          });
          batch.commit();
        } else {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), date: (doc.data().date as Timestamp).toDate() } as FertilizerApplication));
          setFertilizerApplications(data);
        }
      }, (error) => {
        console.error("Error fetching fertilizer applications: ", error);
        setFertilizerApplications(initialFertilizerApplications);
      }),
    ];

    setLoading(false);

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  // Banana Wrapping Functions
  const addBananaWrapping = async (wrapping: Omit<BananaWrapping, 'id' | 'date' | 'sold'>) => {
    try {
      await addDoc(collection(db, "bananaWrappings"), {
        ...wrapping,
        date: Timestamp.fromDate(new Date()),
        sold: false,
      });
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
    } catch (error) {
      console.error("Error updating banana wrapping: ", error);
    }
  };

  const deleteBananaWrapping = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'bananaWrappings', id));
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
    } catch (error) {
      console.error("Error updating cacao sale: ", error);
    }
  };

  const deleteCacaoSale = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'cacaoSales', id));
    } catch (error) {
      console.error("Error deleting cacao sale: ", error);
    }
  };

  // Banana Sale Functions
  const addBananaSale = async (sale: Omit<BananaSale, 'id' | 'date' | 'tapeColors'> & { wrappingIds: string[] }) => {
    if (!sale.wrappingIds || sale.wrappingIds.length === 0) {
        console.error("No wrapping IDs provided");
        return;
    }

    try {
        const wrappingDocs = await Promise.all(
            sale.wrappingIds.map(id => getDoc(doc(db, 'bananaWrappings', id)))
        );

        const tapeColors = wrappingDocs.map(snap => snap.exists() ? snap.data().color : 'unknown');

        const batch = writeBatch(db);
        const saleRef = doc(collection(db, 'bananaSales'));
        
        batch.set(saleRef, {
            ...sale,
            tapeColors,
            date: Timestamp.fromDate(new Date()),
        });

        sale.wrappingIds.forEach(id => {
            const wrappingRef = doc(db, 'bananaWrappings', id);
            batch.update(wrappingRef, { sold: true });
        });
        
        await batch.commit();
    } catch (error) {
        console.error("Error adding banana sale: ", error);
    }
  };

  const updateBananaSale = async (id: string, sale: Partial<Omit<BananaSale, 'id' | 'wrappingIds' | 'tapeColors'>>) => {
    try {
      const { date, ...rest } = sale;
      const dataToUpdate: any = { ...rest };
      if (date) dataToUpdate.date = Timestamp.fromDate(date as Date);

      await updateDoc(doc(db, 'bananaSales', id), dataToUpdate);
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
      
      const saleRef = doc(db, 'bananaSales', id);
      batch.delete(saleRef);
      
      if (saleToDelete.wrappingIds) {
          saleToDelete.wrappingIds.forEach(wrappingId => {
              const wrappingRef = doc(db, 'bananaWrappings', wrappingId);
              batch.update(wrappingRef, { sold: false });
          });
      }

      await batch.commit();
    } catch (error) {
      console.error("Error deleting banana sale and updating wrappings: ", error);
    }
  };

  // Fertilizer Application Functions
  const addFertilizerApplication = async (application: Omit<FertilizerApplication, 'id' | 'date'>) => {
    try {
      await addDoc(collection(db, "fertilizerApplications"), {
        ...application,
        date: Timestamp.fromDate(new Date()),
      });
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
    } catch (error) {
      console.error("Error updating fertilizer application: ", error);
    }
  };

  const deleteFertilizerApplication = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'fertilizerApplications', id));
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
