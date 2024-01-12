import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useMutation } from "react-query";
import { updateAboutUsData } from "query/aboutUs/aboutUs.api";
import { toaster } from "helper/helper";
import EditorHtml from "shared/components/Editor/Editor";
import { useAboutUs } from "shared/hooks/useAboutUs";
import Wrapper from "shared/components/Wrap";
import { Controller, useForm } from "react-hook-form";
import { useS3Upload } from "shared/hooks/useS3Upload";

const OurVisionContent = () => {
  const [htmlData, setHtmlData] = useState("");
  const { data, refetch } = useAboutUs();
  const { uploadFile } = useS3Upload();

  const {
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({
    mode: "all",
    defaultValues: {
      fields: [{ value: "" }],
    },
  });


  useEffect(() => {
    if (data?.sOurVisionContent) {
      setHtmlData(data?.sOurVisionContent);
      setValue("sOurVisionBackImage", data?.sOurVisionBackImage);
      setValue("sOurVisionSideImage", data?.sOurVisionSideImage);
    }
  }, [data?.sOurVisionContent]);

  const { mutate } = useMutation(updateAboutUsData, {
    onSettled: (response) => {
      if (response) {
        toaster(response.data.message);
        refetch();
      } else {
        toaster(response.data.message, "error");
      }
    },
  });

  const handleFileUpload = async (file, flag) => {
    if (typeof file === "object") {
      const data = [
        {
          sFileName: file?.name?.replace(/\.(\w+)$/, ""),
          sContentType: file.type,
          sFlag: flag,
          file,
        },
      ];
      const result = await uploadFile("whoweare", data);
      if (!result?.err) {
        return result[flag];
      }
    }
  
    return null;
  };
  
  const handleSubmitBlock = async (e) => {
    e.preventDefault();
    const payload = {
      ...data,
      sOurVisionContent: htmlData,
      sOurVisionBackImage: watch("sOurVisionBackImage"),
      sOurVisionSideImage: watch("sOurVisionSideImage"),
    };
  
    const backImageResult = await handleFileUpload(watch("sOurVisionBackImage"), "sOurVisionBackImage");
    const sideImageResult = await handleFileUpload(watch("sOurVisionSideImage"), "sOurVisionSideImage");
  
    if (backImageResult) {
      payload.sOurVisionBackImage = backImageResult?.sPath;
    }
  
    if (sideImageResult) {
      payload.sOurVisionSideImage = sideImageResult?.sPath;
    }
    mutate(payload);
  };
  

  return (
    <div>
    <Wrapper>
      <Row>
        <Col xl={6}>
          <EditorHtml htmlData={htmlData} setHtmlData={setHtmlData} />
        </Col>
        <Col xl={3}>
          <Form.Group className="form-group">
            <Form.Label>Our vision Background Image</Form.Label>
            <div className="fileinput">
              <div className="inputtypefile m-0   ">
                <div className="inputMSG">
                  <span>Upload Image</span>
                </div>

                <Controller
                  name={`sOurVisionBackImage`}
                  control={control}
                  rules={{
                    required: "Please add ticket logo",
                    validate: {
                      fileType: (value) => {
                        if (value && typeof watch(`sLogo`) !== "string") {
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

                          if (!allowedFormats.includes(fileExtension)) {
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
                          name={`sOurVisionBackImage`}
                          // disabled={updateFlag}
                          accept=".jpg,.jpeg,.png,.JPEG,.JPG,.PNG"
                          errors={errors}
                          className={errors?.sOurVisionBackImage && "error"}
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
                {errors && errors?.sOurVisionBackImage && (
                  <Form.Control.Feedback type="invalid">
                    {errors?.sOurVisionBackImage?.message}
                  </Form.Control.Feedback>
                )}
              </span>
              <div className="document-preview-group play-doc-preview">
                {watch(`sOurVisionBackImage`) &&
                  (typeof watch(`sOurVisionBackImage`) !== "string" ? (
                    <div className="document-preview">
                      {" "}
                      <img
                        src={URL.createObjectURL(watch(`sOurVisionBackImage`))}
                        alt="altImage"
                      />{" "}
                    </div>
                  ) : (
                    <div className="document-preview">
                      <img
                        src={
                          process.env.REACT_APP_AWS_S3_BASE_URL +
                          watch(`sOurVisionBackImage`)
                        }
                        alt="altImage"
                      />{" "}
                    </div>
                  ))}
              </div>
            </div>
          </Form.Group>
        </Col>
        <Col xl={3}>
          <Form.Group className="form-group">
            <Form.Label>Our vision Side Image </Form.Label>
            <div className="fileinput">
              <div className="inputtypefile m-0   ">
                <div className="inputMSG">
                  <span>Upload Image</span>
                </div>

                <Controller
                  name={`sOurVisionSideImage`}
                  control={control}
                  rules={{
                    required: "Please add ticket logo",
                    validate: {
                      fileType: (value) => {
                        if (value && typeof watch(`sOurVisionSideImage`) !== "string") {
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

                          if (!allowedFormats.includes(fileExtension)) {
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
                          name={`sOurVisionSideImage`}
                          // disabled={updateFlag}
                          accept=".jpg,.jpeg,.png,.JPEG,.JPG,.PNG"
                          errors={errors}
                          className={errors?.sOurVisionBackImage && "error"}
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
                {errors && errors?.sOurVisionSideImage && (
                  <Form.Control.Feedback type="invalid">
                    {errors?.sOurVisionSideImage?.message}
                  </Form.Control.Feedback>
                )}
              </span>
              <div className="document-preview-group play-doc-preview">
                {watch(`sOurVisionSideImage`) &&
                  (typeof watch(`sOurVisionSideImage`) !== "string" ? (
                    <div className="document-preview">
                      {" "}
                      <img
                        src={URL.createObjectURL(watch(`sOurVisionSideImage`))}
                        alt="altImage"
                      />{" "}
                    </div>
                  ) : (
                    <div className="document-preview">
                      <img
                        src={
                          process.env.REACT_APP_AWS_S3_BASE_URL +
                          watch(`sOurVisionSideImage`)
                        }
                        alt="altImage"
                      />{" "}
                    </div>
                  ))}
              </div>
            </div>
          </Form.Group>
        </Col>
      </Row>

      <div className="d-flex gap-3 mt-3">
        <Button variant="primary" onClick={handleSubmitBlock}>
          Save
        </Button>
      </div>
    </Wrapper>
  </div>
  );
};

export default OurVisionContent;
