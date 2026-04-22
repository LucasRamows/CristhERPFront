/**
 * types.ts — Re-export shim for backward compatibility.
 *
 * All PDV types and hooks have been reorganised:
 *   - Interfaces  → pdv.types.ts
 *   - Business ctx → PDVProvider.tsx  (usePDVBusiness)
 *   - UI ctx       → PDVUIContext.tsx (usePDVUI)
 *
 * Existing components that import from "utils/types" continue to work.
 * Migrate them to the new import paths gradually.
 */

// Types
export type {
  CartItem,
  PaymentData,
  PDVView,
  PDVContextType,
  PDVBusinessContextType,
  PDVUIContextType,
} from "../utils/pdv.types";

// Contexts
export { PDVUIContext } from "../utils/PDVUIContext";
export { PDVBusinessContext } from "../utils/PDVProvider";

// Hooks — primary split hooks
export { usePDVBusiness, usePDV } from "../utils/PDVProvider";
export { usePDVUI } from "../utils/PDVUIContext";

// Legacy specialised hooks (kept for any consumers that use them)
export { usePDVCart, usePDVPayment, usePDVEntity } from "../utils/pdv.hooks";
