import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import SeoInput from "shared/components/SeoInput";
import { useHome } from "shared/hooks/useHome";

export default function index() {
  const { data, mutate } = useHome();

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

  useEffect(()=>{
    if(data?.oSeo){
        reset({
            aKeywords:typeof data?.oSeo?.aKeywords === "object" ? data?.oSeo?.aKeywords?.join(",") : "",
            sDescription:data?.oSeo?.sDescription,
            sTitle:data?.oSeo?.sTitle,
            sCUrl:data?.oSeo?.sCUrl,
        })
    }

  },[data])

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
