import React, { memo, useCallback, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Table,
  Image,
  Typography
} from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import messages from "@/constants/messages";
import ConfirmModal from "@/components/ConfirmModal";
import CustomUpload from "@/components/CustomUpload";
import { toast } from "react-toastify";
import _ from "lodash";
import "./style.scss";
import ReviewInput from "@/components/ReviewInput";
import AddButton from "@/components/AddButton";
import ReviewModal from "@/components/ReviewModal";

const { Text } = Typography;
const { TextArea } = Input;

type Props = {
  sceneSpots: any[];
  setSceneSpots: (data: any[]) => void;
  auth: any;
};

const RegionSceneSpot = ({ sceneSpots, setSceneSpots, auth }: Props) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isReviewModalVisible, setIsReviewModalVisible] =
    useState<boolean>(false);
  const [reviewUrl, setReviewUrl] = useState<string>("");
  const [isModalChange, setIsModalChange] = useState<boolean>(false);
  const [method, setMethod] = useState("add"); // add or update
  const [id, setId] = useState<any>(null);
  const [sceneSpotImages, setSceneSpotImages] = useState({});
  const [form] = Form.useForm();
  const [page, setPage] = useState(0);
  const size = 10;

  const addSceneSpot = (data: any) => {
    const exist = sceneSpots.find(sceneSpot => sceneSpot.name === data.name);
    if (exist) {
      return toast.error(messages.EXISTED("Tên danh lam thắng ảnh"));
    }

    const newSceneSpots = sceneSpots.concat(data);
    setSceneSpots(newSceneSpots);
    setIsModalVisible(false);
  };

  const updateSceneSpot = data => {
    const exist = sceneSpots.find(
      sceneSpot => sceneSpot.name === data.name && sceneSpot.id !== data.id
    );
    if (exist) {
      return toast.error(messages.EXISTED("Tên địa điểm du lịch"));
    }

    const newSceneSpots = [...sceneSpots];
    const index = newSceneSpots.findIndex(
      sceneSpot => sceneSpot.id === data.id
    );
    newSceneSpots[index] = data;
    setSceneSpots(newSceneSpots);
    setIsModalVisible(false);
  };

  const onAdd = () => {
    setMethod("add");

    const tempId = _.uniqueId("temp_");
    setId(tempId);
    setSceneSpotImages({ ...sceneSpotImages, [tempId]: [] });

    setIsModalVisible(true);
    setIsModalChange(false);
    form.resetFields();
    form.setFieldsValue({ id: tempId });
  };

  const opUpdate = data => {
    setMethod("update");

    setId(data.id);
    setSceneSpotImages({
      ...sceneSpotImages,
      [data.id]: [
        {
          uid: -1,
          name: "Xem hình ảnh",
          status: "done",
          url: data.picture
        }
      ]
    });

    setIsModalVisible(true);
    form.setFieldsValue({ ...data });
    setTimeout(() => {
      setIsModalChange(false);
    }, 0);
  };

  const onDelete = index => {
    const newSceneSpots = [...sceneSpots];
    newSceneSpots.splice(index, 1);
    setSceneSpots(newSceneSpots);
    if (index === newSceneSpots.length && index !== 0 && index % size === 0) {
      setPage(index / size - 1);
    }
  };

  const onConfirmRemove = index => {
    ConfirmModal({
      title: messages.CONFIRM_DELETE("địa điểm du lịch"),
      onOk() {
        onDelete(index);
      }
    });
  };

  const convertData = data => {
    const newData = { ...data };
    const picture = _.get(sceneSpotImages[data.id], "[0].url", "");
    newData.picture = picture;

    return newData;
  };

  const onSave = values => {
    if (sceneSpotImages[id] && sceneSpotImages[id].length === 0) {
      toast.error("Bắt buộc phải có hình ảnh");
      return;
    }

    const data = convertData(values);
    if (method === "add") {
      addSceneSpot(data);
    } else if (method === "update") {
      updateSceneSpot(data);
    }
  };

  const onCancel = () => {
    if (isModalChange) {
      ConfirmModal({
        title: messages.LEAVE,
        onOk() {
          setIsModalVisible(false);
        }
      });
    } else {
      form.resetFields();
      setIsModalVisible(false);
    }
  };

  const handleSceneSpotImages = useCallback(
    images => {
      setSceneSpotImages({ ...sceneSpotImages, [id]: images });
      setIsModalChange(true);
    },
    [id, sceneSpotImages]
  );

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => page * size + index + 1,
      width: 100
    },
    {
      title: "Tên",
      dataIndex: "name",
      width: 200
    },
    {
      title: "Hình ảnh",
      dataIndex: "picture",
      render: (data: string) => (
        <Image
          className="preview-icon-only"
          height={60}
          width={90}
          src={data}
        />
      ),
      width: 300
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      render: (data: string) => <Text className="text-limit">{data}</Text>,
      width: 500
    },
    {
      title: "Youtube Review",
      dataIndex: "review",
      render: (data: string) => (
        <Text
          className="text-link"
          onClick={() => {
            setReviewUrl(data);
            setIsReviewModalVisible(true);
          }}
          style={{ cursor: "pointer" }}
        >
          {data}
        </Text>
      ),
      width: 300
    },
    {
      title: "",
      align: "right",
      render: (data, _, index) => (
        <Space size="middle">
          <Button
            onClick={() => opUpdate(data)}
            type="primary"
            icon={auth.role === "ADMIN" ? <EditOutlined /> : <EyeOutlined />}
          ></Button>
          {auth.role === "ADMIN" && (
            <Button
              onClick={() => onConfirmRemove(page * size + index)}
              icon={<DeleteOutlined />}
            ></Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div>
      <Row className="mb-2" justify="space-between">
        <Col className="d-flex al-center">
          Tổng cộng: {sceneSpots.length} địa điểm du lịch
        </Col>
        {auth.role === "ADMIN" && <AddButton onClick={onAdd} />}
      </Row>
      {sceneSpots.length > 0 ? (
        <Table
          columns={columns as any}
          dataSource={sceneSpots}
          rowKey="id"
          pagination={{
            position: ["bottomCenter"],
            total: sceneSpots.length,
            showSizeChanger: false,
            pageSize: size,
            current: page + 1,
            onChange: page => setPage(page - 1)
          }}
        ></Table>
      ) : (
        <div className="text-center m-4">
          Không tìm thấy địa điểm du lịch nào
        </div>
      )}

      <Modal
        title={
          method === "add"
            ? "Thêm địa điểm du lịch"
            : auth.role === "ADMIN"
            ? "Cập nhật địa điểm du lịch"
            : "Xem thông tin địa điểm du lịch"
        }
        open={isModalVisible}
        onCancel={onCancel}
        width={700}
        footer={null}
        closable={false}
        centered
      >
        <Form
          layout="vertical"
          form={form}
          onValuesChange={() => {
            setIsModalChange(true);
          }}
          className="detail-drole d-flex fl-wrap fl-column fl-between"
          name="app"
          onFinish={onSave}
        >
          <Row gutter={[40, 16]}>
            <Col span={24}>
              <Form.Item name="id" style={{ display: "none" }}>
                <Input disabled={auth.role !== "ADMIN"} />
              </Form.Item>
              <Form.Item
                name="name"
                label="Tên địa điểm du lịch"
                rules={[
                  {
                    required: true,
                    message: "Tên địa điểm du lịch là bắt buộc"
                  }
                ]}
              >
                <Input disabled={auth.role !== "ADMIN"} />
              </Form.Item>
              <Form.Item
                name="picture"
                label={
                  <label className="label-required title-header">
                    Hình ảnh
                  </label>
                }
                className="mt-2"
              >
                <CustomUpload
                  fileList={sceneSpotImages[id]}
                  setFileList={handleSceneSpotImages}
                  disabled={auth.role !== "ADMIN"}
                />
              </Form.Item>
              <Form.Item name="description" label="Mô tả" className="mt-2">
                <TextArea rows={4} disabled={auth.role !== "ADMIN"} />
              </Form.Item>
              <Form.Item
                name="review"
                label="Youtube Review"
                className="mt-2"
                rules={[
                  {
                    type: "url",
                    message: "Đường dẫn không hợp lệ"
                  }
                ]}
              >
                <ReviewInput disabled={auth.role !== "ADMIN"} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Space
          className="mt-3"
          style={{
            display: "flex",
            justifyContent: "flex-end"
          }}
        >
          <Button onClick={onCancel} htmlType="button">
            Quay về
          </Button>
          {auth.role === "ADMIN" && (
            <Button
              disabled={!isModalChange}
              type="primary"
              onClick={() => {
                form.submit();
              }}
            >
              Lưu
            </Button>
          )}
        </Space>
      </Modal>
      <ReviewModal
        url={reviewUrl}
        open={isReviewModalVisible}
        onClose={() => setIsReviewModalVisible(false)}
      />
    </div>
  );
};

export default memo(RegionSceneSpot);
