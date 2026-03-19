/**
 * @file pdv.service.ts
 * @description Serviço centralizado de matemática do PDV.
 * Toda lógica de cálculo de valores deve passar por aqui,
 * garantindo consistência e facilidade de manutenção.
 */

// ─── Constantes ─────────────────────────────────────────────────────────────

/** Taxa de serviço padrão (10%) */
export const SERVICE_TAX_RATE = 0.1;

// ─── Tipos ──────────────────────────────────────────────────────────────────

export interface CartItemForCalc {
  price: number;
  quantity: number;
}

export interface PdvTotals {
  /** Soma dos itens sem taxa */
  subtotal: number;
  /** Valor da taxa de serviço (0 se não aplicável) */
  serviceTax: number;
  /** Total final (subtotal + taxa) */
  total: number;
}

// ─── Helpers internos ────────────────────────────────────────────────────────

/**
 * Converte qualquer valor para número seguro.
 * Retorna 0 se o valor for NaN, undefined ou null.
 */
function safeNumber(value: unknown): number {
  const n = Number(value);
  return isFinite(n) ? n : 0;
}

/**
 * Arredonda para 2 casas decimais (padrão monetário).
 */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

// ─── Funções exportadas ──────────────────────────────────────────────────────

/**
 * Calcula o subtotal de uma lista de itens do carrinho.
 * Usa `safeNumber` para evitar NaN em preços vindos do backend.
 */
export function calcSubtotal(items: CartItemForCalc[]): number {
  const subtotal = items.reduce((acc, item) => {
    const price = safeNumber(item.price);
    const qty = safeNumber(item.quantity);
    return acc + price * qty;
  }, 0);
  return round2(subtotal);
}

/**
 * Calcula a taxa de serviço com base no subtotal.
 *
 * @param subtotal - Valor base para cálculo
 * @param include  - Se false, retorna 0 (taxa desativada pelo operador)
 * @param rate     - Taxa a aplicar (padrão: SERVICE_TAX_RATE = 10%)
 */
export function calcServiceTax(
  subtotal: number,
  include: boolean,
  rate: number = SERVICE_TAX_RATE
): number {
  if (!include || subtotal <= 0) return 0;
  return round2(safeNumber(subtotal) * rate);
}

/**
 * Calcula o total final somando subtotal + taxa de serviço.
 */
export function calcTotal(subtotal: number, serviceTax: number): number {
  return round2(safeNumber(subtotal) + safeNumber(serviceTax));
}

/**
 * Calcula todos os totais do PDV de uma vez.
 * Use esta função como ponto único de cálculo no componente.
 *
 * @param items          - Itens do carrinho
 * @param includeService - Se a taxa de serviço deve ser incluída
 * @param isCounter      - Se for Caixa Rápido (COUNTER), taxa nunca é aplicada
 * @param rate           - Taxa de serviço (padrão 10%)
 */
export function calcPdvTotals(
  items: CartItemForCalc[],
  includeService: boolean,
  isCounter: boolean,
  rate: number = SERVICE_TAX_RATE
): PdvTotals {
  const subtotal = calcSubtotal(items);
  const applyTax = includeService && !isCounter;
  const serviceTax = calcServiceTax(subtotal, applyTax, rate);
  const total = calcTotal(subtotal, serviceTax);
  return { subtotal, serviceTax, total };
}

/**
 * Calcula o valor por pessoa na divisão da conta.
 * Retorna 0 se splitCount for inválido (0 ou negativo).
 *
 * @param total      - Total da conta
 * @param splitCount - Número de pessoas
 */
export function calcSplitPerPerson(total: number, splitCount: number): number {
  if (!splitCount || splitCount <= 0) return 0;
  return round2(safeNumber(total) / splitCount);
}

/**
 * Calcula o troco do pagamento.
 * Retorna 0 se o valor pago for menor que o total (sem troco negativo).
 *
 * @param amountPaid - Valor recebido
 * @param total      - Total a pagar
 */
export function calcChange(amountPaid: number, total: number): number {
  const change = safeNumber(amountPaid) - safeNumber(total);
  return change > 0 ? round2(change) : 0;
}

/**
 * Aplica desconto (em R$) ao total.
 * O desconto nunca pode ser maior que o total (retorna 0 no mínimo).
 *
 * @param total    - Valor original
 * @param discount - Valor do desconto em R$
 */
export function applyDiscount(total: number, discount: number): number {
  const result = safeNumber(total) - safeNumber(discount);
  return result > 0 ? round2(result) : 0;
}

