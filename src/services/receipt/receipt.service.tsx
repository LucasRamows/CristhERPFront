// PDV/services/receipt.service.ts
"use client";

import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import ReceiptPDF from "../../components/shared/ReceiptPDF";
import type { CartItem } from "../../_root/pdv/utils/pdv.types";
import type { PdvEntity } from "../../_root/types/PdvEntity";

export interface ReceiptData {
  entity: PdvEntity;
  items: CartItem[];
  subtotal: number;
  discount: number;
  serviceTax: number;
  total: number;
  timestamp?: Date;
}

/**
 * Gera um PDF do recibo usando html2pdf
 * Requer: npm install html2pdf.js
 */
export async function generateReceiptPDF(data: any) {
  const blob = await pdf(<ReceiptPDF {...data} />).toBlob();

  saveAs(blob, `recibo-${Date.now()}.pdf`);
}
/**
 * Compartilha recibo via WhatsApp (se disponível)
 */
export function shareReceiptViaWhatsApp(phone: string, message: string): void {
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    message,
  )}`;
  window.open(whatsappUrl, "_blank");
}

/**
 * Envia recibo por email (integração com backend)
 */
export async function sendReceiptByEmail(
  email: string,
  receiptData: ReceiptData,
): Promise<void> {
  try {
    const response = await fetch("/api/pdv/send-receipt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        receiptData,
      }),
    });

    if (!response.ok) {
      throw new Error("Erro ao enviar recibo por email");
    }

    const result = await response.json();
    console.log("Recibo enviado com sucesso:", result);
  } catch (error) {
    console.error("Erro ao enviar recibo:", error);
    throw error;
  }
}
