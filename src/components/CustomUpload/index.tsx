import React, { useState } from "react";
import { Upload, Modal, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CommonService from "@/services/common";
import { toast } from "react-toastify";
import _ from "lodash";
import ModelViewer from "../ModelViewer";
const { Text } = Typography;

type Props = {
  fileList: any;
  setFileList: (fileList: any) => void;
  accept?: string;
  textInfo?: string;
  type?: "image" | "model";
  modelWidth?: number;
  modelHeight?: number;
  modelScale?: number;
  modelPosition?: [number, number, number];
};

const CustomUpload = ({
  fileList,
  setFileList,
  type = "image",
  modelWidth = 600,
  modelHeight = 400,
  modelScale = 8,
  modelPosition = [0, -9, 0],
  ...restProps
}: Props) => {
  const commonService = new CommonService();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [countModel, setCountModel] = useState(0);
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const getBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  const onCustomRequest = async ({ file }) => {
    if (file.size > MAX_FILE_SIZE) {
      return toast.error("File size must be less than 10MB");
    }

    setFileList([
      {
        uid: "-1",
        name: "file",
        status: "uploading"
      }
    ]);
    const res = await commonService.uploadAttachments(file);
    if (res.payload && res.payload.length > 0) {
      let newFile = res.payload[0];
      setFileList([
        {
          uid: _.uniqueId(),
          name: newFile.fileName,
          status: "done",
          url: newFile.url
        }
      ]);
    } else {
      setFileList([]);
    }
  };

  const handleRemove = () => {
    setFileList([]);
  };

  const handleCancel = () => {
    setPreviewOpen(false);
    setCountModel(countModel + 1);
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
      <Upload
        listType="picture-card"
        fileList={fileList}
        accept={restProps.accept || ".jpg,.jpeg,.png"}
        customRequest={onCustomRequest}
        maxCount={1}
        onRemove={handleRemove}
        onPreview={handlePreview}
        {...restProps}
      >
        {fileList.length < 2 && uploadButton}
      </Upload>
      <Text>
        {restProps.textInfo ||
          "(Photo should be less than 10MB and saved as JPG,PNG)"}
      </Text>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
        width={700}
      >
        {type === "image" && (
          <img alt="example" className="w-100" src={previewImage} />
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
            key={countModel.toString()}
          />
        )}
      </Modal>
    </>
  );
};

export default CustomUpload;
