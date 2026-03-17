import api from "../api";

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

export const costomersService = {
  async createCustomer(createCustomerDto: CreateCustomerDto): Promise<[]> {
    const { data } = await api.post<[]>("/customers", createCustomerDto);
    return data;
  },

  async createLedgerEntry(
    restaurantId: string,
    customerId: string,
    operatorId: string,
    createLedgerEntryDto: CreateLedgerEntryDto,
  ): Promise<LedgerEntry> {
    const { data } = await api.post<LedgerEntry>(
      `/customers/${customerId}/ledger`,
      createLedgerEntryDto,
      {
        headers: {
          "Restaurant-Id": restaurantId,
          "Operator-Id": operatorId,
        },
      },
    );
    return data;
  },

  async getAllCustomers(): Promise<CostomersResponse[]> {
    const { data } = await api.get<CostomersResponse[]>("/customers");
    return data;
  },
  async getUnblockedCustomers(): Promise<CostomersResponse[]> {
    const { data } = await api.get<CostomersResponse[]>("/customers/unblocked");
    return data;
  },
  async getCustomerById(id: string): Promise<CostomersResponse> {
    const { data } = await api.get<CostomersResponse>(`/customers/${id}`);
    return data;
  },

  async updateCustomer(
    id: string,
    updateCustomerDto: Partial<CreateCustomerDto>,
  ): Promise<CostomersResponse> {
    const { data } = await api.put<CostomersResponse>(
      `/customers/${id}`,
      updateCustomerDto,
    );
    return data;
  },

  async toggleCustomerBlock(id: string): Promise<CostomersResponse> {
    const { data } = await api.patch<CostomersResponse>(
      `/customers/${id}/block`,
    );
    return data;
  },

  async getCustomerLedger(id: string): Promise<LedgerEntry[]> {
    const { data } = await api.get<LedgerEntry[]>(`/customers/${id}/ledger`);
    return data;
  },
  async deleteTransaction(id: string): Promise<void> {
    await api.delete(`/customers/ledger/${id}`);
  },

  async receivePayment(
    id: string,
    amount: number,
    method: "PIX" | "CASH" | "CREDIT_CARD" | "DEBIT_CARD",
    description?: string,
  ): Promise<LedgerEntry> {
    const { data } = await api.post<LedgerEntry>(`/customers/${id}/receive`, {
      amount,
      method,
      description,
    });
    return data;
  },
};
