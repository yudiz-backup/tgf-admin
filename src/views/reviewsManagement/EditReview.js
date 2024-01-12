import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import CommonInput from "shared/components/CommonInput";
import Wrapper from "shared/components/Wrap";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toaster } from "helper/helper";
import { route } from "shared/constants/AllRoutes";
import { validationErrors } from "shared/constants/ValidationErrors";
import { getReviewsById } from "query/reviews/reviews.query";
import { editReview } from "query/reviews/review.mutation";
import { useS3Upload } from "shared/hooks/useS3Upload";
import ImagePreview from "shared/components/ImagePreview";

const EditReview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm({ mode: "all" });
  const { uploadFile } = useS3Upload();

  // EDIT USER
  const { mutate } = useMutation(editReview, {
    onSettled: (response) => {
      if (response) {
        toaster(response.data.message);
        navigate(route.reviewManagement);

        reset();
      } else {
        toaster(response.data.message, "error");
      }
    },
  });

  async function onSubmit(formData) {
    const payload = {
      sUserName: formData.sUserName,
      nRating: formData.nRating,
      sReview: formData.sReview,
      nReviewHelpFullCount: formData.nReviewHelpFullCount,
      sProfileImagePath: formData?.sProfileImagePath,
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
      const result = await uploadFile("review", data);
      if (result?.err) {
        return null;
      } else {
        for (const key in result) {
          payload[key] = result[key]?.sPath;
        }
      }
    }
    mutate({ id, payload });
  }

  // GET SPECIFIC REVIEW
  useQuery("reviewDataById", () => getReviewsById(id), {
    enabled: !!id,
    select: (data) => data?.data?.data,
    onSuccess: (data) => {
      reset({
        ...data,
        sProfileImagePath: data?.sProfileImagePath,
      });
    },
  });

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
              <Col xxl={12}>
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

                    <Col sm={3} className="mt-2">
                      <label>
                        Add Profile Picture<span className="inputStar">*</span>
                      </label>
                      <div className="inputtypefile mt-2">
                        <div className="inputMSG">
                          <span>Profile Picture</span>
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
                    <Col sm={3}>
                      <ImagePreview path={watch(`sProfileImagePath`)} />
                    </Col>

                    <Row className="mt-4">
                      <Col sm={6}>
                        <Button
                          variant="secondary"
                          className="me-2"
                          onClick={() => navigate(route.reviewManagement)}
                        >
                          Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                          Update Review
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

export default EditReview;
