import { toaster } from "helper/helper";
import {
  getContactUsData,
  updateContactUsData,
} from "query/contactUs/contactUs.api";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import SeoInput from "shared/components/SeoInput";

export default function SeoContactUs() {
  const { data } = useQuery("contactUsData", () => getContactUsData(), {
    select: (data) => data?.data?.data,
    onSuccess: (data) => {
      reset({ ...data });
    },
  });

  const { mutate } = useMutation(updateContactUsData, {
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
