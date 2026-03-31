import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import LoadingComponent from "../../../components/shared/LoadingComponent";
import {
  inventoryService,
  type IngredientResponse,
} from "../../../services/inventory/inventory.service";
import {
  suppliersService,
  type SupplierResponse,
} from "../../../services/suppliers/suppliers.service";

import { CreateIngredientSheet } from "./CreateIngredientSheet";
import { EntryHeader } from "./entry/EntryHeader";
import { EntryMetaData } from "./entry/EntryMetaData";
import { EntryItemsTable, type EntryItem } from "./entry/EntryItemsTable";
import { EntrySidebar } from "./entry/EntrySidebar";

export default function InventoryEntryPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [ingredients, setIngredients] = useState<IngredientResponse[]>([]);
  const [availableSuppliers, setAvailableSuppliers] = useState<
    SupplierResponse[]
  >([]);

  // Note Header State
  const [selectedSupplier, setSelectedSupplier] =
    useState<SupplierResponse | null>(null);
  const [docRef, setDocRef] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // Items State
  const [items, setItems] = useState<EntryItem[]>([]);

  // UI State
  const [isCreateIngredientOpen, setIsCreateIngredientOpen] = useState(false);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [ingredientsData, suppliersData] = await Promise.all([
        inventoryService.getIngredients(),
        suppliersService.getSuppliers(),
      ]);
      setIngredients(ingredientsData);
      setAvailableSuppliers(suppliersData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar lista de insumos/fornecedores.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleAddIngredient = (ingredient: IngredientResponse) => {
    const exists = items.find((i) => i.ingredientId === ingredient.id);
    if (exists) {
      toast.info("Este insumo já está na nota.");
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        ingredientId: ingredient.id,
        name: ingredient.name,
        unit: ingredient.unit,
        quantity: 1,
        unitPrice: 0,
      },
    ]);
  };

  const updateItem = (id: string, updates: Partial<EntryItem>) => {
    setItems((prev) =>
      prev.map((item) =>
        item.ingredientId === id ? { ...item, ...updates } : item,
      ),
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.ingredientId !== id));
  };

  const total = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  }, [items]);

  const handleSave = async () => {
    if (!selectedSupplier || !docRef || items.length === 0) {
      toast.warning(
        "Preencha o fornecedor, documento e adicione pelo menos um item.",
      );
      return;
    }

    try {
      await inventoryService.createInventoryEntry({
        supplierId: selectedSupplier.id,
        documentRef: docRef,
        date,
        totalAmount: total,
        items: items.map(({ ingredientId, quantity, unitPrice }) => ({
          ingredientId,
          quantity,
          unitPrice,
        })),
      });
      toast.success("Nota de entrada lançada com sucesso!");
      navigate(-1);
    } catch (error) {
      console.error("Erro ao salvar nota:", error);
      toast.error("Erro ao salvar nota de entrada.");
    }
  };

  if (isLoading) return <LoadingComponent />;

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden select-none">
      <EntryHeader
        isLoading={isLoading}
        handleSave={handleSave}
        itemsCount={items.length}
        total={total}
        onCancel={() => navigate(-1)}
      />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 flex flex-col gap-4 p-4 sm:p-6 overflow-y-auto custom-scrollbar">
          <EntryMetaData
            availableSuppliers={availableSuppliers}
            selectedSupplier={selectedSupplier}
            setSelectedSupplier={setSelectedSupplier}
            docRef={docRef}
            setDocRef={setDocRef}
            date={date}
            setDate={setDate}
          />

          <EntryItemsTable
            items={items}
            total={total}
            updateItem={updateItem}
            removeItem={removeItem}
          />
        </div>

        <EntrySidebar
          ingredients={ingredients}
          handleAddIngredient={handleAddIngredient}
          setIsCreateIngredientOpen={setIsCreateIngredientOpen}
        />
      </div>

      <CreateIngredientSheet
        isOpen={isCreateIngredientOpen}
        onClose={() => setIsCreateIngredientOpen(false)}
        onCreated={(newIng) => {
          setIngredients((prev) => [...prev, newIng]);
          handleAddIngredient(newIng);
          setIsCreateIngredientOpen(false);
        }}
      />
    </div>
  );
}
