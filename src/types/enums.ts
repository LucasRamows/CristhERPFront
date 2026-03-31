export const RelationType = {
  CLIENT: "CLIENT",
  MATERIALSCLIENT: "MATERIALSCLIENT",
  SUPPLIER: "SUPPLIER",
  PARTNER: "PARTNER",
} as const;
export type RelationType = typeof RelationType[keyof typeof RelationType];

export const UserRoles = {
  MASTER: "MASTER",
  SUPERADMIN: "SUPERADMIN",
  ADMIN: "ADMIN",
  CLIENT: "CLIENT",
  USER: "USER",
} as const;
export type UserRoles = typeof UserRoles[keyof typeof UserRoles];

export const MaterialsClass = {
  PLASTIC: "PLASTIC",
  METAL: "METAL",
  GLASS: "GLASS",
  OIL: "OIL",
  PAPER: "PAPER",
} as const;
export type MaterialsClass = typeof MaterialsClass[keyof typeof MaterialsClass];

export const BusinessRoles = {
  RECEPTOR: "RECEPTOR",
  SUPPLIER: "SUPPLIER",
  DONATOR: "DONATOR",
  CONDOMINIUM: "CONDOMINIUM",
} as const;
export type BusinessRoles = typeof BusinessRoles[keyof typeof BusinessRoles];

export const ProductType = {
  PRODUCT: "PRODUCT",
  SERVICE: "SERVICE",
  RAW_MATERIAL: "RAW_MATERIAL",
} as const;
export type ProductType = typeof ProductType[keyof typeof ProductType];

export const TaxOrigin = {
  NATIONAL: "NATIONAL",
  IMPORTED: "IMPORTED",
} as const;
export type TaxOrigin = typeof TaxOrigin[keyof typeof TaxOrigin];

export const UnitMeasure = {
  UN: "UN",
  KG: "KG",
  L: "L",
  M: "M",
  M2: "M2",
  M3: "M3",
  CX: "CX",
  PC: "PC",
} as const;
export type UnitMeasure = typeof UnitMeasure[keyof typeof UnitMeasure];

export const RequesterType = {
  USER: "USER",
  BUSINESS: "BUSINESS",
} as const;
export type RequesterType = typeof RequesterType[keyof typeof RequesterType];

export const CollectionStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
export type CollectionStatus = typeof CollectionStatus[keyof typeof CollectionStatus];

export const SaleStatus = {
  DRAFT: "DRAFT",
  VALIDATED: "VALIDATED",
  TRANSMITTED: "TRANSMITTED",
  CANCELLED: "CANCELLED",
} as const;
export type SaleStatus = typeof SaleStatus[keyof typeof SaleStatus];

export const PaymentMethod = {
  PIX: "PIX",
  CASH: "CASH",
  CREDIT_CARD: "CREDIT_CARD",
  DEBIT_CARD: "DEBIT_CARD",
  STORE_CREDIT: "STORE_CREDIT",
} as const;
export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

export const PaymentMethodLabel: Record<PaymentMethod, string> = {
  [PaymentMethod.PIX]: "PIX",
  [PaymentMethod.CREDIT_CARD]: "Crédito",
  [PaymentMethod.DEBIT_CARD]: "Débito",
  [PaymentMethod.CASH]: "Dinheiro",
  [PaymentMethod.STORE_CREDIT]: "Fiado",
};