import { toaster } from "helper/helper";
import {
  editPlayStoreData,
  gerPlayStoreData,
} from "query/playStore/playstore.api";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import ImagePriority from "shared/components/ImagePriority";
import { Loader } from "shared/components/Loader";
import { useS3Upload } from "shared/hooks/useS3Upload";

function AppImages() {
  const { uploadFile } = useS3Upload();
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
  } = useForm({
    mode: "all",
    defaultValues: {
      fields: [
        {
          nPriority: "",
          sImage: "",
        },
      ],
    },
  });

  const { data, isLoading } = useQuery(
    "playStoreData",
    () => gerPlayStoreData(),
    {
      select: (data) => data?.data?.data,
    }
  );

  // EDIT DATA
  const { mutate } = useMutation(editPlayStoreData, {
    onSettled: (response) => {
      setLoading(false)
      if (response) {
        toaster(response.data.message);
      } else {
        toaster(response.data.message, "error");
      }
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  useEffect(() => {
    if (data?.aAppImages?.length > 0) {
      const appImageArray = data.aAppImages.map((value) => ({
        nPriority: value.nPriority,
        sPath: value?.sPath,
      }));

      reset({
        fields: appImageArray,
      });
    }
  }, [data?.aAppImages?.length]);

  async function onSubmit(formData) {
    setLoading(true)
    let updatedArray = [...formData.fields];

    const options = formData?.fields.map((item) => item.sPath);

    if (options?.length > 0) {
      const imageArray = [];
      options.map((data, i) => {
        if (typeof data === "object") {
          const file = data;
          imageArray.push({
            sFlag: i.toString(),
            sFileName: file.name.replace(/\.(\w+)$/, ""),
            sContentType: file.type,
            file,
          });
        }
        return null;
      });
      if (imageArray.length > 0) {
        const result = await uploadFile("playstore", imageArray);
        if (result?.err) {
          setLoading(false)
          return null;
        } else {
          updatedArray = formData?.fields.map((item, index) => {
            const pathIndex = index.toString();
            if (result[pathIndex] && result[pathIndex].sPath) {
              item.sPath = result[pathIndex].sPath;
            }
            return item;
          });
        }
      }
      const payload = {
        ...data,
        aAppImages: updatedArray?.map((field) => ({
          nPriority: field.nPriority,
          sPath: field.sPath,
        })),
      };
      mutate(payload);
    }
  }
  return (
    <>
      {isLoading || loading && <Loader />}
      <ImagePriority
        register={register}
        onSubmit={onSubmit}
        handleSubmit={handleSubmit}
        fields={fields}
        append={append}
        control={control}
        remove={remove}
        errors={errors}
        watch={watch}
      />
    </>
  );
}

export default AppImages;
