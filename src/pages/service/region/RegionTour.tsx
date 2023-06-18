import React, { memo, useState, useEffect } from "react";
import { Tabs, Typography, Form } from "antd";
import ReactStreetview from "react-streetview";
import { GoogleOutlined, PictureOutlined } from "@ant-design/icons";
import CustomUpload from "@/components/CustomUpload";
import { Pannellum } from "pannellum-react";

const { Text } = Typography;

type Props = {
  coordinate: {
    lattitude: number;
    longitude: number;
  };
  panoramas: UploadFile[];
  setPanoramas: (data: UploadFile[]) => void;
  auth: any;
};

const RegionTour = ({ coordinate, panoramas, setPanoramas, auth }: Props) => {
  const { lattitude, longitude } = coordinate;
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  const [key, setKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setKey(prevKey => prevKey + 1);
    }, 1000); // Set a delay of 1 second before updating the key

    return () => clearTimeout(timer); // Clear the timeout when the component unmounts
  }, [lattitude, longitude]);

  const streetViewPanoramaOptions = {
    position: { lat: lattitude, lng: longitude },
    pov: { heading: 100, pitch: 0 },
    zoom: 1,
    addressControl: true,
    showRoadLabels: true,
    zoomControl: true
  };

  const items = [
    {
      key: "tour-1",
      label: (
        <>
          <GoogleOutlined />
          Ảnh cung cấp bởi Google
        </>
      ),
      children: (
        <div className="street-view">
          <ReactStreetview
            key={key}
            apiKey={googleMapsApiKey}
            streetViewPanoramaOptions={streetViewPanoramaOptions}
          />
        </div>
      )
    },
    {
      key: "tour-2",
      label: (
        <>
          <PictureOutlined />
          Ảnh tự sưu tầm
        </>
      ),
      children: (
        <div className="custom-panorama">
          {auth.role === "ADMIN" && (
            <Form.Item
              name="panorama"
              label="Ảnh toàn cảnh 360 độ"
              className="mb-3"
            >
              <CustomUpload
                type="panorama"
                fileList={panoramas}
                setFileList={setPanoramas}
                disabled={auth.role !== "ADMIN"}
              />
            </Form.Item>
          )}

          {panoramas.length > 0 && panoramas[0].status !== "uploading" && (
            <Pannellum
              width="90%"
              height="500px"
              image={panoramas[0].url}
              pitch={10}
              yaw={180}
              hfov={110}
              autoLoad
            ></Pannellum>
          )}
        </div>
      )
    }
  ];

  return (
    <Tabs
      defaultActiveKey="tour-1"
      centered
      items={items}
      className="region-tour"
    />
  );
};

export default memo(RegionTour);
