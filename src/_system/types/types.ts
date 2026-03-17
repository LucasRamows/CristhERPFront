export interface SharedCollectionRequest {
  id: string;
  status: string;
  createdAt: string;
  materialName: string | null;
  material: string | null;
  totalWeight: number | null;
  proofImageUrl?: string | null;
  
  // Specific to varying contexts (User vs Client)
  collector?: {
    name: string;
  } | null;
  
  requesterBusiness?: {
    name: string;
  } | null;
}
