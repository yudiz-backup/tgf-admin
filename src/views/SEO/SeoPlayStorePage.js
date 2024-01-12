import { toaster } from "helper/helper";
import { editPlayStoreData, gerPlayStoreData } from "query/playStore/playstore.api";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import SeoInput from "shared/components/SeoInput";

export default function SeoPlaStorePage() {
  const { data } = useQuery("playStoreData", () => gerPlayStoreData(), {
    select: (data) => data?.data?.data,
  });

  const { mutate } = useMutation(editPlayStoreData, {
    onSettled: (response) => {
      if (response) {
        toaster(response.data.message);
      } else {
        toaster(response.data.message, "error");
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    mode: "all",
    defaultValues: {
      fields: [{ value: "" }],
    },
  });

  useEffect(() => {
    if (data?.oSeo) {
      reset({
        aKeywords: typeof data?.oSeo?.aKeywords === "object" ? data?.oSeo?.aKeywords?.join(",") : "",
        sDescription: data?.oSeo?.sDescription,
        sTitle: data?.oSeo?.sTitle,
        sCUrl: data?.oSeo?.sCUrl,
      });
    }
  }, [data]);

  const onSubmit = (formData) => {
    const payload = {
      ...data,
      oSeo: {
        aKeywords: formData.aKeywords,
        sDescription: formData.sDescription,
        sTitle: formData.sTitle,
      },
    };
    if (formData.sCUrl) {
      payload.oSeo.sCUrl = formData.sCUrl;
    }

    mutate(payload);
  };
  return (
    <SeoInput
      data={data}
      register={register}
      handleSubmit={handleSubmit}
      errors={errors}
      control={control}
      onSubmit={onSubmit}
    />
  );
}
