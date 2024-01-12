import { toaster } from "helper/helper";
import { getFooterData, updateFooterData } from "query/home/home.api";
import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import CommonInput from "shared/components/CommonInput";
import Wrapper from "shared/components/Wrap";
import { URL_REGEX } from "shared/constants";

const Footer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "all",
    defaultValues: {
      fields: [{ value: "" }],
    },
  });

  const { data } = useQuery("footerData", () => getFooterData(), {
    select: (data) => data?.data?.data,
    onSuccess: (data) =>{
reset({sSmsLink:data?.sSmsLink})

    }
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
     ...data,
     sSmsLink: formData.sSmsLink
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
              <Col lg={12}>
                <Wrapper>
                  <Row>
                    <Col xl={4} md={6} className="mt-2">
                    <CommonInput
                        type="text"
                        register={register}
                        errors={errors}
                        className={`for m-control ${
                          errors?.sIosSmsLink && "error"
                        }`}
                        name="sSmsLink"
                        label="Get App Link"
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
