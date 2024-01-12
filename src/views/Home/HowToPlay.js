import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import CommonInput from "shared/components/CommonInput";
import Wrapper from "shared/components/Wrap";
import { useMutation, useQuery } from "react-query";
import { getHowToPlayData, updateHowToPlayData } from "query/home/home.api";
import { toaster } from "helper/helper";
import { useS3Upload } from "shared/hooks/useS3Upload";
import { Loader } from "shared/components/Loader";

const HowToPlay = () => {
  const { uploadFile } = useS3Upload();
  const [show, setShow] = useState(true);

  const { data, isLoading } = useQuery(
    "howToPlaData",
    () => getHowToPlayData(),
    {
      select: (data) => data?.data?.data,
      onSuccess: (data) => {
        setShow(data?.bHomePageSwitch)
        if (data?.aHowToPlaySteps?.length > 0) {
          data?.aHowToPlaySteps?.forEach((value) => {
            append({
              sTitle: value.sTitle,
              sDescription: value.sDescription,
              sPath: value.sPath,
            });
          });
          remove(0);
        }
      },
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
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

  // EDIT HOME DATA
  const { mutate } = useMutation(updateHowToPlayData, {
    onSettled: (response) => {
      if (response) {
        toaster(response.data.message);
        // refetch(); s
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
        const result = await uploadFile("banner", imageArray);
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
        bHomePageSwitch:show,
        aHowToPlaySteps: updatedArray?.map((field) => ({
          sTitle: field.sTitle,
          sDescription: field.sDescription,
          sPath: field.sPath,
        })),
      };
      mutate(payload);
    }
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
              <Col xl={12}>
                <Wrapper>
                <Col md={6}>
                      <Form.Group className="form-group">
                        <Form.Label>
                          <span>
                            Show How to Play Section on Home Page
                            <span className="inputStar">*</span>
                          </span>
                        </Form.Label>
                        <Form.Check
                          type="switch"
                          name="bOurResultsSwitch"
                          className="d-inline-block me-1"
                          checked={show}
                          onChange={(e) => setShow(e?.target?.checked)}
                        />
                      </Form.Group>
                    </Col>
                  {fields.map((field, index) => (
                    <Row key={field.id} className="mt-3">
                      <Col xl={3} lg={4} md={6}>
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
                      <Col xl={4} lg={4} md={6}>
                        <Form.Group className="form-group">
                          <CommonInput
                            type="text"
                            register={register}
                            errors={errors}
                            className={`form-control ${
                              errors?.fields?.[index]?.sDescription?.message &&
                              "error"
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
                            }}
                          />
                          {errors?.fields?.[index]?.sDescription && (
                            <Form.Control.Feedback type="invalid">
                              {errors.fields[index].sDescription.message}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      </Col>
                      <Col xl={2} lg={4} md={6}>
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
                      <Col xl={3} lg={4} md={6}>
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
                        {index !== 0 && (
                          <Button
                            variant="danger"
                            className="mt-2"
                            onClick={() => remove(index)}
                            size="sm"
                          >
                            Remove
                          </Button>
                        )}
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

export default HowToPlay;
