import api from "../../services/api";

const useHelps = () => {
  const findAll = async (params) => {
    try {
      const { data } = await api.request({
        url: `/helps`,
        method: 'GET',
        params,
      });
      return data;
    } catch (error) {
      console.error("Erro ao buscar todos os dados:", error);
      throw error; 
    }
  };

  const list = async (params) => {
  };

 

  return {
    findAll,
    list,
    save,
    update,
    remove,
  };
};

export default useHelps;
