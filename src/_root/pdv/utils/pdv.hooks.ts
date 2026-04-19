// pdv.hooks.ts — Legacy specialised selector hooks.
// These are thin wrappers around usePDV() kept for backward compatibility.
// Prefer usePDVBusiness() or usePDVUI() in new code.

import { usePDV } from "./PDVProvider";

export function usePDVEntity() {
  const { activeEntity, handleEntityClick, handleAddClick, handleCaixaRapido } =
    usePDV();
  return { activeEntity, handleEntityClick, handleAddClick, handleCaixaRapido };
}

export function usePDVCart() {
  const {
    cart,
    subtotal,
    serviceTax,
    total,
    includeService,
    setIncludeService,
    confirmAddToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = usePDV();

  return {
    cart,
    subtotal,
    serviceTax,
    total,
    includeService,
    setIncludeService,
    confirmAddToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };
}

export function usePDVPayment() {
  const { handleConfirmPayment, activeEntity } = usePDV();
  return { handleConfirmPayment, activeEntity };
}
