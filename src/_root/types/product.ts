
import type { ProductType, TaxOrigin, UnitMeasure } from '../../types/enums';
import type { ICMSCST, IPI_CST, PISCOFINS_CST } from './fiscalEnums';

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  sku?: string | null;
  barcode?: string | null;
  image: string;
  gender?: string | null;

  type: ProductType;
  unit: UnitMeasure;

  price: number;
  cost?: number | null;

  stock: number;
  minStock?: number | null;

  ncm: string;
  cfop: string;

  taxOrigin: TaxOrigin;

  icmsCst: ICMSCST;
  icmsRate: number;

  ipiCst?: IPI_CST | null;
  ipiRate?: number | null;

  pisCst: PISCOFINS_CST;
  pisRate: number;

  cofinsCst: PISCOFINS_CST;
  cofinsRate: number;

  cest?: string | null;

  active: boolean;

  createdAt: string;
  updatedAt: string;

  // Relações
  businessId: string;
  businessRelationId?: string | null;
}