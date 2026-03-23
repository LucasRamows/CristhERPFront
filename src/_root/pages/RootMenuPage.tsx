import { ChevronLeft, Plus, SearchX, Utensils, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  productsService,
  type ProductsResponse,
} from "../../services/products/products.service";
import { toast } from "sonner";

import { Button } from "../../components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "../../components/ui/sheet";
import CreateMenuItemForm from "../components/menu/RootCreateMenuItemForm";
import EditMenuItemForm from "../components/menu/RootEditMenuItemForm";
import { PdvMenu } from "../components/pdv/PdvMenu";
import LoadingComponent from "../../components/shared/LoadingComponent";
import RootMenuItemOptions from "../components/menu/RootMenuItemOptions";
import { MENU_CATEGORY_META } from "../constants/menuCategories";


const RootMenuPage = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isPanelEditOpen, setIsPanelEditOpen] = useState(false);
  const [manageView, setManageView] = useState<"options" | "edit">("options");
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<ProductsResponse[]>([]);
  const [itemSelected, setItemSelected] = useState<ProductsResponse | null>(
    null,
  );
  const [categories, setCategories] = useState<string[]>(["TODOS"]);
  const [selectedCategory, setSelectedCategory] = useState("TODOS");

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productsService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      toast.error("Erro ao carregar cardápio.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const distinctCategories = Array.from(
      new Set(products.map((item) => item.category)),
    ).filter(Boolean);
    const newCategories = ["TODOS", ...distinctCategories];
    setCategories(newCategories);

    // Se a categoria selecionada sumiu (foi deletada ou renomeada), volta para TODOS
    if (!newCategories.includes(selectedCategory)) {
      setSelectedCategory("TODOS");
    }
  }, [products]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateSubmit = async (values: any) => {
    try {
      setProducts((prev) => [...prev, values]);
      setIsPanelOpen(false);
      toast.success("Produto adicionado ao cardápio!");
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      toast.error("Não foi possível criar o produto.");
    }
  };

  const handleEditSubmit = async (values: any) => {
    if (!itemSelected) return;
    try {
      const resp = await productsService.updateProduct(itemSelected.id, values);
      setProducts((prev) => prev.map((m) => (m.id === resp.id ? resp : m)));
      setIsPanelEditOpen(false);
      setItemSelected(null);
      toast.success("Produto atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      toast.error("Falha na atualização do produto.");
    }
  };

  const handleDelete = async () => {
    if (!itemSelected) return;
    if (!confirm(`Deseja realmente excluir "${itemSelected.name}"?`)) return;

    try {
      await productsService.deleteProduct(itemSelected.id);
      setProducts((prev) => prev.filter((m) => m.id !== itemSelected.id));
      setIsPanelEditOpen(false);
      setItemSelected(null);
      toast.success("Produto removido do cardápio.");
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      toast.error("Não foi possível excluir o produto.");
    }
  };

  const filteredItems = useMemo(() => {
    return products.filter((item) =>
      selectedCategory === "TODOS" ? true : item.category === selectedCategory,
    );
  }, [products, selectedCategory]);

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <div className="flex gap-4 flex-col w-full bg-background overflow-hidden select-none">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setItemSelected(null);
            setIsPanelOpen(true);
          }}
        >
          <Plus size={22} strokeWidth={3} />
          Adicionar Item
        </Button>
      </div>

      {/* Grid de Produtos via PdvMenu */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <PdvMenu
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories.map((cat) => ({
            id: cat,
            label: cat === "Balanca" ? "Balança" : cat,
            icon: MENU_CATEGORY_META[cat]?.icon || <Utensils size={18} />,
          }))}
          products={products}
          isLoading={isLoading}
          onProductClick={(item: any) => {
            setItemSelected(item);
            setManageView("options");
            setIsPanelEditOpen(true);
          }}
        />
        {filteredItems.length === 0 && !isLoading && (
          <div className="col-span-full bg-card rounded-[40px] border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-20 text-center flex flex-col items-center justify-center">
            <div className="bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center w-24 h-24 rounded-full mb-8 text-zinc-300 dark:text-zinc-600">
              <SearchX size={48} />
            </div>
            <h3 className="text-2xl font-black text-zinc-800 dark:text-zinc-100 mb-2 uppercase tracking-tighter">
              Ops! Nada por aqui.
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto font-medium">
              Não encontramos produtos nesta categoria. Que tal cadastrar um
              novo?
            </p>
          </div>
        )}
      </div>

      {/* SHEET - NOVO ITEM */}
      <Sheet open={isPanelOpen} onOpenChange={setIsPanelOpen}>
        <SheetContent
          side="right"
          className="w-[90%] sm:max-w-[400px] p-0 flex flex-col h-full bg-white border-l border-gray-200 [&>button]:hidden outline-none"
        >
          <SheetTitle className="sr-only">Novo Item</SheetTitle>

          {/* Header */}
          <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
            <div>
              <p className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-1">
                Cardápio • Gestão
              </p>
              <h2 className="text-2xl font-black">Novo Item</h2>
            </div>
            <button
              onClick={() => setIsPanelOpen(false)}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-white">
            <CreateMenuItemForm onSubmit={handleCreateSubmit} />
          </div>
        </SheetContent>
      </Sheet>

      {/* SHEET - GERENCIAR / EDITAR ITEM */}
      <Sheet open={isPanelEditOpen} onOpenChange={setIsPanelEditOpen}>
        <SheetContent
          side="right"
          className="w-[90%] sm:max-w-[400px] p-0 flex flex-col h-full bg-white border-l border-gray-200 [&>button]:hidden outline-none"
        >
          {itemSelected && (
            <>
              <SheetTitle className="sr-only">
                Gerenciar {itemSelected.name}
              </SheetTitle>

              {manageView === "options" ? (
                <RootMenuItemOptions
                  item={itemSelected}
                  onClose={() => setIsPanelEditOpen(false)}
                  onEditClick={() => setManageView("edit")}
                  onDeleteClick={handleDelete}
                />
              ) : (
                <>
                  {/* Header da Edição */}
                  <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setManageView("options")}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 hover:bg-gray-100 text-gray-500 transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <div>
                        <p className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-1">
                          Editando Produto
                        </p>
                        <h2 className="text-xl font-black truncate max-w-[180px]">
                          {itemSelected.name}
                        </h2>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsPanelEditOpen(false)}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-white">
                    <EditMenuItemForm
                      item={itemSelected as any}
                      onSubmit={handleEditSubmit}
                      onDelete={handleDelete}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default RootMenuPage;
