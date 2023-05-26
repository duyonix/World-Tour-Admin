import React from "react";
import { Avatar, Row, Col, Typography, Divider } from "antd";
import defaultRegion from "@/assets/images/defaultRegion.png";
import "./style.scss";
const { Title, Text } = Typography;

type Props = {
  region: any;
};

const RegionLabel = ({ region }: Props) => (
  <div className="region-label">
    <Row gutter={20} wrap={false} justify="start">
      <Col className="d-flex al-center">
        <Avatar src={region?.picture || defaultRegion} size={50} />
      </Col>
      <Col>
        <Title level={5} className="mb-0">
          {region?.name || ""}
          {region.commonName && <Text>{` (${region?.commonName})` || ""}</Text>}
        </Title>

        <Text type="secondary">{region?.category?.name || ""}</Text>
        <br />
        <Text type="secondary">{region?.path || ""}</Text>
      </Col>
    </Row>
    <Divider className="m-0" />
  </div>
);

export default RegionLabel;
