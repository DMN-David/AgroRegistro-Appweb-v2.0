
import { Timestamp } from "firebase/firestore";

export type BananaWrapping = {
  id: string;
  observation: string;
  color: string;
  quantity: number;
  date: Date;
  sold: boolean;
};

export type CacaoSale = {
  id: string;
  quantity: number;
  description: string;
  unitPrice: number;
  totalValue: number;
  date: Date;
};

export type BananaSale = {
  id: string;
  quantity: number;
  tapeColor: string;
  unitPrice: number;
  totalPrice: number;
  date: Date;
  wrappingId: string;
};

export type FertilizerApplication = {
  id: string;
  fertilizerType: string;
  quantity: number;
  notes?: string;
  date: Date;
}
