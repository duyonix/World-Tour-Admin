import CustomUpload from "@/components/CustomUpload";
import ModelViewer from "@/components/ModelViewer";
import { Form, Typography } from "antd";
import React from "react";
const { Text } = Typography;

type Props = {
  models: UploadFile[];
  setModels: (data: UploadFile[]) => void;
  auth: any;
};

const RegionModel = ({ models, setModels, auth }: Props) => {
  return (
    <div className="custom-panorama">
      {auth.role === "ADMIN" && (
        <Form.Item name="model" label="Mô hình 3D" className="mb-3">
          <CustomUpload
            fileList={models}
            setFileList={setModels}
            folder="model"
            accept=".glb"
            textInfo="(Mô hình phải ở định dạng GLB)"
            type="model"
            modelPosition={[0, -10, 0]}
            disabled={auth.role !== "ADMIN"}
          />
        </Form.Item>
      )}

      {models.length > 0 && models[0].status !== "uploading" ? (
        <div className="region-model">
          <ModelViewer
            modelPath={models[0].url}
            position={[0, -4, 0]}
            scale={3.5}
            width={540}
            height={496}
            key={models[0].url}
          />
        </div>
      ) : (
        <Text>Chưa có mô hình 3D tương ứng cho địa danh</Text>
      )}
    </div>
  );
};

export default RegionModel;
