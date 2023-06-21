import React, { memo, useState, useEffect } from "react";
import { Tabs, Typography, Form } from "antd";
import ReactStreetview from "react-streetview";
import { GoogleOutlined, PictureOutlined } from "@ant-design/icons";
import CustomUpload from "@/components/CustomUpload";
import { Pannellum, PannellumVideo } from "pannellum-react";
import { checkPanoramaType } from "@/utils";
import defaultPanorama from "@/assets/videos/defaultPanorama.mp4";

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

  console.log("panoramas", panoramas);

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
          Ảnh/Video sưu tầm
        </>
      ),
      children: (
        <div className="custom-panorama">
          {auth.role === "ADMIN" && (
            <Form.Item
              name="panorama"
              label="Ảnh/Video toàn cảnh 360 độ"
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

          {panoramas.length > 0 && panoramas[0].status !== "uploading" ? (
            checkPanoramaType(panoramas[0].url) === "image" ? (
              <div className="pannellum-widget">
                <Pannellum
                  key="image"
                  width="90%"
                  height="500px"
                  image={panoramas[0].url}
                  pitch={10}
                  yaw={180}
                  hfov={110}
                  autoLoad
                ></Pannellum>
              </div>
            ) : checkPanoramaType(panoramas[0].url) === "video" ? (
              <div className="pannellum-widget">
                <PannellumVideo
                  key="video"
                  width="90%"
                  height="500px"
                  video={panoramas[0].url || defaultPanorama}
                  loop
                  autoplay
                  pitch={10}
                  yaw={180}
                  hfov={110}
                  mouseZoom={false}
                  controls={true}
                ></PannellumVideo>
              </div>
            ) : (
              <Text>Chưa có ảnh/video toàn cảnh 360 độ</Text>
            )
          ) : (
            <Text>Chưa có ảnh/video toàn cảnh 360 độ</Text>
          )}
        </div>
      )
      // forceRender: true
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
