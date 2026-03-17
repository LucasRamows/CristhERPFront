import type { User } from "../../contexts/DataContext";

export interface SystemSettings {
  id: string;
  theme: boolean;

  // Relações opcionais
  userId?: string | null;
  user?: User;
}
