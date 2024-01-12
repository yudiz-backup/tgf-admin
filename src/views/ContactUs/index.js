import { toaster } from "helper/helper";
import {
  getContactUsData,
  updateContactUsData,
} from "query/contactUs/contactUs.api";
import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import CommonInput from "shared/components/CommonInput";
import { Loader } from "shared/components/Loader";
import Wrapper from "shared/components/Wrap";
import { EMAIL } from "shared/constants";
import { validationErrors } from "shared/constants/ValidationErrors";
import { useS3Upload } from "shared/hooks/useS3Upload";

function ContactUs() {
  const { uploadFile } = useS3Upload();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    reset,
  } = useForm({
    mode: "all",
    defaultValues: {
      fields: [{ value: "" }],
    },
  });
  const { isLoading } = useQuery("contactUsData", () => getContactUsData(), {
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

  const onSubmit = async (formData) => {
    const payload = {
      ...formData,
    };
    if (typeof watch("sBackGroundImage") === "object") {
      const data = [
        {
          sFileName: watch("sBackGroundImage")?.name?.replace(/\.(\w+)$/, ""),
          sContentType: watch("sBackGroundImage").type,
          sFlag: "sBackGroundImage",
          //   flag: 'career_profile_file',
          file: watch("sBackGroundImage"),
        },
      ];
      const result = await uploadFile("contactus", data);
      if (result?.err) {
        return null;
      } else {
        for (const key in result) {
          payload[key] = result[key]?.sPath;
        }
      }
    }
    mutate(payload);
  };
  return (
    <Form
      className="step-one"
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      {isLoading && <Loader />}
      <div className="personal-details">
        <div className="user-form">
          <Row>
            <Col lg={12}>
              <Wrapper>
                <Row>
                  <Col xl={4} lg={6} className="mt-2">
                    <Row>
                      <Col lg={12} className="mt-2">
                        <CommonInput
                          type="text"
                          register={register}
                          errors={errors}
                          className={`for m-control ${
                            errors?.sNumber && "error"
                          }`}
                          name="sNumber"
                          label="Number"
                          placeholder="Enter Number"
                          required
                          validation={{
                            pattern: {
                              value: /^[0-9]+$/,
                              message: "Only numbers are allowed",
                            },
                            required: {
                              value: true,
                              message: "Mobile number is required",
                            },
                            minLength: {
                              value: 10,
                              message: "Please enter a valid mobile number.",
                            },
                            maxLength: {
                              value: 10,
                              message: "Please enter a valid mobile number.",
                            },
                          }}
                        />
                      </Col>
                      <Col lg={12} className="mt-2">
                        <CommonInput
                          type="text"
                          register={register}
                          errors={errors}
                          className={`for m-control ${
                            errors?.sEmail && "error"
                          }`}
                          name="sEmail"
                          label="Email"
                          placeholder="Enter Email For"
                          required
                          validation={{
                            required: {
                              value: true,
                              message: "Email is required",
                            },
                            pattern: {
                              value: EMAIL,
                              message: validationErrors.email,
                            },
                          }}
                        />
                      </Col>
                    </Row>
                  </Col>

                  <Col lg={6} xl={4} className="mt-2">
                    <CommonInput
                      register={register}
                      errors={errors}
                      className={`for m-control ${errors?.sAddress && "error"}`}
                      name="sAddress"
                      label="Address"
                      placeholder="Address"
                      required
                      validation={{
                        required: {
                          value: true,
                          message: "Address is required",
                        },
                      }}
                    />
                  </Col>
                  <Col lg={6} xl={4} className="mt-2">
                    <Form.Group className="form-group">
                      <Form.Label>Background Image</Form.Label>
                      <div className="fileinput">
                        <div className="inputtypefile mx-0">
                          <div className="inputMSG">
                            <span>Upload Image</span>
                          </div>

                          <Controller
                            name={`sBackGroundImage`}
                            control={control}
                            rules={{
                              required: "Please add Image",
                              validate: {
                                fileType: (value) => {
                                  if (
                                    value &&
                                    typeof watch(`sBackGroundImage`) !==
                                      "string"
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
                                    name={`sBackGroundImage`}
                                    // disabled={updateFlag}
                                    accept=".jpg,.jpeg,.png,.JPEG,.JPG,.PNG"
                                    errors={errors}
                                    className={
                                      errors?.sBackGroundImage && "error"
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
                          {errors && errors?.sBackGroundImage && (
                            <Form.Control.Feedback type="invalid">
                              {errors?.sBackGroundImage?.message}
                            </Form.Control.Feedback>
                          )}
                        </span>
                        <div className="document-preview-group play-doc-preview">
                          {watch(`sBackGroundImage`) &&
                            (typeof watch(`sBackGroundImage`) !== "string" ? (
                              <div className="document-preview">
                                {" "}
                                <img
                                  src={URL.createObjectURL(
                                    watch(`sBackGroundImage`)
                                  )}
                                  alt="altImage"
                                />{" "}
                              </div>
                            ) : (
                              <div className="document-preview">
                                <img
                                  src={
                                    process.env.REACT_APP_AWS_S3_BASE_URL +
                                    watch(`sBackGroundImage`)
                                  }
                                  alt="altImage"
                                />{" "}
                              </div>
                            ))}
                        </div>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <div className="mt-2">
                  <Button variant="secondary" className="me-2">
                    Cancel
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

export default ContactUs;
