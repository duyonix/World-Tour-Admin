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
  Typography,
  Tabs,
  InputNumber
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

const { Text, Title } = Typography;
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
  const [sceneSpotPanoramas, setSceneSpotPanoramas] = useState({});
  const [activeKey, setActiveKey] = useState<string>("sceneSpot1");
  const [form] = Form.useForm();
  const [page, setPage] = useState(0);
  const size = 10;

  const watchVirtual3DX = Form.useWatch(["virtual3D", "x"], form);
  const watchVirtual3DY = Form.useWatch(["virtual3D", "y"], form);
  const watchVirtual3DZ = Form.useWatch(["virtual3D", "z"], form);

  const isRequiredVirtual3D =
    watchVirtual3DX || watchVirtual3DY || watchVirtual3DZ;

  const addSceneSpot = (data: any) => {
    const exist = sceneSpots.find(sceneSpot => sceneSpot.name === data.name);
    if (exist) {
      return toast.error(messages.EXISTED("Tên địa điểm du lịch"));
    }

    const newSceneSpots = sceneSpots.concat(data);
    setSceneSpots(newSceneSpots);
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
  };

  const onAdd = () => {
    setMethod("add");

    const tempId = _.uniqueId("temp_");
    setId(tempId);
    setSceneSpotImages({ ...sceneSpotImages, [tempId]: [] });
    setSceneSpotPanoramas({ ...sceneSpotPanoramas, [tempId]: [] });

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
      [data.id]: data.picture
        ? [
            {
              uid: -1,
              name: "Xem hình ảnh",
              status: "done",
              url: data.picture
            }
          ]
        : []
    });

    setSceneSpotPanoramas({
      ...sceneSpotPanoramas,
      [data.id]: data.panorama
        ? [
            {
              uid: -1,
              name: "Xem ảnh/video toàn cảnh 360 độ",
              status: "done",
              url: data.panorama
            }
          ]
        : []
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

    const panorama = _.get(sceneSpotPanoramas[data.id], "[0].url", "");
    newData.panorama = panorama;

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

    setIsModalVisible(false);
    form.resetFields();
    setActiveKey("sceneSpot1");
  };

  const onCancel = () => {
    if (isModalChange) {
      ConfirmModal({
        title: messages.LEAVE,
        onOk() {
          setIsModalVisible(false);
          form.resetFields();
          setActiveKey("sceneSpot1");
        }
      });
    } else {
      form.resetFields();
      setIsModalVisible(false);
      setActiveKey("sceneSpot1");
    }
  };

  const handleSceneSpotImages = useCallback(
    images => {
      setSceneSpotImages({ ...sceneSpotImages, [id]: images });
      setIsModalChange(true);
    },
    [id, sceneSpotImages]
  );

  const handleSceneSpotPanoramas = useCallback(
    panoramas => {
      setSceneSpotPanoramas({ ...sceneSpotPanoramas, [id]: panoramas });
      setIsModalChange(true);
    },
    [id, sceneSpotPanoramas]
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

  const itemsTab = [
    {
      label: "Thông tin chung",
      key: "sceneSpot1",
      children: (
        <Row gutter={[40, 16]} style={{ height: "500px" }}>
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

            <Row className="mt-2">
              <Col span={12}>
                <Form.Item
                  name="picture"
                  label={
                    <label className="label-required title-header">
                      Hình ảnh
                    </label>
                  }
                >
                  <CustomUpload
                    fileList={sceneSpotImages[id]}
                    setFileList={handleSceneSpotImages}
                    disabled={auth.role !== "ADMIN"}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="panorama" label="Ảnh/Video toàn cảnh 360 độ">
                  <CustomUpload
                    type="panorama"
                    fileList={sceneSpotPanoramas[id]}
                    setFileList={handleSceneSpotPanoramas}
                    disabled={auth.role !== "ADMIN"}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label="Mô tả"
              className="mt-2"
              rules={[
                {
                  required: true,
                  message: "Mô tả là bắt buộc"
                }
              ]}
            >
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
      ),
      forceRender: true
    }
  ];

  if (auth.role === "ADMIN") {
    itemsTab.push({
      label: "Thông số thiết lập",
      key: "sceneSpot2",
      children: (
        <div>
          <Title level={5} className="text-center">
            Tọa độ ảo khi tham quan trong mô hình 3D
          </Title>
          <Row
            gutter={[40, 16]}
            style={{ height: "468px", justifyContent: "center" }}
          >
            <Col span={12}>
              <Form.Item
                name={["virtual3D", "x"]}
                label="Tọa độ X"
                rules={[
                  {
                    required: isRequiredVirtual3D,
                    message: "Tọa độ X là bắt buộc"
                  }
                ]}
              >
                <InputNumber
                  className="w-100 input-number-custom"
                  disabled={auth.role !== "ADMIN"}
                />
              </Form.Item>

              <Form.Item
                name={["virtual3D", "y"]}
                label="Tọa độ Y"
                className="mt-2"
                rules={[
                  {
                    required: isRequiredVirtual3D,
                    message: "Tọa độ Y là bắt buộc"
                  }
                ]}
              >
                <InputNumber
                  className="w-100 input-number-custom"
                  disabled={auth.role !== "ADMIN"}
                />
              </Form.Item>

              <Form.Item
                name={["virtual3D", "z"]}
                label="Tọa độ Z"
                className="mt-2"
                rules={[
                  {
                    required: isRequiredVirtual3D,
                    message: "Tọa độ Z là bắt buộc"
                  }
                ]}
              >
                <InputNumber
                  className="w-100 input-number-custom"
                  disabled={auth.role !== "ADMIN"}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      ),
      forceRender: true
    });
  }

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
        className="scene-spot-modal"
      >
        <Form
          layout="vertical"
          form={form}
          onValuesChange={() => {
            setIsModalChange(true);
          }}
          className="scene-spot-form detail-drole d-flex fl-wrap fl-column fl-between"
          name="app"
          onFinish={onSave}
        >
          <Tabs
            activeKey={activeKey}
            items={itemsTab}
            onChange={key => {
              setActiveKey(key);
            }}
          />
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
