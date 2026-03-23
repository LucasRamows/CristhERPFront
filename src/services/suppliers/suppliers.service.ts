import { type InventoryEntryResponse } from "../inventory/inventory.service";
import api from "../api";

export interface SupplierResponse {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  identification?: string;
  addresses?: Address[];
  category?: string;
  createdAt?: string;
}

export interface SupplierSummary {
  totalPurchasedMonth: number;
  pendingInvoices: number;
  topCategory: string;
}

export interface Address {
  cep: string;
  city: string;
  uf: string;
  country: string;
  street: string;
  streetNumber: string;
  neighborhood: string;
  complement: string;
  mainAddress: boolean;
  longitude?: string;
  latitude?: string;
}

export interface CreateSupplierRequest {
  name: string;
  email?: string;
  phone?: string;
  identification?: string;
  addresses?: Address;
  category?: string;
}

export const suppliersService = {
  async getSuppliers(): Promise<SupplierResponse[]> {
    const { data } = await api.get<SupplierResponse[]>("/suppliers");
    return data;
  },

  async createSupplier(
    supplier: CreateSupplierRequest,
  ): Promise<SupplierResponse> {
    const { data } = await api.post<SupplierResponse>("/suppliers", supplier);
    return data;
  },

  async updateSupplier(
    id: string,
    updates: Partial<CreateSupplierRequest>,
  ): Promise<SupplierResponse> {
    const { data } = await api.patch<SupplierResponse>(
      `/suppliers/${id}`,
      updates,
    );
    return data;
  },

  async deleteSupplier(id: string): Promise<void> {
    await api.delete(`/suppliers/${id}`);
  },

  async getSupplierHistory(id: string): Promise<InventoryEntryResponse[]> {
    const { data } = await api.get<InventoryEntryResponse[]>(
      `/suppliers/${id}/history`,
    );
    return data;
  },

  async getSuppliersSummary(): Promise<SupplierSummary> {
    const { data } = await api.get<SupplierSummary>("/suppliers/stats/summary");
    return data;
  },
};
