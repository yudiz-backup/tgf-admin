import React, { useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import ImagePreview from "shared/components/ImagePreview";
import Wrapper from "shared/components/Wrap";
import { useHome } from "shared/hooks/useHome";
import { useS3Upload } from "shared/hooks/useS3Upload";

function DownloadSection() {
  const { data, mutate } = useHome();
  const { uploadFile } = useS3Upload();
  const {
    formState: { errors },
    control,
    watch,
    reset,
  } = useForm({
    mode: "all",
    defaultValues: {
      fields: [{ value: "" }],
    },
  });

  useEffect(() => {
    if (data) {
      reset({ ...data });
    }
  }, [data]);

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
      const result = await uploadFile("home", data);
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
      sDownloadMokeUpImage: watch("sDownloadMokeUpImage"),
      sDownloadSideImage: watch("sDownloadSideImage"),
    };

    const backImageResult = await handleFileUpload(
      watch("sDownloadMokeUpImage"),
      "sDownloadMokeUpImage"
    );
    const sideImageResult = await handleFileUpload(
      watch("sDownloadSideImage"),
      "sDownloadSideImage"
    );

    if (backImageResult) {
      payload.sDownloadMokeUpImage = backImageResult?.sPath;
    }

    if (sideImageResult) {
      payload.sDownloadSideImage = sideImageResult?.sPath;
    }
    mutate(payload);
  };

  return (
    <Wrapper>
      <Row>
        <Col xl={3}>
          <Form.Group className="form-group">
            <Form.Label>Mockup Image</Form.Label>
            <div className="fileinput">
              <div className="inputtypefile m-0   ">
                <div className="inputMSG">
                  <span>Upload Image</span>
                </div>

                <Controller
                  name={`sDownloadMokeUpImage`}
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
                          name={`sDownloadMokeUpImage`}
                          accept=".jpg,.jpeg,.png,.JPEG,.JPG,.PNG"
                          errors={errors}
                          className={errors?.sDownloadMokeUpImage && "error"}
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
                {errors && errors?.sDownloadMokeUpImage && (
                  <Form.Control.Feedback type="invalid">
                    {errors?.sDownloadMokeUpImage?.message}
                  </Form.Control.Feedback>
                )}
              </span>
              <ImagePreview path={watch("sDownloadMokeUpImage")} />
            </div>
          </Form.Group>
        </Col>
        <Col xl={3}>
          <Form.Group className="form-group">
            <Form.Label>Side Image</Form.Label>
            <div className="fileinput">
              <div className="inputtypefile m-0   ">
                <div className="inputMSG">
                  <span>Upload Image</span>
                </div>

                <Controller
                  name={`sDownloadSideImage`}
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
                          name={`sDownloadSideImage`}
                          accept=".jpg,.jpeg,.png,.JPEG,.JPG,.PNG"
                          errors={errors}
                          className={errors?.sDownloadSideImage && "error"}
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
                {errors && errors?.sDownloadSideImage && (
                  <Form.Control.Feedback type="invalid">
                    {errors?.sDownloadSideImage?.message}
                  </Form.Control.Feedback>
                )}
              </span>
              <ImagePreview path={watch(`sDownloadSideImage`)} />
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
  );
}

export default DownloadSection;
