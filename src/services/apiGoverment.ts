import axios from "axios";

/**
 * IBGE Service API
 */
const apiGoverment = axios.create({
  baseURL: "https://servicodados.ibge.gov.br/api/v1",
});

/**
 * ViaCEP Service API for address lookup
 */
export const fetchAddressByCep = async (cep: string) => {
  const cleanCep = cep.replace(/\D/g, "");
  if (cleanCep.length !== 8) return null;
  
  try {
    const { data } = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
    if (data.erro) return null;
    return {
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      uf: data.uf,
      cep: data.cep,
    };
  } catch (error) {
    console.error("Error fetching address by CEP:", error);
    return null;
  }
};

export default apiGoverment;