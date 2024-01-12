import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import CommonInput from "shared/components/CommonInput";
import Wrapper from "shared/components/Wrap";
import { useMutation, useQuery } from "react-query";
import { toaster } from "helper/helper";
import {
  editPlayStoreData,
  gerPlayStoreData,
} from "query/playStore/playstore.api";
import { Loader } from "shared/components/Loader";
import { URL_REGEX } from "shared/constants";

const PlayStore = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "all" });

  const { refetch, isLoading } = useQuery(
    "playStoreData",
    () => gerPlayStoreData(),
    {
      select: (data) => data?.data?.data,
      onSuccess: (data) => {
        reset({
          ...data,
        });
      },
    }
  );

  // EDIT DATA
  const { mutate } = useMutation(editPlayStoreData, {
    onSettled: (response) => {
      if (response) {
        toaster(response.data.message);
        refetch();
        // navigate(route.reviewManagement);

        reset();
      } else {
        toaster(response.data.message, "error");
      }
    },
  });

  function onSubmit(formData) {
    const data = {
      sAbout: formData.sAbout,
      sRated: formData.sRated,
      sDownloads: formData.sDownloads,
      sAvgReview: formData.sAvgReview,
      ePage: "PLAYSTORE",
      sBackGroundVideo: formData.sBackGroundVideo,
      nTotalReview: formData.nTotalReview,
      aAppImages: formData.aAppImages,
      sUpdateOn: formData.sUpdateOn
    };
    mutate(data);
  }

  return (
    <>
      {isLoading && <Loader />}
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
                        className={`for m-control ${
                          errors?.sDownloads && "error"
                        }`}
                        name="sDownloads"
                        label="Downloads"
                        placeholder="Enter Downloads"
                        required
                        validation={{
                          //   pattern: {
                          //     value: /^[0-9.]+$/,
                          //     message: "Only numbers are allowed",
                          //   },
                          required: {
                            value: true,
                            message: "Downloads is required",
                          },
                        }}
                      />
                    </Col>

                    <Col md={6} className="mt-2">
                      <CommonInput
                        type="text"
                        register={register}
                        errors={errors}
                        className={`for m-control ${errors?.sRated && "error"}`}
                        name="sRated"
                        label="Rated"
                        placeholder="Enter Rated For"
                        required
                        validation={{
                          required: {
                            value: true,
                            message: "This is required",
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
                          errors?.nTotalReview && "error"
                        }`}
                        name="nTotalReview"
                        label="Total Reviews"
                        placeholder="Enter Total Reviews"
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
                            message: "Total Reviews is required",
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
                        register={register}
                        errors={errors}
                        className={`for m-control ${
                          errors?.sReview && "error"
                        }`}
                        name="sAbout"
                        label="About this Game"
                        placeholder="About this Game"
                        required
                        validation={{
                          required: {
                            value: true,
                            message: "This is required",
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
                          errors?.sBackGroundVideo && "error"
                        }`}
                        name="sBackGroundVideo"
                        label="Back-Ground Video"
                        placeholder="Enter link"
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
                    </Col>
                    <Row className="mt-4">
                      <Col md={6}>
                        {/* <Button
                          variant="secondary"
                          className="me-2"
                          onClick={() => navigate(route.userManagement)}
                        >
                          Cancel
                        </Button> */}
                        <Button variant="primary" type="submit">
                          Update
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

export default PlayStore;
