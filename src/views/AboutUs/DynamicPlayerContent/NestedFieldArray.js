import Delete from "assets/images/icons/delete";
import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Controller, useFieldArray } from "react-hook-form";
import CommonInput from "shared/components/CommonInput";

export const NestedArray = ({
  nestIndex,
  control,
  watch,
  errors,
  register,
}) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `test.${nestIndex}.nestedArray`,
  });

  return (
    <React.Fragment>
      {fields.map((item, k) => {
        return (
          <Row key={item.id}>
            <Col md={12} xl={6} className="mb-2">
              <Form.Group className="form-group">
                <Form.Label>Image</Form.Label>
                <div className="fileinput">
                  <div className="inputtypefile m-0   ">
                    <div className="inputMSG">
                      <span>Upload Image</span>
                    </div>
                    <Controller
                      name={`fields[${k}].sLogo`}
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
                      render={({ field: { onChange, value, ref } }) => {
                        return (
                          <>
                            <Form.Control
                              ref={ref}
                              type="file"
                              name={`fields[${k}].sLogo`}
                              // disabled={updateFlag}
                              accept=".jpg,.jpeg,.png,.JPEG,.JPG,.PNG"
                              errors={errors}
                              className={errors?.fields?.[k]?.sLogo && "error"}
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
                    {errors && errors?.fields?.[k]?.sLogo && (
                      <Form.Control.Feedback type="invalid">
                        {errors?.fields?.[k]?.sLogo.message}
                      </Form.Control.Feedback>
                    )}
                  </span>
                </div>
                <div className="document-preview-group play-doc-preview justify-content-start">
                  {watch(`fields[${k}].sLogo`) &&
                    (typeof watch(`fields[${k}].sLogo`) !== "string" ? (
                      <div className="document-preview">
                        {" "}
                        <img
                          src={URL.createObjectURL(watch(`fields[${k}].sLogo`))}
                          alt="altImage"
                        />{" "}
                      </div>
                    ) : (
                      <div className="document-preview">
                        <img src={watch(`fields[${k}].sLogo`)} alt="altImage" />{" "}
                      </div>
                    ))}
                </div>
                {k !== 0 && (
                  <Button
                    variant="danger"
                    className="mt-2"
                    onClick={() => remove(k)}
                    size="sm"
                  >
                    <Delete />
                  </Button>
                )}
              </Form.Group>
            </Col>
            <Col md={12} xl={6} className="mb-2">
              <Form.Group className="form-group">
                <CommonInput
                  type="text"
                  register={register}
                  errors={errors}
                  className={`form-control ${
                    errors?.fields?.[k]?.priority?.message && "error"
                  }`}
                  name={`fields[${k}].priority`}
                  label="Priority"
                  placeholder={`Enter text`}
                  required
                  validation={{
                    required: {
                      value: true,
                      message: "This field is required",
                    },
                  }}
                />
                {errors?.fields?.[k]?.priority && (
                  <Form.Control.Feedback type="invalid">
                    {errors.fields[k].priority.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>
        );
      })}
      <Button
        variant="secondary"
        className="mt-2"
        onClick={() =>
          append({
            field1: "field1",
            field2: "field2",
          })
        }
      >
        Add Image
      </Button>
    </React.Fragment>
  );
};