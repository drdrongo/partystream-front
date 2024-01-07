import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API = "images/list";
const BACKEND_URL = new URL(API, import.meta.env.VITE_BASE_URL).toString();

const useImages = () => {
  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: ["imageKeys"],
    queryFn: () =>
      axios
        .get(BACKEND_URL)
        .then((res) => res.data)
        .catch((error) => console.error(error)),
    refetchInterval: 10_000,
  });

  // if (isLoading) return "Loading...";

  // if (error) return "An error has occurred: " + error.message;

  return { imageKeys: data, isLoading, error };
};

export default useImages;
