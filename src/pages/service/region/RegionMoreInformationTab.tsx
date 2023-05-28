import React from "react";
import { Row, Col, Typography, Divider, Card, Tooltip } from "antd";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;
const { Meta } = Card;

type Props = {
  data: any;
  setActiveKey: (key: string) => void;
};

const RegionMoreInformationTab = ({ data, setActiveKey }: Props) => {
  const { neighbors, weather } = data;

  return (
    <Row gutter={[64, 16]}>
      {neighbors?.map((neighbor: any) => (
        <Col span={4} key={neighbor.id}>
          <Link
            to={`/service/regions/${neighbor.id}`}
            onClick={() => setActiveKey("1")}
          >
            <Tooltip title={`${neighbor.name} (${neighbor.commonName})`}>
              <Card
                hoverable
                className="region-card"
                cover={<img alt={neighbor.name} src={neighbor.picture} />}
              ></Card>
            </Tooltip>
          </Link>
        </Col>
      ))}
    </Row>
  );
};

export default RegionMoreInformationTab;
