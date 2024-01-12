import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import EditorHtml from "shared/components/Editor/Editor";
import { Controller, useForm } from "react-hook-form";
import Wrapper from "shared/components/Wrap";
import { useS3Upload } from "shared/hooks/useS3Upload";
import { useAboutUs } from "shared/hooks/useAboutUs";

const WhoWeAre = () => {
  const [htmlData, setHtmlData] = useState("");
  const { uploadFile } = useS3Upload();
  const { data, mutate } = useAboutUs();

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
    if (data) {
      setHtmlData(data?.sWhoWeAreContent);
      setValue("sImage", data?.sWhoWeAreBackImage);
    }
  }, [data]);

  const handleSubmitBlock = async (e) => {
    e.preventDefault();
    const payload = {
      ...data,
      sWhoWeAreContent: htmlData,
      sWhoWeAreBackImage: watch("sImage"),
    };

    if (typeof watch("sImage") === "object") {
      const data = [
        {
          sFileName: watch("sImage")?.name,
          sContentType: watch("sImage").type,
          sFlag: "sWhoWeAreBackImage",
          file: watch("sImage"),
        },
      ];
      const result = await uploadFile("whoweare", data);

      if (result?.err) {
        return null;
      } else {
        for (const key in result) {
          payload[key] = result[key]?.sPath;
        }
      }
    }
    mutate(payload);
  };

  return (
    <div>
      <Wrapper>
        <Row>
          <Col xl={9}>
            <EditorHtml htmlData={htmlData} setHtmlData={setHtmlData} />
          </Col>
          <Col xl={3}>
            <Form.Group className="form-group">
              <Form.Label>Logo</Form.Label>
              <div className="fileinput">
                <div className="inputtypefile m-0   ">
                  <div className="inputMSG">
                    <span>Upload Logo</span>
                  </div>

                  <Controller
                    name={`sImage`}
                    control={control}
                    rules={{
                      required: "Please add ticket logo",
                      // validate: {
                      //   fileType: (value) => {
                      //     if (value && typeof watch(`sLogo`) !== "string") {
                      //       const allowedFormats = [
                      //         "jpeg",
                      //         "png",
                      //         "jpg",
                      //         "JPEG",
                      //         "PNG",
                      //         "JPG",
                      //       ];
                      //       const fileExtension = value.name
                      //         .split(".")
                      //         .pop()
                      //         .toLowerCase();

                      //       if (!allowedFormats.includes(fileExtension)) {
                      //         return "Unsupported file format";
                      //       }

                      //       const maxSize = 1 * 1000 * 1000; // 1MB in bytes
                      //       if (value.size >= maxSize) {
                      //         return "File size must be less than 1MB";
                      //       }
                      //     }
                      //     return true;
                      //   },
                      // },
                    }}
                    render={({ field: { onChange, ref } }) => {
                      return (
                        <>
                          <Form.Control
                            ref={ref}
                            type="file"
                            name={`sImage`}
                            // disabled={updateFlag}
                            // accept=".jpg,.jpeg,.png,.JPEG,.JPG,.PNG"
                            errors={errors}
                            className={errors?.sImage && "error"}
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
                  {errors && errors?.sImage && (
                    <Form.Control.Feedback type="invalid">
                      {errors?.sImage?.message}
                    </Form.Control.Feedback>
                  )}
                </span>
                <div className="document-preview-group play-doc-preview">
                  {watch(`sImage`) &&
                    (typeof watch(`sImage`) !== "string" ? (
                      <div className="document-preview">
                        {" "}
                        <img
                          src={URL.createObjectURL(watch(`sImage`))}
                          alt="altImage"
                        />{" "}
                      </div>
                    ) : (
                      <div className="document-preview">
                        <img
                          src={
                            process.env.REACT_APP_AWS_S3_BASE_URL +
                            watch(`sImage`)
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

export default WhoWeAre;
