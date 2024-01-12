import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import CommonInput from "shared/components/CommonInput";
import Wrapper from "shared/components/Wrap";
import { useMutation, useQuery } from "react-query";
import {
  getFeatureImageData,
  updateFeatureImageData,
} from "query/home/home.api";
import { toaster } from "helper/helper";
import { useS3Upload } from "shared/hooks/useS3Upload";
import { Loader } from "shared/components/Loader";

const FeatureImages = () => {
  const { uploadFile } = useS3Upload();
  const [loading, setLoading] = useState(false);
  const { data, isLoading } = useQuery(
    "featureImagesData",
    () => getFeatureImageData(),
    {
      select: (data) => data?.data?.data,
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
  } = useForm({
    mode: 'all',
    defaultValues: {
      fields: Array.from({ length: 4 }, (_, index) => ({ value: `Default ${index + 1}` })),
    },
  })

  const { fields, append } = useFieldArray({
    control,
    name: "fields",
  });

  useEffect(() => {
    if (data?.aFantasyFeature?.length > 0) {
      const array = data.aFantasyFeature.map((value) => ({
        sTitle: value.sTitle,
        sDescription: value.sDescription,
        sPath: value.sPath,
        sImage: value.sImage,
      }));

      reset({
        fields: array,
      });
    }
  }, [data?.aFantasyFeature?.length, reset]);

  // EDIT HOME DATA
  const { mutate } = useMutation(updateFeatureImageData, {
    onSettled: (response) => {
      setLoading(false);
      if (response) {
        toaster(response.data.message);
        // refetch(); s
      } else {
        toaster(response.data.message, "error");
      }
    },
  });

  async function onSubmit(formData) {
    setLoading(true);
    let updatedArray = [...formData.fields];

    const options = formData?.fields.map((item) => item.sPath);
    const contentImages = formData?.fields.map((item) => item.sImage);

    if (options?.length > 0) {
      const imageArray = [];
      options.map((data, i) => {
        if (typeof data === "object") {
          const file = data;
          imageArray.push({
            sFlag: i.toString(),
            sFileName: file.name,
            sContentType: file.type,
            file,
          });
        }
        return null;
      });
      if (imageArray.length > 0) {
        const result = await uploadFile("feature", imageArray);
        if (result?.err) {
          setLoading(false);
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
    }
    if (contentImages?.length > 0) {
      const imageArray = [];
      contentImages.map((data, i) => {
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
        const result = await uploadFile("feature", imageArray);
        if (result?.err) {
          setLoading(false);
          return null;
        } else {
          updatedArray = formData?.fields.map((item, index) => {
            const pathIndex = index.toString();
            if (result[pathIndex] && result[pathIndex].sPath) {
              item.sImage = result[pathIndex].sPath;
            }
            return item;
          });
        }
      }
      const payload = {
        ...data,
        aFantasyFeature: updatedArray?.map((field) => ({
          sTitle: field.sTitle,
          sDescription: field.sDescription,
          sPath: field.sPath,
          sImage: field.sImage,
        })),
      };
      mutate(payload);
      // console.log("payload", payload);
      
    }
  }

  return (
    <>
      {(loading || isLoading) && <Loader />}
      <Form
        className="step-one"
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="personal-details">
          <div className="user-form">
            <Row>
              <Col xl={12}>
                <Wrapper>
                  {fields.map((field, index) => (
                    <Row key={field.id} className="mt-4">
                      <Col xl={6}>
                        <Row>
                          <Col lg={6} md={12}>
                            <Form.Group className="form-group">
                              <CommonInput
                                type="text"
                                register={register}
                                errors={errors}
                                className={`form-control ${
                                  errors?.fields?.[index]?.sTitle?.message &&
                                  "error"
                                }`}
                                name={`fields[${index}].sTitle`}
                                label="Title"
                                placeholder={`Enter text`}
                                required
                                validation={{
                                  required: {
                                    value: true,
                                    message: "This field is required",
                                  },
                                }}
                              />
                              {errors?.fields?.[index]?.sTitle && (
                                <Form.Control.Feedback type="invalid">
                                  {errors.fields[index].sTitle.message}
                                </Form.Control.Feedback>
                              )}
                            </Form.Group>
                          </Col>
                          <Col lg={6} md={12}>
                            <Form.Group className="form-group">
                              <CommonInput
                                type="text"
                                register={register}
                                errors={errors}
                                className={`form-control ${
                                  errors?.fields?.[index]?.sDescription
                                    ?.message && "error"
                                }`}
                                name={`fields[${index}].sDescription`}
                                label="Description"
                                placeholder={`Enter Description`}
                                required
                                validation={{
                                  required: {
                                    value: true,
                                    message: "This field is required",
                                  },
                                  maxLength: {
                                    value: 100,
                                    message: 'Description cannot exceed 100 characters'
                                }
                                }}
                              />
                              {errors?.fields?.[index]?.sDescription && (
                                <Form.Control.Feedback type="invalid">
                                  {errors.fields[index].sDescription.message}
                                </Form.Control.Feedback>
                              )}
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                      <Col xl={6}>
                        <Row>
                          <Col lg={6}>
                            <Form.Group className="form-group">
                              <Form.Label>Icon</Form.Label>
                              <div className="fileinput">
                                <div className="inputtypefile m-0   ">
                                  <div className="inputMSG">
                                    <span>Upload Image</span>
                                  </div>

                                  <Controller
                                    name={`fields[${index}].sPath`}
                                    control={control}
                                    rules={{
                                      required: "Please add ticket logo",
                                      // validate: {
                                      //   fileType: (value) => {
                                      //     if (
                                      //       value &&
                                      //       typeof watch(
                                      //         `fields[${index}].sPath`
                                      //       ) !== "string"
                                      //     ) {
                                      //       const allowedFormats = [
                                      //         "jpeg",
                                      //         "png",
                                      //         "jpg",
                                      //         "JPEG",
                                      //         "PNG",
                                      //         "JPG",
                                      //       ];
                                      //       const fileExtension = value.name
                                      //         .split(".")
                                      //         .pop()
                                      //         .toLowerCase();

                                      //       if (
                                      //         !allowedFormats.includes(
                                      //           fileExtension
                                      //         )
                                      //       ) {
                                      //         return "Unsupported file format";
                                      //       }

                                      //       const maxSize = 110001000; // 1MB in bytes
                                      //       if (value.size >= maxSize) {
                                      //         return "File size must be less than 1MB";
                                      //       }
                                      //     }
                                      //     return true;
                                      //   },
                                      // },
                                    }}
                                    render={({ field: { onChange, ref } }) => {
                                      return (
                                        <>
                                          <Form.Control
                                            ref={ref}
                                            type="file"
                                            name={`fields[${index}].sPath`}
                                            // disabled={updateFlag}
                                            // accept=".jpg,.jpeg,.png,.JPEG,.JPG,.PNG"
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
                            <div>
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
                                          process.env
                                            .REACT_APP_AWS_S3_BASE_URL +
                                          watch(`fields[${index}].sPath`)
                                        }
                                        alt="altImage"
                                      />{" "}
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </Col>
                          <Col lg={6}>
                            <Form.Group className="form-group">
                              <Form.Label>Content Image</Form.Label>
                              <div className="fileinput">
                                <div className="inputtypefile m-0   ">
                                  <div className="inputMSG">
                                    <span>Upload Image</span>
                                  </div>

                                  <Controller
                                    name={`fields[${index}].sImage`}
                                    control={control}
                                    rules={{
                                      required: "Please add ticket logo",
                                      validate: {
                                        fileType: (value) => {
                                          if (
                                            value &&
                                            typeof watch(
                                              `fields[${index}].sImage`
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

                                            const maxSize = 110001000; // 1MB in bytes
                                            if (value.size >= maxSize) {
                                              return "File size must be less than 1MB";
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
                                            name={`fields[${index}].sImage`}
                                            // disabled={updateFlag}
                                            accept=".jpg,.jpeg,.png,.JPEG,.JPG,.PNG"
                                            errors={errors}
                                            className={
                                              errors?.fields?.[index]?.sImage &&
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
                                  {errors &&
                                    errors?.fields?.[index]?.sImage && (
                                      <Form.Control.Feedback type="invalid">
                                        {
                                          errors?.fields?.[index]?.sImage
                                            .message
                                        }
                                      </Form.Control.Feedback>
                                    )}
                                </span>
                              </div>
                            </Form.Group>
                            <div>
                              <div className="document-preview-group play-doc-preview">
                                {watch(`fields[${index}].sImage`) &&
                                  (typeof watch(`fields[${index}].sImage`) !==
                                  "string" ? (
                                    <div className="document-preview">
                                      {" "}
                                      <img
                                        src={URL.createObjectURL(
                                          watch(`fields[${index}].sImage`)
                                        )}
                                        alt="altImage"
                                      />{" "}
                                    </div>
                                  ) : (
                                    <div className="document-preview">
                                      <img
                                        src={
                                          process.env
                                            .REACT_APP_AWS_S3_BASE_URL +
                                          watch(`fields[${index}].sImage`)
                                        }
                                        alt="altImage"
                                      />{" "}
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  ))}
                  <div className="mt-4 d-flex gap-3">
                    <Button
                      variant="secondary"
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
    </>
  );
};

export default FeatureImages;
