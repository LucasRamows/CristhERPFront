import api from "../api";
import {
  type CreateCustomerDto,
  type CreateLedgerEntryDto,
  type LedgerEntry,
  type CostomersResponse,
} from "./customer.type";

export const costomersService = {
  async createCustomer(createCustomerDto: CreateCustomerDto): Promise<CostomersResponse> {
    const { data } = await api.post<CostomersResponse>("/customers", createCustomerDto);
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

  async addDebt(
    customerId: string,
    createLedgerEntryDto: CreateLedgerEntryDto,
  ): Promise<LedgerEntry> {
    const { data } = await api.post<LedgerEntry>(
      `/customers/${customerId}/debt`,
      createLedgerEntryDto,
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
  async deletePayment(id: string): Promise<void> {
    await api.delete(`/customers/ledger/${id}/payment`);
  },
  async receivePayment(
    id: string,
    amount: number,
    method: "PIX" | "Dinheiro" | "Cartão de Crédito" | "Cartão de Débito",
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
