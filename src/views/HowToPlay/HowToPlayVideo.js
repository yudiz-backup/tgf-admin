import Delete from "assets/images/icons/delete";
import { toaster } from "helper/helper";
import { getHowToPlayData, updateHowToPlayData } from "query/home/home.api";
import React from "react";
import { Button, Col, Form, Ratio, Row } from "react-bootstrap";
import { useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import CommonInput from "shared/components/CommonInput";
import { Loader } from "shared/components/Loader";
import Wrapper from "shared/components/Wrap";
import { URL_REGEX } from "shared/constants";

function HowToPlaVideo() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
    setError,
  } = useForm({
    mode: "all",
    defaultValues: {
      fields: [
        {
          nPriority: "",
          sPath: "",
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  const { data,isLoading } = useQuery("homePageData", () => getHowToPlayData(), {
    select: (data) => data?.data?.data,
    onSuccess: (data) => {
      if (data?.aVideoTutorial?.length > 0) {
        const videoArray = data.aVideoTutorial.map((value) => ({
          nPriority: value.nPriority,
          sPath: value.sPath,
        }));
        reset({
          fields: videoArray,
        });
      }
    },
  });

  const { mutate } = useMutation(updateHowToPlayData, {
    onSettled: (response) => {
      if (response) {
        toaster(response.data.message);
        // refetch();
      } else {
        toaster(response.data.message, "error");
      }
    },
  });

  const checkValidation = () => {
    const fieldsValues = watch("fields");
    const nPriorityValues =
      fieldsValues?.length > 0 && fieldsValues.map((item) => +item.nPriority);

    const indexMap = new Map();
    const duplicatesValuesIndex = [];
    nPriorityValues?.forEach((value, index) => {
      const indices = indexMap.get(value) || [];
      indices.push(index);
      indexMap.set(value, indices);
    });

    indexMap.forEach((indices) => {
      if (indices.length >= 2) {
        duplicatesValuesIndex.push(...indices);
      }
    });
    return duplicatesValuesIndex;
  };
  async function onSubmit(formData) {
    const duplicatesValuesIndex = checkValidation();

    if (duplicatesValuesIndex.length > 0) {
      duplicatesValuesIndex.forEach((index) => {
        setError(`fields[${index}].nPriority`, {
          type: "manual",
          message: "Priority must be unique",
        });
      });
    } else {
      const payload = {
        ...data,
        aVideoTutorial: formData.fields.map((i) => {
          return {
            nPriority: +i.nPriority,
            sPath: i.sPath,
          };
        }),
      };
      mutate(payload);
    }
  }

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
                <Row className="mt-2">
                  {fields.map((field, index) => (
                    <Row key={field.id} className="mt-3">
                      <Col lg={3} className="mb-2">
                        <Form.Group className="form-group">
                          <CommonInput
                            type="text"
                            register={register}
                            errors={errors}
                            className={`form-control ${
                              errors?.fields?.[index]?.nPriority?.message &&
                              "error"
                            }`}
                            name={`fields[${index}].nPriority`}
                            label="Video Priority"
                            placeholder={`Enter Video Priority`}
                            required
                            validation={{
                              required: {
                                value: true,
                                message: "Priority is required",
                              },
                              pattern: {
                                value: /^[0-9.]+$/,
                                message: "Only numbers are allowed",
                              },
                              maxLength: {
                                value: 4,
                                message: "Priority can not exceed 4 digits",
                              },
                            }}
                          />
                          {errors?.fields?.[index]?.nPriority && (
                            <Form.Control.Feedback type="invalid">
                              {errors.fields[index].nPriority.message}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      </Col>
                      <Col lg={3} className="mb-2">
                        <Form.Group className="form-group">
                          <CommonInput
                            type="text"
                            register={register}
                            errors={errors}
                            className={`form-control ${
                              errors?.fields?.[index]?.sPath?.message && "error"
                            }`}
                            name={`fields[${index}].sPath`}
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
                          {errors?.fields?.[index]?.sPath && (
                            <Form.Control.Feedback type="invalid">
                              {errors.fields[index].sPath.message}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      </Col>
                      {!errors?.fields?.[index]?.sPath && (
                        <Col lg={5}>
                          <div>
                            <Ratio aspectRatio="21x9">
                              <iframe
                                src={watch(`fields[${index}].sPath`)}
                                allow="encrypted-media"
                              ></iframe>
                            </Ratio>
                          </div>
                        </Col>
                      )}
                      <Col>
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
                      </Col>
                    </Row>
                  ))}
                </Row>
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
  );
}

export default HowToPlaVideo;
