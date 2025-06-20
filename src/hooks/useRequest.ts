import { useState, useCallback } from "react";
import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

interface RequestState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface UseRequestOutput<T> {
  execute: (data?: any) => Promise<AxiosResponse<T> | void>;
  data: T | null;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

const useRequest = <T>(
  url: string,
  method: RequestMethod = "GET",
  config: AxiosRequestConfig = {}
): UseRequestOutput<T> => {
  const [state, setState] = useState<RequestState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  const execute = useCallback(
    async (data?: any) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const response: AxiosResponse<T> = await axios({
          url,
          method,
          headers: config.headers,
          data,
          ...config,
        });


        setState({
          data: response.data,
          loading: false,
          error: null,
        });

        return response;
      } catch (error) {
        const axiosError = error as AxiosError<any>;
        console.error("Request error:", axiosError);
        console.error("Response status:", axiosError.response?.status);
        console.error("Response data:", axiosError.response?.data);
        
        const errorMessage =
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          axiosError.message ||
          "خطایی رخ داده است";

        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));

        throw error;
      }
    },
    [url, method, config]
  );

  return {
    execute,
    ...state,
    reset,
  };
};

export default useRequest;
