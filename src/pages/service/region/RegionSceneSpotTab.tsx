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
  Tooltip,
  Typography
} from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import messages from "@/constants/messages";
import ConfirmModal from "@/components/ConfirmModal";
import CustomUpload from "@/components/CustomUpload";
import { toast } from "react-toastify";
import _ from "lodash";
import "./style.scss";

const { Text } = Typography;
const { TextArea } = Input;

type Props = {
  sceneSpots: any[];
  setSceneSpots: (data: any[]) => void;
  auth: any;
};

const RegionSceneSpot = ({ sceneSpots, setSceneSpots, auth }: Props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalChange, setIsModalChange] = useState(false);
  const [method, setMethod] = useState("add"); // add or update
  const [id, setId] = useState<any>(null);
  const [sceneSpotImages, setSceneSpotImages] = useState({});
  const [form] = Form.useForm();
  const [page, setPage] = useState(0);
  const size = 10;

  const addSceneSpot = (data: any) => {
    const exist = sceneSpots.find(sceneSpot => sceneSpot.name === data.name);
    if (exist) {
      return toast.error(messages.EXISTED("Scene spot name"));
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
      return toast.error(messages.EXISTED("Scene spot name"));
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
          name: "image.jpg",
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
      title: messages.CONFIRM_DELETE("scene spot"),
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
      toast.error("Please upload picture");
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
    (id, images) => {
      setSceneSpotImages({ ...sceneSpotImages, [id]: images });
      setIsModalChange(true);
    },
    [id, sceneSpotImages]
  );

  const columns = [
    {
      title: "No.",
      render: (_, __, index) => page * size + index + 1,
      width: 100
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 200
    },
    {
      title: "Picture",
      dataIndex: "picture",
      render: (data: string) => (
        <Image className="preview-icon-only" height={50} src={data} />
      ),
      width: 300
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (data: string) => (
        <Tooltip title={data} placement="topLeft">
          <Text className="text-limit">{data}</Text>
        </Tooltip>
      ),
      width: 500
    },
    {
      title: "Youtube review",
      dataIndex: "review",
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
        <Col className="d-flex al-center">Total: {sceneSpots.length}</Col>
        {auth.role === "ADMIN" && (
          <Col>
            <Button type="primary" onClick={onAdd}>
              Add
            </Button>
          </Col>
        )}
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
        <div className="text-center m-4">No scene spots found</div>
      )}

      <Modal
        title={
          method === "add"
            ? "Add Scene Spot"
            : auth.role === "ADMIN"
            ? "Edit Scene Spot"
            : "View Scene Spot"
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
          // style={{ minHeight: 450 }}
          name="app"
          onFinish={onSave}
          disabled={auth.role !== "ADMIN"}
        >
          <Row gutter={[40, 16]}>
            <Col span={24}>
              <Form.Item name="id" style={{ display: "none" }}>
                <Input />
              </Form.Item>
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  {
                    required: true,
                    message: "Name is required"
                  }
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="picture"
                label={
                  <label className="label-required title-header">Image</label>
                }
                className="mt-2"
              >
                <CustomUpload
                  fileList={sceneSpotImages[id]}
                  setFileList={images => handleSceneSpotImages(id, images)}
                />
              </Form.Item>
              <Form.Item
                name="description"
                label="Description"
                className="mt-2"
              >
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item
                name="review"
                label="Youtube review"
                className="mt-2"
                rules={[
                  {
                    type: "url",
                    message: "Youtube review link must be a valid url."
                  }
                ]}
              >
                <Input className="text-link" />
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
            Back
          </Button>
          {auth.role === "ADMIN" && (
            <Button
              disabled={!isModalChange}
              type="primary"
              onClick={() => {
                form.submit();
              }}
            >
              Save
            </Button>
          )}
        </Space>
      </Modal>
    </div>
  );
};

export default memo(RegionSceneSpot);
