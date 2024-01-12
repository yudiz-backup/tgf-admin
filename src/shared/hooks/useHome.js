import { toaster } from "helper/helper";
import { getHomeData, updateHomeData } from "query/home/home.api";
import { useMutation, useQuery } from "react-query";

export const useHome = (setLoading = () => {}) => {
  const { data, isLoading, isSuccess, refetch } = useQuery(
    "homePageData",
    () => getHomeData(),
    {
      select: (data) => data?.data?.data,
    }
  );

  // EDIT HOME DATA
  const { mutate } = useMutation(updateHomeData, {
    onSettled: (response) => {
      setLoading(false);
      if (response) {
        toaster(response.data.message);
        // refetch();
      } else {
        toaster(response.data.message, "error");
      }
    },
  });

  return {
    data,
    mutate,
    isSuccess,
    isLoading,
    refetch,
  };
};
