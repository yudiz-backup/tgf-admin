import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import CommonInput from "shared/components/CommonInput";
import Wrapper from "shared/components/Wrap";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { toaster } from "helper/helper";
import { route } from "shared/constants/AllRoutes";
import { validationErrors } from "shared/constants/ValidationErrors";
import { addTestimonial } from "query/testimonial/testimonial.api";
import { useS3Upload } from "shared/hooks/useS3Upload";
import { Select } from "react-rainbow-components";
import { TestiMonialPages } from "shared/constants";

const AddTestimonial = () => {
  const navigate = useNavigate();
  const { uploadFile } = useS3Upload();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
  } = useForm({ mode: "all" });

  // ADD REVIEW
  const { mutate } = useMutation(addTestimonial, {
    onSettled: (data) => {
      if (data) {
        toaster(data.data.message);
        navigate(route.testimonialManagement);
        reset();
      }
    },
  });

  async function onSubmit(formData) {
    const payload = {
      sUserName: formData.sUserName,
      nRating: formData.nRating,
      sReview: formData.sReview,
      sDesignation: formData.sDesignation,
      eType: formData.eType,
    };

    if (typeof formData?.sProfileImagePath === "object") {
      const data = [
        {
          sFileName: formData?.sProfileImagePath?.name?.replace(/\.(\w+)$/, ""),
          sContentType: formData?.sProfileImagePath.type,
          sFlag: "sProfileImagePath",
          file: formData?.sProfileImagePath,
        },
      ];
      const result = await uploadFile("testimonial", data);
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
                    <Col md={6} className="mt-2">
                      <CommonInput
                        type="text"
                        register={register}
                        errors={errors}
                        className={`form-control ${
                          errors?.sUserName && "error"
                        }`}
                        name="sUserName"
                        label="User Name"
                        placeholder="Enter user name"
                        required
                        onChange={(e) => {
                          e.target.value =
                            e.target.value?.trim() &&
                            e.target.value.replace(/^[0-9]+$/g, "");
                        }}
                        validation={{
                          required: {
                            value: true,
                            message: validationErrors.userNameRequired,
                          },
                          minLength: {
                            value: 3,
                            message:
                              "Your username must be atleast 3 characters long.",
                          },
                        }}
                      />
                    </Col>

                    <Col md={6} className="mt-2">
                      <CommonInput
                        type="text"
                        register={register}
                        errors={errors}
                        className={`for m-control ${
                          errors?.nRating && "error"
                        }`}
                        name="nRating"
                        label="Rating"
                        placeholder="Enter Ratings"
                        required
                        validation={{
                          pattern: {
                            value: /^[0-9.]+$/,
                            message: "Only numbers are allowed",
                          },
                          required: {
                            value: true,
                            message: "Ratings is required",
                          },
                          validate: {
                            notGreaterThanFive: (value) => {
                              // Custom validation rule: Rating should not be greater than 5
                              const floatValue = parseFloat(value);
                              return (
                                floatValue <= 5 ||
                                "Rating should not be greater than 5"
                              );
                            },
                          },
                        }}
                        onChange={(e) => {
                          e.target.value =
                            e.target.value?.trim() &&
                            e.target.value.replace(/^[a-zA-z]+$/g, "");
                        }}
                      />
                    </Col>

                    <Col md={6} className="mt-2">
                      <CommonInput
                        type="text"
                        register={register}
                        errors={errors}
                        className={`form-control ${
                          errors?.sDesignation && "error"
                        }`}
                        name="sDesignation"
                        label="Designation"
                        placeholder="Enter Designation"
                        required
                        onChange={(e) => {
                          e.target.value =
                            e.target.value?.trim() &&
                            e.target.value.replace(/^[0-9]+$/g, "");
                        }}
                        validation={{
                          required: {
                            value: true,
                            message: "Designation is required",
                          },
                        }}
                      />
                    </Col>

                    <Col md={6} className="mt-2">
                      <label>
                        Add Profile Picture<span className="inputStar">*</span>
                      </label>
                      <div className="inputtypefile mt-2">
                        <div className="inputMSG">
                          <span>Add Profile Picture</span>
                        </div>

                        <Controller
                          name={`sProfileImagePath`}
                          control={control}
                          rules={{
                            required: "Please add Profile Image",
                            validate: {
                              fileType: (value) => {
                                if (
                                  value &&
                                  typeof watch(`sProfileImagePath`) !== "string"
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

                                  if (!allowedFormats.includes(fileExtension)) {
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
                                  name={`sProfileImagePath`}
                                  // disabled={updateFlag}
                                  accept=".jpg,.jpeg,.png,.JPEG,.JPG,.PNG"
                                  errors={errors}
                                  className={
                                    errors?.sProfileImagePath && "error"
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
                      <span className="file">
                        {watch("sProfileImagePath")?.name}
                      </span>

                      <span className="card-error">
                        {errors && errors?.sProfileImagePath && (
                          <Form.Control.Feedback type="invalid">
                            {errors?.sProfileImagePath.message}
                          </Form.Control.Feedback>
                        )}
                      </span>
                    </Col>

                    <Col md={6} className="mt-2">
                      <CommonInput
                        register={register}
                        errors={errors}
                        className={`for m-control ${
                          errors?.sReview && "error"
                        }`}
                        name="sReview"
                        label="Review"
                        placeholder="Enter Review"
                        required
                        validation={{
                          required: {
                            value: true,
                            message: "Review is required",
                          },
                        }}
                      />
                    </Col>  

                    <Col md={6} className="mt-2">
                      <Form.Group className="form-group">
                        <Form.Label>
                          <span>
                            Page
                            <span className="inputStar">*</span>
                          </span>
                        </Form.Label>
                        <Controller
                          name="eType"
                          control={control}
                          rules={{
                            required: {
                              value: true,
                              message: "This is required",
                            },
                          }}
                          render={({ field: { onChange, value, ref } }) => (
                            <Select
                              placeholder="Select gender"
                              ref={ref}
                              options={TestiMonialPages}
                              className={`react-select border-0 ${
                                errors.eType && "error"
                              }`}
                              classNamePrefix="select"
                              isSearchable={false}
                              value={value}
                              onChange={onChange}
                              getOptionLabel={(option) => option.label}
                              getOptionValue={(option) => option.value}
                            />
                          )}
                        />
                        {errors.eType && (
                          <Form.Control.Feedback type="invalid">
                            {errors.eType.message}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>

                    <div className="mt-4 d-flex gap-1">
                        <Button
                          variant="secondary"
                          className="me-2"
                          onClick={() => navigate(route.testimonialManagement)}
                        >
                          Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                          Add Testimonial
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

export default AddTestimonial;
