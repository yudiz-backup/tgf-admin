import Delete from "assets/images/icons/delete";
import Plus from "assets/images/icons/plus";
import { toaster } from "helper/helper";
import { getFooterData, updateFooterData } from "query/home/home.api";
import React, { useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { Select } from "react-rainbow-components";
import CommonInput from "shared/components/CommonInput";
import ImagePreview from "shared/components/ImagePreview";
import Wrapper from "shared/components/Wrap";
import { EMAIL, SocialLinks, URL_REGEX } from "shared/constants";
import { validationErrors } from "shared/constants/ValidationErrors";
import { useS3Upload } from "shared/hooks/useS3Upload";

const Footer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
  } = useForm({
    mode: "all",
    defaultValues: {
      fields: [{ value: "" }],
    },
  });
  const { uploadFile } = useS3Upload();

  const { data } = useQuery("footerData", () => getFooterData(), {
    select: (data) => data?.data?.data,
  });

  useEffect(() => {
    if (data?.aSocialMedia?.length > 0) {
      const linkArray = data.aSocialMedia.map((value) => ({
        title: SocialLinks?.find((i) => i.value === value.sTitle)?.value,
        link: value.sLink,
      }));
      reset({
        fields: linkArray,
        ...data,
      });
    }
  }, [data?.aSocialMedia?.length, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  const { mutate } = useMutation(updateFooterData, {
    onSettled: (response) => {
      if (response) {
        toaster(response.data.message);
      } else {
        toaster(response.data.message, "error");
      }
    },
  });

  async function onSubmit(formData) {
    const payload = {
      ...formData,
      aSocialMedia: formData.fields.map((field) => ({
        sTitle: field.title,
        sLink: field.link,
      })),
    };
    if (typeof watch("sBackGroundImage") === "object") {
      const data = [
        {
          sFileName: watch("sBackGroundImage")?.name,
          sContentType: watch("sBackGroundImage").type,
          sFlag: "sBackGroundImage",
          file: watch("sBackGroundImage"),
        },
      ];
      const result = await uploadFile("footer", data);

      if (result?.err) {
        return null;
      } else {
        for (const key in result) {
          payload[key] = result[key]?.sPath;
        }
      }
    }
    if (typeof watch("sAIGFCertified") === "object") {
      const data = [
        {
          sFileName: watch("sAIGFCertified")?.name,
          sContentType: watch("sAIGFCertified").type,
          sFlag: "sAIGFCertified",
          file: watch("sAIGFCertified"),
        },
      ];
      const result = await uploadFile("certificate", data);
      if (result?.err) {
        return null;
      } else {
        for (const key in result) {
          payload[key] = result[key]?.sPath;
        }
      }
    }
    delete payload["fields"];
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
              <Col lg={12}>
                <Wrapper>
                  <Row>
                    <Col xl={4} md={6} className="mt-2">
                      <CommonInput
                        type="text"
                        register={register}
                        errors={errors}
                        className={`for m-control ${
                          errors?.nNumber && "error"
                        }`}
                        name="nNumber"
                        label="Number"
                        placeholder="Enter Number"
                        required
                        validation={{
                          required: {
                            value: true,
                            message: "Number is required",
                          },
                          pattern: {
                            value: /^[0-9.+]+$/,
                            message: "Only numbers are allowed",
                          },
                        }}
                      />
                    </Col>
                    <Col xl={4} md={6} className="mt-2">
                      <CommonInput
                        type="text"
                        register={register}
                        errors={errors}
                        className={`for m-control ${
                          errors?.sAppName && "error"
                        }`}
                        name="sAppName"
                        label="App Name"
                        placeholder="Enter AppName For"
                        required
                        validation={{
                          required: {
                            value: true,
                            message: "App Name is required",
                          },
                        }}
                      />
                    </Col>
                    <Col xl={4} md={6} className="mt-2">
                      <CommonInput
                        type="text"
                        register={register}
                        errors={errors}
                        className={`for m-control ${errors?.sEmail && "error"}`}
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
                    <Col xl={4} md={6} className="mt-2">
                      <CommonInput
                        type="text"
                        register={register}
                        errors={errors}
                        className={`for m-control ${
                          errors?.sCopyRight && "error"
                        }`}
                        name="sCopyRight"
                        label="Copy right"
                        placeholder="Enter Copy Right"
                        required
                        validation={{
                          required: {
                            value: true,
                            message: "CopyRight is required",
                          },
                        }}
                      />
                    </Col>
                    <Col xl={4} md={6} className="mt-2">
                      <CommonInput
                        register={register}
                        errors={errors}
                        className={`for m-control ${
                          errors?.sReview && "error"
                        }`}
                        name="sAppDisc"
                        label="App description"
                        placeholder="App description"
                        required
                        validation={{
                          required: {
                            value: true,
                            message: "App description is required",
                          },
                        }}
                      />
                    </Col>
                    <Col xl={4} md={6} className="mt-2">
                      <label>
                        Add certificate<span className="inputStar">*</span>
                      </label>
                      <div className="inputtypefile mt-2">
                        <div className="inputMSG">
                          <span>Add AIGF certificate</span>
                        </div>

                        <Controller
                          name={`sAIGFCertified`}
                          control={control}
                          rules={{
                            required: "Please add Certificate",
                            validate: {
                              fileType: (value) => {
                                if (
                                  value &&
                                  typeof watch(`sAIGFCertified`) !== "string"
                                ) {
                                  const allowedFormats = ["pdf"];
                                  const fileExtension = value.name
                                    .split(".")
                                    .pop()
                                    .toLowerCase();

                                  if (!allowedFormats.includes(fileExtension)) {
                                    return "Unsupported file format";
                                  }

                                  // const maxSize = 1 * 1000 * 1000; // 1MB in bytes
                                  // if (value.size >= maxSize) {
                                  //   return "File size must be less than 1MB";
                                  // }
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
                                  name={`sAIGFCertified`}
                                  // disabled={updateFlag}
                                  accept=".pdf"
                                  errors={errors}
                                  className={errors?.sAIGFCertified && "error"}
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
                        {watch("sAIGFCertified")?.name ||
                          watch("sAIGFCertified")}
                      </span>

                      <span className="card-error">
                        {errors && errors?.sAIGFCertified && (
                          <Form.Control.Feedback type="invalid">
                            {errors?.sAIGFCertified.message}
                          </Form.Control.Feedback>
                        )}
                      </span>
                    </Col>

                    <Col xl={2} md={3} className="mt-2">
                      <Form.Group className="form-group">
                        <Form.Label>Background Image</Form.Label>
                        <div className="fileinput">
                          <div className="inputtypefile m-0   ">
                            <div className="inputMSG">
                              <span>Upload Image</span>
                            </div>

                            <Controller
                              name={`sBackGroundImage`}
                              control={control}
                              rules={{
                                required: "Please add ticket logo",
                                validate: {
                                  fileType: (value) => {
                                    if (
                                      value &&
                                      typeof watch("sBackGroundImage") !==
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
                                      const fileExtension = value?.name
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
                                        errors?.sBackGroundImage?.sPath &&
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
                            {errors && errors?.sBackGroundImage?.sPath && (
                              <Form.Control.Feedback type="invalid">
                                {errors?.sBackGroundImage?.sPath.message}
                              </Form.Control.Feedback>
                            )}
                          </span>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col xl={2} md={3} className="mb-2">
                      <ImagePreview path={watch("sBackGroundImage")} />
                    </Col>
                    {fields.map((field, index) => (
                      <Col xl={4} md={6} className="mt-2" key={field.id}>
                        <Row>
                          <Col md={12} lg={6}>
                            {/* <Form.Group className="form-group">
                              <CommonInput
                                type="text"
                                register={register}
                                errors={errors}
                                className={`form-control ${
                                  errors?.fields?.[index]?.title?.message &&
                                  "error"
                                }`}
                                name={`fields[${index}].title`}
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
                              {errors?.fields?.[index]?.title && (
                                <Form.Control.Feedback type="invalid">
                                  {errors.fields[index].title.message}
                                </Form.Control.Feedback>
                              )}
                            </Form.Group> */}
                            <Form.Group className="form-group">
                              <Form.Label>
                                <span>
                                  Title
                                  <span className="inputStar">*</span>
                                </span>
                              </Form.Label>
                              <Controller
                                name={`fields[${index}].title`}
                                control={control}
                                rules={{
                                  required: {
                                    value: true,
                                    message: "Please select the title",
                                  },
                                }}
                                render={({
                                  field: { onChange, value, ref },
                                }) => (
                                  <Select
                                    placeholder=""
                                    ref={ref}
                                    options={SocialLinks}
                                    className={`react-select border-0 ${
                                      errors?.fields?.[index]?.title?.message &&
                                      "error"
                                    }`}
                                    classNamePrefix="select"
                                    isSearchable={false}
                                    value={value} // Corrected value
                                    onChange={onChange} // Extract the label from selectedOption
                                    getOptionLabel={(option) => option.label}
                                    getOptionValue={(option) => option.value}
                                  />
                                )}
                              />
                              {errors?.fields?.[index]?.title && (
                                <Form.Control.Feedback type="invalid">
                                  {errors.fields[index].title.message}
                                </Form.Control.Feedback>
                              )}
                            </Form.Group>
                          </Col>

                          <Col md={12} lg={6}>
                            <Form.Group className="form-group">
                              <CommonInput
                                type="text"
                                register={register}
                                errors={errors}
                                className={`form-control ${
                                  errors?.fields?.[index]?.link?.message &&
                                  "error"
                                }`}
                                name={`fields[${index}].link`}
                                label="Link"
                                placeholder={`Enter text`}
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
                              {errors?.fields?.[index]?.link && (
                                <Form.Control.Feedback type="invalid">
                                  {errors.fields[index].link.message}
                                </Form.Control.Feedback>
                              )}
                            </Form.Group>
                          </Col>
                        </Row>
                        <div className="d-flex gap-2">
                          {index !== 0 && (
                            <Button
                              variant="danger"
                              className="mt-2"
                              onClick={() => remove(index)}
                              size="sm"
                            >
                              {/* Remove */}
                              <Delete />
                            </Button>
                          )}
                        </div>
                        {index === 0 && (
                          <Button
                            variant="secondary"
                            className="mt-2"
                            size="sm"
                            onClick={() => append({ value: "" })}
                          >
                            <Plus />
                          </Button>
                        )}
                      </Col>
                    ))}
                  </Row>
                  <div className="mt-4">
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

export default Footer;
