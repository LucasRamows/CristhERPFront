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
} from "./pdv.types";

// Contexts
export { PDVUIContext } from "./PDVUIContext";
export { PDVBusinessContext } from "./PDVProvider";

// Hooks — primary split hooks
export { usePDVBusiness, usePDV } from "./PDVProvider";
export { usePDVUI } from "./PDVUIContext";

// Legacy specialised hooks (kept for any consumers that use them)
export { usePDVCart, usePDVPayment, usePDVEntity } from "./pdv.hooks";
