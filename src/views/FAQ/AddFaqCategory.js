import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import CommonInput from "shared/components/CommonInput";
import Wrapper from "shared/components/Wrap";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { toaster } from "helper/helper";
import { route } from "shared/constants/AllRoutes";
import { useS3Upload } from "shared/hooks/useS3Upload";
import { addCategory } from "query/faq/faq.api";

const AddFaqCategory = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm({ mode: "all" });
  const { uploadFile } = useS3Upload();

  const { mutate } = useMutation(addCategory, {
    onSettled: (response) => {
      if (response) {
        toaster(response.data.message);
        navigate(route.faq_category);
        reset();
      } else {
        toaster(response.data.message, "error");
      }
    },
  });

  async function onSubmit(formData) {
    const payload = {
      sTitle: formData.sTitle,
      sDescription: formData.sDescription,
      sPath: formData.sPath,
    };
    if (typeof formData?.sPath === "object") {
      const data = [
        {
          sFileName: formData?.sPath?.name,
          sContentType: formData?.sPath.type,
          sFlag: "sPath",
          file: formData?.sPath,
        },
      ];
      const result = await uploadFile("faq", data);
      if (result?.err) {
        return null;
      } else {
        for (const key in result) {
          payload[key] = result[key]?.sPath;
        }
      }
    }
    mutate(payload);
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
              <Col xxl={8}>
                <Wrapper>
                  <Row>
                    <Col lg={6}>
                      <Row>
                        <Col md={12} className="mt-2">
                          <CommonInput
                            type="text"
                            register={register}
                            errors={errors}
                            className={`form-control ${
                              errors?.sTitle && "error"
                            }`}
                            name="sTitle"
                            label="Title"
                            placeholder="Enter Title"
                            required
                            onChange={(e) => {
                              e.target.value =
                                e.target.value?.trim() &&
                                e.target.value.replace(/^[0-9]+$/g, "");
                            }}
                            validation={{
                              required: {
                                value: true,
                                message: "Title is required",
                              },
                              minLength: {
                                value: 3,
                                message:
                                  "Your Title must be atleast 3 characters long.",
                              },
                            }}
                          />
                        </Col>
                        <Col md={12} className="mt-2">
                          <CommonInput
                            register={register}
                            errors={errors}
                            className={`for m-control ${
                              errors?.sDescription && "error"
                            }`}
                            name="sDescription"
                            label="Description"
                            placeholder="Enter Description"
                            required
                            validation={{
                              required: {
                                value: true,
                                message: "Description is required",
                              },
                            }}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={6} className="mt-2">
                      <div>
                        <label>
                          Add Category Icon<span className="inputStar">*</span>
                        </label>
                        <div className="inputtypefile mt-2">
                          <div className="inputMSG">
                            <span>Category Icon</span>
                          </div>

                          <Controller
                            name={`sPath`}
                            control={control}
                            rules={{
                              required: "Please add Profile Image",
                              validate: {
                                fileType: (value) => {
                                  if (
                                    value &&
                                    typeof watch(`sPath`) !== "string"
                                  ) {
                                    const allowedFormats = [
                                      "svg",
                                    ];
                                    const fileExtension = value.name
                                      .split(".")
                                      .pop()
                                      .toLowerCase();

                                    if (
                                      !allowedFormats.includes(fileExtension)
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
                                    name={`sPath`}
                                    // disabled={updateFlag}
                                    accept=".svg"
                                    errors={errors}
                                    className={errors?.sPath && "error"}
                                    onChange={(e) => {
                                      onChange(e.target.files[0]);
                                    }}
                                  />
                                </>
                              );
                            }}
                          />
                        </div>
                        <span className="file">{watch("sPath")?.name}</span>
                        <span className="card-error">
                          {errors && errors?.sPath && (
                            <Form.Control.Feedback type="invalid">
                              {errors?.sPath.message}
                            </Form.Control.Feedback>
                          )}
                        </span>
                      </div>
                      <div className="document-preview-group play-doc-preview">
                        {watch(`sPath`) &&
                          (typeof watch(`sPath`) !== "string" ? (
                            <div className="document-preview">
                              {" "}
                              <img
                                src={URL.createObjectURL(watch(`sPath`))}
                                alt="altImage"
                              />{" "}
                            </div>
                          ) : (
                            <div className="document-preview">
                              <img src={watch(`sPath`)} alt="altImage" />{" "}
                            </div>
                          ))}
                      </div>
                    </Col>

                    <div className="mt-4">
                      <Button
                        variant="secondary"
                        className="me-2"
                        onClick={() => navigate(route.faq_category)}
                      >
                        Cancel
                      </Button>
                      <Button variant="primary" type="submit">
                        Add Category
                      </Button>
                    </div>
                  </Row>
                </Wrapper>
              </Col>
            </Row>
          </div>
        </div>
      </Form>
    </>
  );
};

export default AddFaqCategory;
