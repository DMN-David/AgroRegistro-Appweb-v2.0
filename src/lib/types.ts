
import { Timestamp } from "firebase/firestore";

export type BananaWrapping = {
  id: string;
  observation: string;
  color: string;
  quantity: number;
  date: Date | Timestamp;
  sold: boolean;
};

export type CacaoSale = {
  id: string;
  quantity: number;
  description: string;
  unitPrice: number;
  totalValue: number;
  date: Date | Timestamp;
};

export type BananaSale = {
  id: string;
  quantity: number;
  tapeColor: string;
  unitPrice: number;
  totalPrice: number;
  date: Date | Timestamp;
  wrappingId: string;
};

export type FertilizerApplication = {
  id: string;
  fertilizerType: string;
  quantity: number;
  notes?: string;
  date: Date | Timestamp;
}
