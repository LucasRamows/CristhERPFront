export interface KitchenOrderCardProps {
  table: string;
  time: string;
  status: string;
  items: string;
  className?: string;
  onMarkDelivered?: () => void;
}