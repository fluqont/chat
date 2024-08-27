import { useState } from "react";

export default function useFetch() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function fire(route, options) {
    setIsLoading(true);
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + route,
        options,
      );
      const result = await response.json();

      // http error
      if (!response.ok) {
        setError(
          `${response.status} (${response.statusText}): ${result.error}`,
        );
      } else {
        setData(result);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return { data, error, isLoading, fire };
}
