import Delete from "assets/images/icons/delete";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import CommonInput from "shared/components/CommonInput";
import { Loader } from "shared/components/Loader";
import Wrapper from "shared/components/Wrap";
import { useHome } from "shared/hooks/useHome";
import { useS3Upload } from "shared/hooks/useS3Upload";

function Banner() {
  const { uploadFile } = useS3Upload();
  const [loading, setLoading] = useState(false)
  const { data, isLoading, mutate } = useHome(setLoading);
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
          sPath: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  useEffect(() => {
    if (data?.aBackGroundImages?.length > 0) {
      const imageArray = data.aBackGroundImages.map((value) => ({
        nPriority: value.nPriority,
        sPath: value?.sPath,
      }));
      reset({
        fields: imageArray,
      });
    }
  }, [data?.aBackGroundImages?.length]);

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
        const result = await uploadFile("banner", imageArray);
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
        aBackGroundImages: updatedArray?.map((field) => ({
          nPriority: field.nPriority,
          sPath: field.sPath,
        })),
      };

      mutate(payload);
    }
  }
  return (
    <Form
      className="step-one"
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      {(isLoading||loading) && <Loader />}
      <div className="personal-details">
        <div className="user-form">
          <Row>
            <Col xxl={8}>
              <Wrapper>
                <div className="mt-2">
                  {fields.map((field, index) => (
                    <Row key={field.id}>
                      <Col lg={4} md={6} className="mb-2">
                        <Form.Group className="form-group">
                          <CommonInput
                            type="text"
                            register={register}
                            errors={errors}
                            className={`form-control ${
                              errors?.fields?.[index]?.nPriority?.message &&
                              "error"
                            }`}
                            name={`fields[${index}].nPriority`}
                            label="Image Priority"
                            placeholder={`Enter Image Priority`}
                            required
                            validation={{
                              required: {
                                value: true,
                                message: "Priority is required",
                              },
                              pattern: {
                                value: /^[0-9.]+$/,
                                message: "Only numbers are allowed",
                              },
                              maxLength: {
                                value: 4,
                                message: "Priority can not exceed 4 digits",
                              },
                            }}
                          />
                          {errors?.fields?.[index]?.nPriority && (
                            <Form.Control.Feedback type="invalid">
                              {errors.fields[index].nPriority.message}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      </Col>
                      <Col lg={4} md={6} className="mb-2">
                        <Form.Group className="form-group">
                          <div className="fileinput">
                            <Form.Label>Image</Form.Label>
                            <div className="inputtypefile m-0   ">
                              <div className="inputMSG">
                                <span>Upload Image</span>
                              </div>
                              <Controller
                                name={`fields[${index}].sPath`}
                                control={control}
                                rules={{
                                  required: "Please add Image",
                                  validate: {
                                    fileType: (value) => {
                                      if (
                                        value &&
                                        typeof watch(
                                          `fields[${index}].sPath`
                                        ) !== "string"
                                      ) {
                                        const allowedFormats = [
                                          "jpeg",
                                          "png",
                                          "jpg",
                                          "JPEG",
                                          "PNG",
                                          "JPG",
                                        ];
                                        const fileExtension = value.name
                                          .split(".")
                                          .pop()
                                          .toLowerCase();

                                        if (
                                          !allowedFormats.includes(
                                            fileExtension
                                          )
                                        ) {
                                          return "Unsupported file format";
                                        }

                                        const maxSize = 1 * 2000 * 1000; // 1MB in bytes
                                        if (value.size >= maxSize) {
                                          return "File size must be less than 2MB";
                                        }
                                      }
                                      return true;
                                    },
                                  },
                                }}
                                render={({ field: { onChange, ref } }) => {
                                  return (
                                    <>
                                      <Form.Control
                                        ref={ref}
                                        type="file"
                                        name={`fields[${index}].sPath`}
                                        // disabled={updateFlag}
                                        accept=".jpg,.jpeg,.png,.JPEG,.JPG,.PNG"
                                        errors={errors}
                                        className={
                                          errors?.fields?.[index]?.sPath &&
                                          "error"
                                        }
                                        onChange={(e) => {
                                          onChange(e.target.files[0]);
                                        }}
                                      />
                                    </>
                                  );
                                }}
                              />
                            </div>

                            <span className="card-error">
                              {errors && errors?.fields?.[index]?.sPath && (
                                <Form.Control.Feedback type="invalid">
                                  {errors?.fields?.[index]?.sPath.message}
                                </Form.Control.Feedback>
                              )}
                            </span>
                          </div>
                        </Form.Group>
                      </Col>
                      <Col lg={4} md={6} className="mb-2">
                        <div className="document-preview-group play-doc-preview">
                          {watch(`fields[${index}].sPath`) &&
                            (typeof watch(`fields[${index}].sPath`) !==
                            "string" ? (
                              <div className="document-preview">
                                {" "}
                                <img
                                  src={URL.createObjectURL(
                                    watch(`fields[${index}].sPath`)
                                  )}
                                  alt="altImage"
                                />{" "}
                              </div>
                            ) : (
                              <div className="document-preview">
                                <img
                                  src={
                                    process.env.REACT_APP_AWS_S3_BASE_URL +
                                    watch(`fields[${index}].sPath`)
                                  }
                                  alt="altImage"
                                />{" "}
                              </div>
                            ))}
                        </div>
                        <div className="d-flex gap-2">
                          {index !== 0 && (
                            <Button
                              variant="danger"
                              className="mt-2"
                              onClick={() => remove(index)}
                              size="sm"
                            >
                              <Delete />
                            </Button>
                          )}
                        </div>
                      </Col>
                    </Row>
                  ))}
                </div>
                <div className="mt-2">
                  <Button
                    variant="secondary"
                    className="me-2"
                    onClick={() => append({ value: "" })}
                  >
                    Add
                  </Button>
                  <Button variant="primary" type="submit">
                    Save
                  </Button>
                </div>
              </Wrapper>
            </Col>
          </Row>
        </div>
      </div>
    </Form>
  );
}

export default Banner;
