import React, { useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import CommonInput from "shared/components/CommonInput";
import Wrapper from "shared/components/Wrap";
import Delete from "assets/images/icons/delete";
import { useAboutUs } from "shared/hooks/useAboutUs";
import { useS3Upload } from "shared/hooks/useS3Upload";

const MeetOurTeam = () => {
  const { data, mutate } = useAboutUs();
  const { uploadFile } = useS3Upload();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
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
    if (data?.aTeamMembers?.length > 0) {
      setValue("sOurTeamDescription", data?.sOurTeamDescription);
      const teamArray = data.aTeamMembers.map((value) => ({
        sName: value.sName,
        sDesignation: value.sDesignation,
        sPath: value.sPath,
      }));

      reset({
        fields: teamArray,
      });
    }
  }, [data?.aTeamMembers?.length]);

  async function onSubmit(formData) {
    let updatedArray = [...formData.fields];

    const options = formData?.fields.map((item) => item.sPath);

    if (options?.length > 0) {
      const imageArray = [];
      options.map((data, i) => {
        if (typeof data === "object") {
          const file = data;
          imageArray.push({
            // selected: data['option-' + (i + 1)],
            sFlag: i.toString(),
            sFileName: file.name.replace(/\.(\w+)$/, ""),
            sContentType: file.type,
            file,
          });
          // delete data['option-' + (i + 1)]
        }
        return null;
      });
      if (imageArray.length > 0) {
        const result = await uploadFile("heroimages", imageArray);
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
        sOurTeamDescription: formData.sOurTeamDescription,
        aTeamMembers: updatedArray.map((field) => ({
          sName: field.sName,
          sDesignation: field.sDesignation,
          sPath: field.sPath,
        })),
      };
      mutate(payload);
    }
    // const payload = {
    //   ...data,
    //   sOurTeamDescription: formData.sOurTeamDescription,
    //   aTeamMembers: formData.fields.map((field) => ({
    //     sName: field.sName,
    //     sDesignation: field.sDesignation,
    //     sPath: field.sPath,
    //   })),
    // };
    // mutate(payload);
  }

  // useEffect(() => {
  //   if (data?.aTeamMembers?.length > 0) {
  //     remove(0);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [data]);

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
                  <h2>Meet our team</h2>
                  <Row>
                    <Col md={6} lg={4} className="mt-2">
                      <CommonInput
                        type="text"
                        register={register}
                        errors={errors}
                        className={`for m-control ${
                          errors?.sOurTeamDescription && "error"
                        }`}
                        name="sOurTeamDescription"
                        // value={data?.sOurTeamDescription}
                        label="Our Team Description"
                        placeholder="Enter Team Description"
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
                    {fields.map((field, index) => (
                      <Row key={field.id}>
                        <Col xl={3} lg={4} md={6} className="mb-2">
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
                              required
                              validation={{
                                required: {
                                  value: true,
                                  message: "Name is required",
                                },
                              }}
                            />
                            {errors?.fields?.[index]?.title && (
                              <Form.Control.Feedback type="invalid">
                                {errors.fields[index].title.message}
                              </Form.Control.Feedback>
                            )}
                          </Form.Group>
                        </Col>
                        <Col xl={3} lg={4} md={6} className="mb-2">
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
                              required
                              validation={{
                                required: {
                                  value: true,
                                  message: "Designation is required",
                                },
                              }}
                            />
                            {errors?.fields?.[index]?.sDesignation && (
                              <Form.Control.Feedback type="invalid">
                                {errors.fields[index].sDesignation.message}
                              </Form.Control.Feedback>
                            )}
                          </Form.Group>
                        </Col>
                        <Col xl={3} lg={4} md={6} className="mb-2">
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
                                    required: "Please add Image",
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
                        <Col xl={3} lg={4} md={6} className="mb-2">
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
                                    src={process.env.REACT_APP_AWS_S3_BASE_URL + watch(`fields[${index}].sPath`)}
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

export default MeetOurTeam;
