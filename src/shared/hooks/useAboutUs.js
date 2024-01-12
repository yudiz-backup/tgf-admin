import { toaster } from "helper/helper";
import { getAboutUsData, updateAboutUsData } from "query/aboutUs/aboutUs.api";
import { useMutation, useQuery } from "react-query";

export const useAboutUs = () => {
  //get about us data
  const { data, isSuccess, isLoading,refetch } = useQuery(
    "aboutUsData",
    () => getAboutUsData(),
    {
      select: (data) => data?.data?.data,
    }
  );

  // Edit About us data
  const { mutate, isSuccess: mutationSuccess  } = useMutation(updateAboutUsData, {
    onSettled: (response) => {
      if (response) {
        toaster(response.data.message);
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
    mutationSuccess
  };
};
