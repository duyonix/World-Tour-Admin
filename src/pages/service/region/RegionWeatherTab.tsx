import React from "react";
import { Row, Col, Typography, Card, Space } from "antd";
import { convertTimestampToDate } from "@/utils";

const { Title, Text } = Typography;

interface Weather {
  current: {
    main: string;
    description: string;
    background: string;
    icon: string;
    temp: string;
    humidity: string;
    pressure: string;
    wind: {
      speed: string;
      deg: string;
    };
    sunrise: number;
    sunset: number;
  };
  daily: {
    main: string;
    description: string;
    background: string;
    icon: string;
    temp: {
      day: string;
      night: string;
      min: string;
      max: string;
    };
    humidity: string;
    pressure: string;
    wind: {
      speed: string;
      deg: string;
    };
    sunrise: number;
    sunset: number;
  }[];
}

type Props = {
  weather: Weather;
};

const RegionWeatherTab = ({ weather }: Props) => {
  const { current, daily } = weather;
  const currentMap = [
    {
      label: "Nhiệt độ",
      value: current.temp
    },
    {
      label: "Độ ẩm",
      value: current.humidity
    },
    {
      label: "Áp suất",
      value: current.pressure
    },
    {
      label: "Gió",
      value: `${current.wind.speed}, ${current.wind.deg}`
    },
    {
      label: "Bình minh",
      value: convertTimestampToDate(current.sunrise)
    },
    {
      label: "Hoàng hôn",
      value: convertTimestampToDate(current.sunset)
    }
  ];

  const days = [
    "CHỦ NHẬT",
    "THỨ HAI",
    "THỨ BA",
    "THỨ TƯ",
    "THỨ NĂM",
    "THỨ SÁU",
    "THỨ BẢY"
  ];
  const indexCurrentDay = new Date().getDay();

  return (
    <div
      className="weather"
      style={{
        background: `url(${current.background}) no-repeat center center fixed`,
        backgroundSize: "cover"
      }}
    >
      <Row gutter={[16, 16]} className="mb-2" justify="center">
        <Col span={8}>
          <Card
            className="weather-current"
            title={
              <div className="text-center">
                <Title level={3} className="text-primary mb-0">
                  {current.main.toUpperCase()}
                </Title>
                <Text className="weather-description">
                  {current.description}
                </Text>
              </div>
            }
          >
            <Space direction="vertical" className="w-100">
              {currentMap.map((item, index) => (
                <Row gutter={[16, 16]} justify="space-between" key={index}>
                  <Col flex={1} className="detail-section">
                    {item.label}
                  </Col>
                  <Col className="detail-section">{item.value}</Col>
                </Row>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>

      <div className="future-forecast mt-4">
        <Row gutter={[16, 16]}>
          {daily.map((item, index) => (
            <Col span={6} className="item" key={index}>
              <Row gutter={[16, 16]} className="item-row">
                <Col span={10}>
                  <img
                    src={item.icon}
                    alt={item.description}
                    className="weather-icon"
                  />
                </Col>
                <Col span={14} className="other">
                  <div className="day">
                    {days[(indexCurrentDay + index) % 7]}
                  </div>
                  <div className="temp">Ngày - {item.temp.day}</div>
                  <div className="temp">Đêm - {item.temp.night}</div>
                </Col>
              </Row>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default RegionWeatherTab;
