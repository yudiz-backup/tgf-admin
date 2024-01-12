import React, { useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useFieldArray, useForm } from "react-hook-form";
import CommonInput from "shared/components/CommonInput";
import Wrapper from "shared/components/Wrap";
import { useMutation, useQuery } from "react-query";
import { getHomeData, updateHomeData } from "query/home/home.api";
import { toaster } from "helper/helper";
import Delete from "assets/images/icons/delete";

const OurResults = () => {
  //   GET HOME DATA
  const { data } = useQuery("homeData", () => getHomeData(), {
    select: (data) => data?.data?.data,
    onSuccess: (data) => {
      data?.aWhyChooseUs?.forEach((value) => {
        append({ value });
      });
    },
  });

  useEffect(() => {
    if (data?.aWhyChooseUs?.length > 0) {
      remove(0);
    }
  }, [data]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
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
  const { mutate } = useMutation(updateHomeData, {
    onSettled: (response) => {
      if (response) {
        toaster(response.data.message);
      } else {
        toaster(response.data.message, "error");
      }
    },
  });

  function onSubmit(formData) {
    let array = [];
    formData?.fields?.forEach((field) => array.push(field.value));
    const payload = {
      ...data,
      aWhyChooseUs: array,
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
                  <Row>
                    {fields.map((field, index) => (
                      <Col key={field.id} lg={6} className="mb-2">
                        <div className="mt-2 position-relative">
                          <CommonInput
                            type="text"
                            register={register}
                            errors={errors}
                            className={`form-control ${
                              errors?.fields?.[index]?.value?.message && "error"
                            }`}
                            name={`fields[${index}].value`}
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
                          {errors?.fields?.[index]?.value && (
                            <Form.Control.Feedback type="invalid">
                              {errors.fields[index].value.message}
                            </Form.Control.Feedback>
                          )}
                          {index !== 0 && (
                            <Button
                              variant="danger"
                              className="position-absolute top-0 end-0"
                              onClick={() => remove(index)}
                              size="sm"
                            >
                              <Delete />
                            </Button>
                          )}
                        </div>
                      </Col>
                    ))}
                  </Row>

                  <div className="mt-4">
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

export default OurResults;
