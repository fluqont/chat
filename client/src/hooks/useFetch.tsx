import { useRef, useState } from "react";

export default function useFetch() {
  const [data, setData] = useState<null | Record<string, any>>(null);
  const [error, setError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);

  const abortControllerRef = useRef<null | AbortController>(null);
  async function fetchData(url: string, options?: RequestInit) {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setIsLoading(true);

    try {
      url = import.meta.env.VITE_API_URL + url;
      options = {
        signal: abortControllerRef.current?.signal,
        ...options,
      };
      const response = await fetch(url, options);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setData(data);
      setError(null);
      return data;
    } catch (err: any) {
      if (err.name === "AbortError") {
        return console.log("aborted");
      }

      setData(null);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return { data, error, isLoading, fetchData };
}
