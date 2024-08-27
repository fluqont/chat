import { useState } from "react";

export default function useFetch(route, options) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function fire() {
    try {
      const response = await fetch(
        "http://localhost:3000/api" + route,
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
