import { useRef, useState } from "react";

export default function useFetch() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const abortControllerRef = useRef(null);
  async function fetchData(url, options) {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setIsLoading(true);

    try {
      const fetchArgs = [
        import.meta.env.VITE_API_URL + url,
        {
          signal: abortControllerRef.current?.signal,
          ...options,
        },
      ];
      const response = await fetch(...fetchArgs);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setData(data);
      setError(null);
      return data;
    } catch (err) {
      setData(null);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return { data, error, isLoading, fetchData };
}
