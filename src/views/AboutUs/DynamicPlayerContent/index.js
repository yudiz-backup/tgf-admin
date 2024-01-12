import React, { useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useFieldArray, useForm } from "react-hook-form";
import CommonInput from "shared/components/CommonInput";
import Wrapper from "shared/components/Wrap";
import Delete from "assets/images/icons/delete";
import { useAboutUs } from "shared/hooks/useAboutUs";

const DynamicPlayerContent = () => {
  const { data, mutate } = useAboutUs();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
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
    if (data?.aDynamicPlayerContent?.length > 0) {
      const contentArray = data.aDynamicPlayerContent.map((value) => ({
        sDescription: value.sDescription,
        sTitle: value.sTitle,
      }));

      reset({
        fields: contentArray,
      });
    }
  }, [data?.aDynamicPlayerContent?.length]);

  function onSubmit(formData) {
    const payload = {
      ...data,
      aDynamicPlayerContent: formData.fields.map((field) => ({
        sDescription: field.sDescription,
        sTitle: field.sTitle,
      })),
    };
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
                  <div className="mt-2">
                    {fields.map((field, index) => (
                      <Row key={field.id}>
                        <Col lg={6} className="mb-2">
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
                              label="Name"
                              placeholder={`Enter Name`}
                              required
                              validation={{
                                required: {
                                  value: true,
                                  message: "Title is required",
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
                        <Col lg={6} className="mb-2">
                          <Form.Group className="form-group">
                            <CommonInput
                              type="textarea"
                              register={register}
                              errors={errors}
                              className={`form-control ${
                                errors?.fields?.[index]?.sDescription
                                  ?.message && "error"
                              }`}
                              name={`fields[${index}].sDescription`}
                              label="Designation"
                              placeholder={`Enter Designation`}
                              required
                              validation={{
                                required: {
                                  value: true,
                                  message: "Description is required",
                                },
                              }}
                            />
                            {errors?.fields?.[index]?.sDescription && (
                              <Form.Control.Feedback type="invalid">
                                {errors.fields[index].sDescription.message}
                              </Form.Control.Feedback>
                            )}
                          </Form.Group>
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
                  </div>
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

export default DynamicPlayerContent;
