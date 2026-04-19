// src/_features/receipt/recipes/ReceiptPDF.tsx
"use client";

import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { CartItem } from "../../../_root/pdv/utils/pdv.types";
import type { PdvEntity } from "../../../_root/types/PdvEntity";
import type { User } from "../../../contexts/DataContext";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
  },
  // Cabeçalho Principal
  headerBrand: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1pt solid #E5E7EB",
    paddingBottom: 15,
    marginBottom: 20,
  },
  brandName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    letterSpacing: 1,
  },
  brandSub: {
    fontSize: 9,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  documentType: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#4B5563",
    textTransform: "uppercase",
    backgroundColor: "#F3F4F6",
    padding: "4 8",
    borderRadius: 4,
  },
  // Bloco de Informações (Cliente/Mesa e Data da Venda)
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  infoGroup: {
    flexDirection: "column",
  },
  infoLabel: {
    fontSize: 8,
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1F2937",
  },
  // Tabela de Itens
  table: {
    width: "100%",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1pt solid #D1D5DB",
    paddingBottom: 6,
    marginBottom: 8,
  },
  thQtd: { width: "15%", fontSize: 9, color: "#6B7280", fontWeight: "bold" },
  thDesc: { width: "60%", fontSize: 9, color: "#6B7280", fontWeight: "bold" },
  thTotal: {
    width: "25%",
    fontSize: 9,
    color: "#6B7280",
    fontWeight: "bold",
    textAlign: "right",
  },

  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottom: "1pt solid #F3F4F6",
  },
  tdQtd: { width: "15%", fontSize: 10, color: "#4B5563" },
  tdDesc: { width: "60%", fontSize: 10, color: "#111827", fontWeight: "bold" },
  tdDescSub: { fontSize: 8, color: "#9CA3AF", marginTop: 2 },
  tdTotal: {
    width: "25%",
    fontSize: 10,
    color: "#111827",
    fontWeight: "bold",
    textAlign: "right",
  },

  // Seção de Totais
  totalsContainer: {
    marginTop: 15,
    alignItems: "flex-end",
  },
  totalsBlock: {
    width: "50%",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  totalLabel: { fontSize: 10, color: "#6B7280" },
  totalValue: { fontSize: 10, color: "#111827", fontWeight: "bold" },
  discountValue: { fontSize: 10, color: "#059669", fontWeight: "bold" },

  // Caixa de Total Final
  finalTotalBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1F2937",
    padding: "12 16",
    borderRadius: 6,
    marginTop: 8,
  },
  finalTotalLabel: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  finalTotalValue: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  // Rodapé e Datas Discretas
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    borderTop: "1pt solid #F3F4F6",
    paddingTop: 15,
  },
  footerText: {
    fontSize: 9,
    color: "#6B7280",
    marginBottom: 4,
  },
  issueDate: {
    fontSize: 7,
    color: "#D1D5DB", // Cinza bem clarinho (discreto)
  },
});

interface ReceiptDocumentProps {
  entity: PdvEntity;
  items: CartItem[];
  subtotal: number;
  discount: number;
  serviceTax: number;
  total: number;
  timestamp?: string;
  business: User["business"];
}

export default function ReceiptPDF({
  entity,
  items,
  subtotal,
  discount,
  serviceTax,
  total,
  business,
  timestamp,
}: ReceiptDocumentProps) {
  const formattedSaleDate = format(timestamp || new Date(), "dd 'de' MMMM", {
    locale: ptBR,
  });

  const issueDate = new Date();
  const formattedIssueDate = format(issueDate, "dd 'de' MMMM 'às' HH:mm", {
    locale: ptBR,
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho */}
        <View style={styles.headerBrand}>
          <View>
            <Text style={styles.brandName}>{business?.businessName || ""}</Text>
          </View>
          <Text style={styles.documentType}>Recibo de Venda</Text>
        </View>

        {/* Informações da Venda */}
        <View style={styles.infoSection}>
          <View style={styles.infoGroup}>
            <Text style={styles.infoLabel}>Identificação (Cliente/Mesa)</Text>
            <Text style={styles.infoValue}>{entity.label}</Text>
          </View>
          <View style={[styles.infoGroup, { alignItems: "flex-end" }]}>
            <Text style={styles.infoLabel}>Data da Venda</Text>
            <Text style={styles.infoValue}>{formattedSaleDate}</Text>
          </View>
        </View>

        {/* Lista de Itens */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.thQtd}>QTD</Text>
            <Text style={styles.thDesc}>DESCRIÇÃO DO ITEM</Text>
            <Text style={styles.thTotal}>TOTAL</Text>
          </View>

          {items.map((item, index) => (
            <View key={item.id || index} style={styles.tableRow}>
              <Text style={styles.tdQtd}>{item.quantity}x</Text>
              <View style={{ width: "60%" }}>
                <Text style={styles.tdDesc}>{item.name}</Text>
                <Text style={styles.tdDescSub}>
                  V. Unit: R$ {item.price.toFixed(2)}
                </Text>
              </View>
              <Text style={styles.tdTotal}>
                R$ {(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Subtotais e Total Final */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsBlock}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>R$ {subtotal.toFixed(2)}</Text>
            </View>

            {discount > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Desconto</Text>
                <Text style={styles.discountValue}>
                  - R$ {discount.toFixed(2)}
                </Text>
              </View>
            )}

            {serviceTax > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Taxa de Serviço</Text>
                <Text style={styles.totalValue}>
                  R$ {serviceTax.toFixed(2)}
                </Text>
              </View>
            )}

            <View style={styles.finalTotalBox}>
              <Text style={styles.finalTotalLabel}>Total Pago</Text>
              <Text style={styles.finalTotalValue}>R$ {total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Rodapé fixo no fundo da página */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Obrigado pela preferência!</Text>
          <Text style={styles.footerText}>
            * Este documento é um recibo gerencial e não possui valor fiscal *
          </Text>

          {/* Data de emissão BEM discreta (Fonte tamanho 7 e cor super clara) */}
          <Text style={[styles.issueDate, { marginTop: 8 }]}>
            Emitido em: {formattedIssueDate}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
