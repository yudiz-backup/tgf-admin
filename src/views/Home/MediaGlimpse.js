import Delete from "assets/images/icons/delete";
import { toaster } from "helper/helper";
import {
  getMediaglimpseData,
  updateMediaglimpseData,
} from "query/home/home.api";
import React, { useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import CommonInput from "shared/components/CommonInput";
import Wrapper from "shared/components/Wrap";
import { URL_REGEX } from "shared/constants";
import { useS3Upload } from "shared/hooks/useS3Upload";

const MediaGlimpse = () => {
  const { uploadFile } = useS3Upload();
  const { data } = useQuery("mediaGlimpseData", () => getMediaglimpseData(), {
    select: (data) => data?.data?.data,
  });

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
      fields: [{ value: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  useEffect(() => {
    if (data?.aMediaGlim?.length > 0) {
      const imageArray = data.aMediaGlim.map((value) => ({
        sTitle: value.sTitle,
        sPath: value.sPath,
        sUrl: value.sUrl
      }));

      reset({
        fields: imageArray,
      });
    }
  }, [data?.aMediaGlim?.length]);

  const { mutate } = useMutation(updateMediaglimpseData, {
    onSettled: (response) => {
      if (response) {
        toaster(response.data.message);
      } else {
        toaster(response.data.message, "error");
      }
    },
  });
  async function onSubmit(formData) {
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
        const result = await uploadFile("mediaglimpse", imageArray);
        if (result?.err) {
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
        ePage: "MEDIAGLIM",
        aMediaGlim: updatedArray?.map((field) => ({
          sTitle: field.sTitle,
          sPath: field.sPath,
          sUrl: field.sUrl
        })),
      };
      mutate(payload);
    }
  }

  return (
    <>
      <Form
        className="step-one"
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="personal-details">
          <div className="user-form">
            <Row>
              <Col xxl={8} lg={12}>
                <Wrapper>
                  {fields.map((field, index) => (
                    <Row key={field.id}>
                      <Col xl={3} lg={3} md={6} className="mb-2">
                        <Form.Group className="form-group">
                          <CommonInput
                            type="text"
                            register={register}
                            // errors={errors}
                            className={`form-control ${
                              errors?.fields?.[index]?.sTitle?.message &&
                              "error"
                            }`}
                            name={`fields[${index}].sTitle`}
                            label="Title"
                            placeholder={`Enter text`}
                          />
                          {errors?.fields?.[index]?.sTitle && (
                            <Form.Control.Feedback type="invalid">
                              {errors.fields[index].sTitle.message}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      </Col>
                      <Col xl={3} lg={3} md={6} className="mb-2">
                        <Form.Group className="form-group">
                          <CommonInput
                            type="text"
                            register={register}
                            errors={errors}
                            className={`form-control ${
                              errors?.fields?.[index]?.sUrl?.message &&
                              "error"
                            }`}
                            name={`fields[${index}].sUrl`}
                            label="Link"
                            placeholder={`Enter link`}
                            required
                        validation={{
                          required: {
                            value: true,
                            message: "This field is required",
                          },
                          pattern: {
                            value: URL_REGEX,
                            message: "Invalid Link",
                          },
                        }}
                          />
                          {errors?.fields?.[index]?.sUrl && (
                            <Form.Control.Feedback type="invalid">
                              {errors.fields[index].sUrl.message}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      </Col>
                      <Col xl={3} lg={3} md={6} className="mb-2">
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
                                  required: "Please add logo",
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

                                        const maxSize = 1 * 1000 * 1000; // 1MB in bytes
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
                      {watch(`fields[${index}].sPath`) && (
                        <Col xl={3} lg={3} md={6} className="mb-2">
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
                      )}
                    </Row>
                  ))}
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
    </>
  );
};

export default MediaGlimpse;
