import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import CommonInput from "shared/components/CommonInput";
import Wrapper from "shared/components/Wrap";
import { useMutation, useQuery } from "react-query";
import { toaster } from "helper/helper";
import { editApkData, getApkData } from "query/playStore/playstore.api";
import { Loader } from "shared/components/Loader";
import { URL_REGEX } from "shared/constants";
import { useS3Upload } from "shared/hooks/useS3Upload";

const Apk = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm({ mode: "all" });
  const { uploadFile } = useS3Upload();
  const [loading, setLoading] = useState(false)

  const { isLoading } = useQuery("apkData", () => getApkData(), {
    select: (data) => data?.data?.data,
    onSuccess: (data) => {
      reset({
        ...data,
      });
    },
  });

  // EDIT DATA
  const { mutate } = useMutation(editApkData, {
    onSettled: (response) => {
      setLoading(false)
      if (response) {
        toaster(response.data.message);
      } else {
        toaster(response.data.message, "error");
      }
    },
  });

  async function onSubmit(formData) {
    setLoading(true)
    const payload = {
        ePage:"DOWNLOAD",
        sIosLink:formData.sIosLink,
        sAndroidPath:formData.sAndroidPath
    };
    if (typeof formData?.sAndroidPath === "object") {
        const data = [
          {
            sFileName: formData?.sAndroidPath?.name,
            sContentType: formData?.sAndroidPath.type,
            sFlag: "sAndroidPath",
            file: formData?.sAndroidPath,
          },
        ];
        const result = await uploadFile("appfile", data);
        if (result?.err) {
          setLoading(false)
          return null;
        } else {
          for (const key in result) {
            payload[key] = result[key]?.sPath;
          }
        }
      }
    mutate(payload);
  }

  return (
    <>
      {(isLoading || loading) && <Loader />}
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
                    <Col md={6} className="mt-2">
                      <Form.Group className="form-group">
                        <Form.Label>Add APK</Form.Label>
                        <div className="fileinput">
                          <div className="inputtypefile mx-0">
                            <div className="inputMSG">
                              <span>Upload APK</span>
                            </div>

                            <Controller
                              name={`sAndroidPath`}
                              control={control}
                              rules={{
                                required: "Please add Apk",
                              }}
                              render={({ field: { onChange, ref } }) => {
                                return (
                                  <>
                                    <Form.Control
                                      ref={ref}
                                      type="file"
                                      name={`sAndroidPath`}
                                      // disabled={updateFlag}
                                      accept=".apk"
                                      errors={errors}
                                      className={
                                        errors?.sAndroidPath && "error"
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
                          <span className="file">
                            {watch("sAndroidPath")?.name || watch("sAndroidPath")}
                          </span>

                          <span className="card-error">
                            {errors && errors?.sAndroidPath && (
                              <Form.Control.Feedback type="invalid">
                                {errors?.sAndroidPath?.message}
                              </Form.Control.Feedback>
                            )}
                          </span>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col md={6} className="mt-2">
                      <CommonInput
                        type="text"
                        register={register}
                        errors={errors}
                        className={`for m-control ${
                          errors?.sIosLink && "error"
                        }`}
                        name="sIosLink"
                        label="App link IOS "
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
                    <Row className="mt-4">
                      <Col md={6}>
                        {/* <Button
                          variant="secondary"
                          className="me-2"
                          onClick={() => navigate(route.userManagement)}
                        >
                          Cancel
                        </Button> */}
                        <Button variant="primary" type="submit">
                          Update
                        </Button>
                      </Col>
                    </Row>
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

export default Apk;
