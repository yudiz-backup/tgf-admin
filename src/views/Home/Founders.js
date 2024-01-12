import Delete from "assets/images/icons/delete";
import React, { useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import CommonInput from "shared/components/CommonInput";
import Wrapper from "shared/components/Wrap";
import { useAboutUs } from "shared/hooks/useAboutUs";
import { useS3Upload } from "shared/hooks/useS3Upload";

const Founders = () => {
  const { uploadFile } = useS3Upload();

  const { data, mutate } = useAboutUs();
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
    if (data?.aFounders?.length > 0) {
      const foundersArray = data.aFounders.map((value) => ({
        sName: value.sName,
        sDesignation: value.sDesignation,
        sDescription: value.sDescription,
        sPath: value.sPath,
      }));

      reset({
        fields: foundersArray,
      });
    }
  }, [data?.aFounders?.length, reset]);

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
        const result = await uploadFile("founders", imageArray);

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
        ...data,
        aFounders: updatedArray?.map((field) => ({
          sName: field?.sName,
          sDesignation: field?.sDesignation,
          sDescription: field?.sDescription,
          sPath: field?.sPath,
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
              <Col lg={12}>
                <Wrapper>
                  {fields.map((field, index) => (
                    <Row key={field.id}>
                      <Col xxl={4} lg={6} className="mb-2">
                        <Row>
                          <Col lg={12} className="mb-2">
                            <Form.Group className="form-group">
                              <CommonInput
                                type="text"
                                register={register}
                                errors={errors}
                                className={`form-control ${
                                  errors?.fields?.[index]?.sName?.message &&
                                  "error"
                                }`}
                                name={`fields[${index}].sName`}
                                label="Name"
                                placeholder={`Enter Name`}
                                validation={{
                                  required: {
                                    value: true,
                                    message: "This field is required",
                                  },
                                }}
                              />
                              {errors?.fields?.[index]?.sName && (
                                <Form.Control.Feedback type="invalid">
                                  {errors.fields[index].sName.message}
                                </Form.Control.Feedback>
                              )}
                            </Form.Group>
                          </Col>
                          <Col lg={12} className="mb-2">
                            <Form.Group className="form-group">
                              <CommonInput
                                type="text"
                                register={register}
                                errors={errors}
                                className={`form-control ${
                                  errors?.fields?.[index]?.sDesignation
                                    ?.message && "error"
                                }`}
                                name={`fields[${index}].sDesignation`}
                                label="Designation"
                                placeholder={`Enter Designation`}
                                validation={{
                                  required: {
                                    value: true,
                                    message: "Designation is required",
                                  },
                                }}
                              />
                              {errors?.fields?.[index]?.sDesignation && (
                                <Form.Control.Feedback type="invalid">
                                  {errors.fields[index]?.sDesignation?.message}
                                </Form.Control.Feedback>
                              )}
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                      <Col xxl={3} lg={6} className="mb-2">
                        <Form.Group className="form-group">
                          <CommonInput
                            // type="text"
                            register={register}
                            errors={errors}
                            className={`form-control ${
                              errors?.fields?.[index]?.sDescription?.message &&
                              "error"
                            }`}
                            name={`fields[${index}].sDescription`}
                            label="Description"
                            placeholder={`Enter Description`}
                            validation={{
                              required: {
                                value: true,
                                message: "Description is required",
                              },
                            }}
                          />
                          {errors?.fields?.[index]?.sDescription && (
                            <Form.Control.Feedback type="invalid">
                              {errors.fields[index]?.sDescription?.message}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      </Col>
                      <Col xxl={3} lg={6} className="mb-2">
                        <Form.Group className="form-group">
                          <Form.Label>Image</Form.Label>
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
                                        const fileExtension = value?.name
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
                      <Col xxl={2} lg={6} className="mb-2">
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

export default Founders;
