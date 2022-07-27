import useSWR, { SWRConfiguration } from 'swr';
import { IProduct } from '../interfaces/products';

export const useProducts = <T>(url: string, config: SWRConfiguration = {}) => {
  // const fetcher = (...args: [key: string]) => fetch(...args).then((res) => res.json());

  const { data, error } = useSWR<T>(`/api${url}`, config);

  return {
    products: data || [],
    isLoading: !error && !data,
    isError: error,
  };
};
