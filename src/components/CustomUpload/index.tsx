import React, { useState } from "react";
import { Upload, Modal, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CommonService from "@/services/common";
import { toast } from "react-toastify";
import _ from "lodash";
import ModelViewer from "../ModelViewer";
import { Pannellum, PannellumVideo } from "pannellum-react";
import { checkPanoramaType } from "@/utils";
import defaultPanorama from "@/assets/videos/defaultPanorama.mp4";
const { Text } = Typography;

type Props = {
  fileList: any;
  setFileList: (fileList: any) => void;
  folder?: string;
  accept?: string;
  multiple?: boolean;
  maxCount?: number;
  textInfo?: string;
  disabled?: boolean;
  type?: "image" | "model" | "panorama";
  modelWidth?: number;
  modelHeight?: number;
  modelScale?: number;
  modelPosition?: [number, number, number];
};

const CustomUpload = ({
  fileList,
  setFileList,
  folder = "picture",
  type = "image",
  multiple = false,
  maxCount = 1,
  disabled = false,
  modelWidth = 800,
  modelHeight = 400,
  modelScale = 8,
  modelPosition = [0, 0, 0],
  ...restProps
}: Props) => {
  const commonService = new CommonService();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [count, setCount] = useState(0);
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const getBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  const onCustomRequest = async ({ file }) => {
    if (type === "image" && file.size > MAX_FILE_SIZE) {
      return toast.error(`Kích thước ảnh không được vượt quá 10MB`);
    }

    const uid = _.uniqueId();

    const fileStateUpload = {
      uid,
      name: "file",
      status: "uploading"
    };

    if (!multiple) {
      setFileList([fileStateUpload]);
    } else {
      setFileList(prevFileList => [...prevFileList, fileStateUpload]);
    }

    const res = await commonService.uploadAttachments(file, folder);
    if (res.payload && res.payload.length > 0) {
      let newFile = res.payload[0];
      const data = {
        uid,
        name:
          type === "model"
            ? "Xem mô hình"
            : type === "panorama"
            ? "Xem ảnh/video toàn cảnh 360 độ"
            : "Xem hình ảnh",
        status: "done",
        url: newFile.url
      };

      if (!multiple) {
        setFileList([data]);
      } else {
        setFileList(prevFileList =>
          prevFileList.map(item => (item.uid === uid ? data : item))
        );
      }
    } else {
      setFileList(prevFileList => (multiple ? prevFileList : []));
    }
  };

  const handleRemove = file => {
    if (!multiple) {
      setFileList([]);
    } else {
      setFileList(fileList.filter(item => item.uid !== file.uid));
    }
  };

  const handleCancel = () => {
    setPreviewOpen(false);
    setCount((count: number) => count + 1);
  };

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      {disabled && (fileList == null || fileList.length === 0) ? (
        <Text>Không có</Text>
      ) : (
        <>
          <Upload
            listType="picture-card"
            fileList={fileList}
            accept={
              restProps.accept || type === "panorama"
                ? ".jpg,.jpeg,.png,.gif,.mp4,.avi, .mov, .vmv"
                : ".jpg,.jpeg,.png"
            }
            customRequest={onCustomRequest}
            maxCount={multiple ? maxCount : 1}
            onRemove={handleRemove}
            onPreview={handlePreview}
            disabled={disabled}
            multiple={multiple}
            {...restProps}
          >
            {((!multiple && fileList.length < 2) ||
              (multiple && fileList.length < maxCount)) &&
              !disabled &&
              uploadButton}
          </Upload>
          {multiple && (
            <Text style={{ display: "block" }}>
              Có thể đăng tải nhiều hình ảnh cùng lúc (Dùng phím Ctrl để chọn)
            </Text>
          )}
          <Text>
            {type !== "panorama" &&
              (restProps.textInfo ||
                "(Ảnh tối đa 10MB, định dạng JPG, PNG, JPEG)")}
          </Text>
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
            width={type === "panorama" ? "1000px" : "70%"}
            centered
            forceRender={type === "panorama"}
          >
            {type === "image" && (
              <img
                alt="example"
                style={{
                  display: "block",
                  margin: "0 auto",
                  height: "500px"
                }}
                src={previewImage}
              />
            )}

            {type === "model" && (
              <ModelViewer
                scale={modelScale}
                modelPath={previewImage}
                position={modelPosition}
                style={{
                  height: modelHeight,
                  width: modelWidth,
                  margin: "0 auto"
                }}
                width={modelWidth}
                height={modelHeight}
                key={count.toString()}
              />
            )}

            {type === "panorama" &&
              previewOpen &&
              (checkPanoramaType(previewImage) === "image" ? (
                <div className="pannellum-widget">
                  <Pannellum
                    key="image"
                    width="100%"
                    height="500px"
                    image={previewImage}
                    pitch={10}
                    yaw={180}
                    hfov={110}
                    autoLoad
                  ></Pannellum>
                </div>
              ) : checkPanoramaType(previewImage) === "video" ? (
                <div className="pannellum-widget">
                  <PannellumVideo
                    key="video"
                    width="100%"
                    height="500px"
                    video={previewImage || defaultPanorama}
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
                <div className="text-center">
                  Chưa có ảnh/video toàn cảnh 360 độ
                </div>
              ))}
          </Modal>
        </>
      )}
    </>
  );
};

export default CustomUpload;
