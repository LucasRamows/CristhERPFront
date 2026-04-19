import api from "../api";

export const storageService = {
  async uploadFile(file: File): Promise<{ message: string; url: string }> {
    console.log("asdasd");
    const formData = new FormData();

    formData.append("file", file);
    const { data } = await api.post<{ message: string; url: string }>(
      "/storage/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return data;
  },
};
