import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import PropTypes from "prop-types";
import Wrapper from "../Wrap";
import CommonInput from "../CommonInput";
import { URL_REGEX } from "shared/constants";

function SeoInput({
    onSubmit,
    handleSubmit,
    register,
    errors,
  }) {
  return  <Form
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
                    errors?.sTitle && "error"
                  }`}
                  name="sTitle"
                  label="Meta Title"
                  placeholder="Enter Title"
                />
              </Col>
              <Col xl={4} md={6} className="mt-2">
                <CommonInput
                  type="text"
                  register={register}
                  errors={errors}
                  className={`for m-control ${
                    errors?.sCUrl && "error"
                  }`}
                  name="sCUrl"
                  label="Canonical Url"
                  placeholder="Enter Canonical Url"
                  validation={{
                    pattern: {
                        value: URL_REGEX,
                        message: "Invalid Link",
                      },
                  }}
                />
              </Col>
              <Col xl={4} md={6} className="mt-2">
                <CommonInput
                  register={register}
                  errors={errors}
                  className={`for m-control ${
                    errors?.sDescription && "error"
                  }`}
                  name="sDescription"
                  label="Meta description"
                  placeholder="Meta description"
                />
              </Col>
              <Col xl={4} md={6} className="mt-2">
                <CommonInput
                  type="text"
                  register={register}
                  errors={errors}
                  className={`for m-control ${
                    errors?.aKeywords && "error"
                  }`}
                  name="aKeywords"
                  label="Meta keywords"
                  placeholder="Enter Meta keywords"
                />
              </Col>
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
</Form>;
}

export default SeoInput;

SeoInput.propTypes = {
    onSubmit: PropTypes.func,
    register: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    control: PropTypes.object.isRequired,
    watch: PropTypes.func.isRequired,
    // append: PropTypes.func.isRequired,
    // remove: PropTypes.func.isRequired,
    // fields: PropTypes.array.isRequired,
  };
  
