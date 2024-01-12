import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import EditorHtml from "shared/components/Editor/Editor";
import Wrapper from "shared/components/Wrap";
import { useAboutUs } from "shared/hooks/useAboutUs";

const OurBrand = () => {
  const [htmlData, setHtmlData] = useState("");
  const { data, mutate } = useAboutUs();

  useEffect(() => {
    if (data) {
      setHtmlData(data?.sBrandContent);
    }
  }, [data]);

  const handleSubmitBlock = async (e) => {
    e.preventDefault();
    const payload = {
      ...data,
      sBrandContent: htmlData,
    };
    mutate(payload);
  };

  return (
    <div>
      <Wrapper>
        <Row>
          <Col xl={9}>
            <EditorHtml htmlData={htmlData} setHtmlData={setHtmlData} />
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

export default OurBrand;
