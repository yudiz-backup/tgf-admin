import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import CommonInput from "shared/components/CommonInput";
import Wrapper from "shared/components/Wrap";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { route } from "shared/constants/AllRoutes";
import { Select } from "react-rainbow-components";
import { editQuestion, getAllFaqCategoryDropdown, getQuestionById } from "query/faq/faq.api";
import { toaster } from "helper/helper";

const Editquestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset
  } = useForm();
  const [options, setOptions] = useState([
    {
      value: "",
      label: "Select",
    },
  ]);

  // List
  useQuery(["FaqCategoryList"], () => getAllFaqCategoryDropdown(), {
    select: (data) => data.data,
    onSuccess: (data) => {
      const array = data?.data?.map((i) => {
        return {
          label: i.sTitle,
          value: i._id,
        };
      });
      setOptions([...options, ...array]);
    },
  });

useQuery("categoryFaqById", () => getQuestionById(id), {
    enabled: !!id,
    select: (data) => data?.data?.data,
    onSuccess: (data) => {
      reset({...data,category:data?.iCategoryId})
    },
  });

  const { mutate } = useMutation(editQuestion, {
    onSettled: (response) => {
      if (response) {
        toaster(response.data.message);
        navigate(route.questions);
      } else {
        toaster(response.data.message, "error");
      }
    },
  });

  function onSubmit(formData) {
    const data = {
      iCategoryId: formData?.category,
      sQuestion: formData?.sQuestion,
      sAnswer: formData?.sAnswer,
    };
    mutate({data,id});
  }

  return (
    <>
      <Form
        className="step-one user-filter"
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="personal-details">
          <div className="user-form">
            <Row>
              <Col xxl={8}>
                <Wrapper>
                  <Row>
                  <Col lg={6}>
                      <Row>
                        <Col md={12} className="mt-2">
                          <CommonInput
                            type="text"
                            register={register}
                            errors={errors}
                            className={`for m-control ${
                              errors?.sQuestion && "error"
                            }`}
                            name="sQuestion"
                            label="Question"
                            placeholder="Enter Question"
                            required
                            validation={{
                              required: {
                                value: true,
                                message: "Question is required",
                              },
                            }}
                          />
                        </Col>
                        <Col md={12} className="mt-2">
                          <CommonInput
                            register={register}
                            errors={errors}
                            className={`for m-control ${
                              errors?.sAnswer && "error"
                            }`}
                            name="sAnswer"
                            label="Answer"
                            placeholder="Enter Answer"
                            required
                            validation={{
                              required: {
                                value: true,
                                message: "Answer is required",
                              },
                            }}
                          />
                        </Col>
                       </Row>
                    </Col>
                    <Col lg={6} className="mt-2">
                      <Form.Group className="form-group">
                        <Form.Label>
                          <span>
                            Category
                            <span className="inputStar">*</span>
                          </span>
                        </Form.Label>
                        <Controller
                          name="category"
                          control={control}
                          rules={{
                            required: {
                              value: true,
                              message: "Category is required",
                            },
                          }}
                          render={({ field: { onChange, value, ref } }) => (
                            <Select
                              placeholder="Select category"
                              ref={ref}
                              options={options}
                              className={`react-select border-0 ${
                                errors.category && "error"
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
                        {errors.category && (
                          <Form.Control.Feedback type="invalid">
                            {errors.category.message}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                    <div className="mt-4">
                        <Button
                          variant="secondary"
                          className="me-2"
                          onClick={() => navigate(route.questions)}
                        >
                          Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                          Update
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

export default Editquestion;
