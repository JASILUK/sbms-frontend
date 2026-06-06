import { useGetMeQuery } from "./authApi";

export const useSession = () => {

  const { data, isLoading, isError } = useGetMeQuery();

  return {
    session: data || null,
    isLoading,
    isError
  };

};