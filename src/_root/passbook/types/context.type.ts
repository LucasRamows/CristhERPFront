import type { CostomersResponse } from "../../../services/costomers/customer.type";
import type { CartItem } from "../../pdv/utils/pdv.types";
import type { PdvEntity } from "../../types/PdvEntity";

export interface PassbookActionsProps {
  setClients: React.Dispatch<React.SetStateAction<CostomersResponse[]>>;
  setLedgerEntries: React.Dispatch<React.SetStateAction<any[]>>;
  setIsLoadingData: (loading: boolean) => void;
  activeClientId?: string | null;
}
export interface ViewCartReceiptSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activeEntity: PdvEntity | null;
  cart: CartItem[];
  subtotal: number;
  discount: number;
  serviceTax: number;
  total: number;
  timestamp?: string;
  isSyncing?: boolean;
  description?: string;
}
