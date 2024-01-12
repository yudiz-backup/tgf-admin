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
import { addReview } from "query/reviews/review.mutation";
import { useS3Upload } from "shared/hooks/useS3Upload";

const AddReview = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
  } = useForm({ mode: "all" });
  const { uploadFile } = useS3Upload();

  // ADD REVIEW
  const { mutate } = useMutation(addReview, {
    onSettled: (data) => {
      if (data) {
        toaster(data.data.message);
        navigate(route.reviewManagement);
        reset();
      }
    },
  });

  async function onSubmit(formData) {
    const payload = {
      sUserName: formData.sUserName,
      nRating: formData.nRating,
      sReview: formData.sReview,
      nReviewHelpFullCount: formData.nReviewHelpFullCount,
    };
    if (typeof formData?.sProfileImageUrl === "object") {
      const data = [
        {
          sFileName: formData?.sProfileImageUrl?.name?.replace(/\.(\w+)$/, ""),
          sContentType: formData?.sProfileImageUrl.type,
          sFlag: "sProfileImagePath",
          file: formData?.sProfileImageUrl,
        },
      ];
      const result = await uploadFile("review", data);
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
                    <Col sm={6} className="mt-2">
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

                    <Col sm={6} className="mt-2">
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
                          // maxLength: {
                          //   value: 6,
                          //   message: 'Postal code must be 6 digits.'
                          // },
                          // minLength: {
                          //   value: 6,
                          //   message: 'Postal code must be atleast 6 digits.'
                          // },
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

                    <Col sm={6} className="mt-2">
                      <CommonInput
                        type="text"
                        register={register}
                        errors={errors}
                        className={`for m-control ${
                          errors?.nReviewHelpFullCount && "error"
                        }`}
                        name="nReviewHelpFullCount"
                        label="Review Help Full Count"
                        placeholder="Enter Count"
                        required
                        validation={{
                          required: {
                            value: true,
                            message: "Review Help Full Count is required",
                          },
                          pattern: {
                            value: /^\d*\.?\d+$/,
                            message: "Only decimal numbers are allowed",
                          },
                          maxLength: {
                            value: 10,
                            message: "Count can not exceed 10 digits",
                          },
                        }}
                        onChange={(e) => {
                          e.target.value =
                            e.target.value?.trim() &&
                            e.target.value.replace(/^[a-zA-z]+$/g, "");
                        }}
                      />
                    </Col>

                    <Col sm={6} className="mt-2">
                      <label>
                        Add Profile Picture<span className="inputStar">*</span>
                      </label>
                      <div className="inputtypefile mt-2">
                        <div className="inputMSG">
                          <span>Add Profile Picture</span>
                        </div>

                        <Controller
                          name={`sProfileImageUrl`}
                          control={control}
                          rules={{
                            required: "Please add Profile Image",
                            validate: {
                              fileType: (value) => {
                                if (
                                  value &&
                                  typeof watch(`sProfileImageUrl`) !== "string"
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
                                  name={`sProfileImageUrl`}
                                  // disabled={updateFlag}
                                  accept=".jpg,.jpeg,.png,.JPEG,.JPG,.PNG"
                                  errors={errors}
                                  className={
                                    errors?.sProfileImageUrl && "error"
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
                        {watch("sProfileImageUrl")?.name}
                      </span>

                      <span className="card-error">
                        {errors && errors?.sProfileImageUrl && (
                          <Form.Control.Feedback type="invalid">
                            {errors?.sProfileImageUrl.message}
                          </Form.Control.Feedback>
                        )}
                      </span>
                    </Col>

                    <Col sm={6} className="mt-2">
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

                    <Row className="mt-4">
                      <Col sm={6}>
                        <Button
                          variant="secondary"
                          className="me-2"
                          onClick={() => navigate(route.userManagement)}
                        >
                          Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                          Add User
                        </Button>
                      </Col>
                    </Row>
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

export default AddReview;
