"use client";

import { useState } from "react";
import { Camera, X, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { storageService } from "../../services/store/storage.service";

interface ImageUploaderProps {
  value?: string | null;
  onUploadComplete: (url: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
  label?: string;
  maxSizeMB?: number;
}

export function UniversalImageUploader({
  value,
  onUploadComplete,
  onRemove,
  disabled = false,
  label = "Imagem do Produto",
  maxSizeMB = 5,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação de tamanho
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`A imagem deve ter no máximo ${maxSizeMB}MB`);
      return;
    }

    try {
      setIsUploading(true);

      const urls = await storageService.uploadFile(file);

      if (urls?.url) {
        onUploadComplete(urls.url);
        toast.success("Imagem enviada com sucesso!");
      }
    } catch (err) {
      console.error("Erro ao fazer upload:", err);
      toast.error("Falha ao enviar a imagem. Tente novamente.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleRemove = () => {
    onRemove?.();
    toast.info("Imagem removida");
  };

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <Camera size={16} className="text-primary" />
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      </div>

      {/* Área de Upload */}
      <div className="flex justify-center">
        <div className="relative group w-40 h-40">
          {value ? (
            /* Preview da imagem */
            <>
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover rounded-[32px] border-2 border-border shadow-sm"
              />
              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled || isUploading}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            /* Área de Upload */
            <label
              className={`
                flex flex-col items-center justify-center w-full h-full 
                bg-muted/30 border-2 border-dashed border-border rounded-[32px] 
                cursor-pointer hover:bg-muted/50 hover:border-primary/50 
                transition-all duration-200
                ${disabled ? "opacity-60 cursor-not-allowed" : ""}
              `}
            >
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 size={32} className="animate-spin text-primary" />
                  <span className="text-[10px] font-medium text-muted-foreground mt-3">
                    Enviando...
                  </span>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <Upload size={24} className="text-muted-foreground" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                    Adicionar Foto
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-1">
                    JPG, PNG • máx {maxSizeMB}MB
                  </span>
                </>
              )}

              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={disabled || isUploading}
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
