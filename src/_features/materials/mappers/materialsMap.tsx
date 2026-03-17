  import { Droplet, FileText, Hammer, Package, Wine } from "lucide-react";

  const MATERIALS_MAP: Record<
      string,
      { label: string; icon: React.ElementType; color: string; unit: string }
    > = {
      PLASTIC: {
        label: "Plástico",
        icon: Package,
        color: "text-red-600 bg-red-50 border-red-200",
        unit: "kg",
      },
      METAL: {
        label: "Metal",
        icon: Hammer,
        color: "text-amber-600 bg-amber-50 border-amber-200",
        unit: "kg",
      },
      GLASS: {
        label: "Vidro",
        icon: Wine,
        color: "text-emerald-600 bg-emerald-50 border-emerald-200",
        unit: "kg",
      },
      OIL: {
        label: "Óleo",
        icon: Droplet,
        color: "text-orange-600 bg-orange-50 border-orange-200",
        unit: "L",
      },
      PAPER: {
        label: "Papel",
        icon: FileText,
        color: "text-blue-600 bg-blue-50 border-blue-200",
        unit: "kg",
      },
    };

    export default MATERIALS_MAP