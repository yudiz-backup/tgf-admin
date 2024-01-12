import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import CommonInput from "shared/components/CommonInput";
import Wrapper from "shared/components/Wrap";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { toaster } from "helper/helper";
import { route } from "shared/constants/AllRoutes";
import { updateHomeData } from "query/home/home.api";
import { Loader } from "shared/components/Loader";
import { useHome } from "shared/hooks/useHome";

const OurResults = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  const [aOurResults, setOurResults] = useState([
    {
      sTitle: "",
      nCount: "",
    },
  ]);
  const { data, refetch, isLoading } = useHome();

  // Function to update nCount for a specific sTitle
  const updateResult = (index, newValues) => {
    setOurResults((prevResults) =>
      prevResults.map((result, i) =>
        i === index ? { ...result, ...newValues } : result
      )
    );
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "all",
  });

  const { mutate } = useMutation(updateHomeData, {
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

  useEffect(() => {
    if (data) {
      if (data?.aOurResults) {
        setOurResults(data.aOurResults);
      }
      reset({ sTagLine: data?.sTagLine });
      setShow(data?.bOurResultsSwitch);
    }
  }, [data]);

  function onSubmit(formData) {
    const payload = {
      ...data,
      aOurResults: aOurResults,
      sTagLine: formData?.sTagLine,
      bOurResultsSwitch: show,
    };
    mutate(payload);
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
                  {aOurResults?.map((result, index) => (
                    <Row key={index} className="mt-2">
                      <Col md={6}>
                        <CommonInput
                          type="text"
                          register={register}
                          errors={errors}
                          className={`form-control ${
                            errors?.[result.sTitle] && "error"
                          }`}
                          name={`${result.sTitle.toLowerCase()}-title`}
                          label="Title"
                          placeholder={`Enter ${result.sTitle} title`}
                          required
                          value={result.sTitle}
                          onChange={(e) =>
                            updateResult(index, { sTitle: e.target.value })
                          }
                          validation={{
                            required: {
                              value: true,
                              message: "This field is required",
                            },
                          }}
                        />
                      </Col>
                      <Col md={6}>
                        <CommonInput
                          type="text"
                          register={register}
                          errors={errors}
                          className={`form-control ${
                            errors?.[result.sTitle] && "error"
                          }`}
                          name={`${result.sTitle.toLowerCase()}-count`}
                          label="Count"
                          placeholder={`Enter ${result.sTitle} count`}
                          required
                          value={result.nCount}
                          onChange={(e) =>
                            updateResult(index, { nCount: e.target.value })
                          }
                          validation={{
                            required: {
                              value: true,
                              message: "This field is required",
                            },
                            // pattern: {
                            //   value: /^[0-9.]+$/,
                            //   message: "Only numbers are allowed",
                            // },
                          }}
                        />
                      </Col>
                    </Row>
                  ))}
                  <Row className="mt-4">
                    <Col md={6}>
                      <Form.Group className="form-group">
                        <Form.Label>
                          <span>
                            Show Our Results
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
                    <Col md={6}>
                      <CommonInput
                        type="text"
                        register={register}
                        errors={errors}
                        className={`for m-control ${
                          errors?.sTagLine && "error"
                        }`}
                        name="sTagLine"
                        label="Tag line"
                        placeholder="Enter Tag Line"
                        required
                        validation={{
                          required: {
                            value: true,
                            message: "Tag Line is required",
                          },
                        }}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col sm={12}>
                      <div className="d-flex gap-3">
                        <Button
                          variant="secondary"
                          onClick={() => navigate(route.userManagement)}
                        >
                          Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                          Save
                        </Button>
                      </div>
                    </Col>
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

export default OurResults;
