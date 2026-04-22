
export interface CostomersResponse {
  id: string;
  fullName: string;
  nickname: string;
  phone: string;
  cpf: string;
  creditLimit: number;
  settlementDate: number;
  isBlocked: boolean;
  saldoDevedor: number;
}

export interface CreateCustomerDto {
  fullName: string;
  nickname: string;
  phone: string;
  cpf: string;
  creditLimit: number;
  settlementDate: number;
}

export interface CreateLedgerEntryDto {
  type: string;
  amount: number;
  description: string;
  createdAt?: string;
}

export interface LedgerEntry {
  id: string;
  restaurantId: string;
  customerId: string;
  operatorId: string;
  type: string;
  amount: string;
  balanceAfter: string;
  description: string;
  createdAt: string;
  orderId: string;
  order: {
    id: string;
    restaurantId: string;
    orderType: string;
    reference: string;
    status: string;
    sale_date: string;
    subtotal: string;
    serviceTax: string;
    discount: string;
    total: string;
    customerId: string;
    operatorId: string;
    openedAt: string;
    closedAt: string;
  };
}
