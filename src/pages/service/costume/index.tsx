import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Spin,
  Table,
  Space,
  Typography,
  Tag
} from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import qs from "query-string";
import ServiceService from "@/services/service";
import useFetch from "@/hooks/useFetch";
import { useHistory, useLocation } from "react-router-dom";
import { changePage, objectToQueryString, cleanObject } from "@/utils";
import Filter from "@/components/Filter";
import { toast } from "react-toastify";
import ConfirmModal from "@/components/ConfirmModal";
import messages from "@/constants/messages";
import variables, { COSTUME_TYPE } from "@/constants/variables";
import { useAppSelector } from "@/hooks";
import { RootState } from "@/app/store";

const { Text } = Typography;

const ServiceCostumes = () => {
  const serviceService = new ServiceService();
  const auth = useAppSelector((state: RootState) => state.auth);
  const history = useHistory();
  const location = useLocation();
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const queryString = qs.parse(location.search);
  const size = 10;
  const page = queryString.page ? Number(queryString.page) - 1 : 0;
  const { loading, list, total, onReFetch } = useFetch({
    params: JSON.stringify(cleanObject({ ...queryString, page, size })),
    func: serviceService.costume.getCostumes,
    valueProp: "payload.content",
    totalProp: "payload.totalElements"
  });

  const onAdd = () => {
    history.push(`${location.pathname}/add`);
  };
  const onEdit = (id: number) => {
    history.push(`${location.pathname}/${id}`);
  };
  const onDelete = async (id: number, index: number) => {
    setIsDeleteLoading(true);
    const res = await serviceService.costume.deleteCostume(id.toString());
    setIsDeleteLoading(false);

    if (res.status === variables.OK) {
      toast.success(messages.DELETE_SUCCESS("costume"));
      if (index === total && index !== 1 && index % size === 1) {
        history.push(
          "?" +
            objectToQueryString({
              ...queryString,
              page: index / size
            })
        );
      } else {
        onReFetch();
      }
    } else {
      switch (res?.status) {
        case variables.ALREADY_USED_ELSEWHERE:
          return toast.error(messages.ALREADY_USED_ELSEWHERE("costume"));
        default:
          return toast.error(messages.DELETE_FAILED("costume"));
      }
    }
  };

  const onConfirmRemove = (id: number, index: number) => {
    ConfirmModal({
      title: messages.CONFIRM_DELETE("costume"),
      onOk() {
        onDelete(id, index);
      }
    });
  };

  const columns = [
    {
      title: "No.",
      render: (_: any, __: any, index: number) => page * size + index + 1,
      width: 100
    },
    {
      title: "Costume Name",
      dataIndex: "name",
      width: 250
    },
    {
      title: "Type",
      dataIndex: "type",
      width: 200,
      align: "center",
      render: (text: string) => (
        <Tag color={text === COSTUME_TYPE.COMMON ? "cyan" : "gold"}>
          {COSTUME_TYPE[text]}
        </Tag>
      )
    },
    {
      title: "Region",
      dataIndex: ["region", "name"],
      width: 200
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 400,
      render: (text: string) => <Text className="text-limit">{text}</Text>
    },
    {
      title: "",
      dataIndex: "id",
      align: "right",
      render: (id: number, _: any, index: number) => (
        <Space size="middle">
          <Button
            onClick={() => onEdit(id)}
            type="primary"
            icon={auth.role === "ADMIN" ? <EditOutlined /> : <EyeOutlined />}
          ></Button>
          {auth.role === "ADMIN" && (
            <Button
              onClick={() => onConfirmRemove(id, page * size + index + 1)}
              icon={<DeleteOutlined />}
            ></Button>
          )}
        </Space>
      )
    }
  ];
  return (
    <>
      <Filter
        filterSelects={[
          {
            label: "Type",
            name: "type",
            options: Object.keys(COSTUME_TYPE).map(key => ({
              value: key,
              label: COSTUME_TYPE[key]
            }))
          },
          {
            label: "Region",
            name: "regionId",
            isRegionSelect: true,
            size: 8
          }
        ]}
        isReset
        placeholder="Search by Name"
        isSearch
        nameSearch="search"
      />
      <Card className="m-2 radius-lg">
        <Row className="mb-2" justify="space-between">
          <Col className="d-flex al-center">Total: {total}</Col>
          {auth.role === "ADMIN" && (
            <Button type="primary" onClick={onAdd}>
              Add
            </Button>
          )}
        </Row>
        <Spin size="large" spinning={loading || isDeleteLoading}>
          {list.length > 0 ? (
            <Table
              columns={columns as any}
              dataSource={list}
              rowKey="id"
              pagination={{
                position: ["bottomCenter"],
                total,
                showSizeChanger: false,
                pageSize: size,
                current: page + 1,
                onChange(current) {
                  changePage(history, current);
                }
              }}
            ></Table>
          ) : (
            !loading && <div className="text-center m-4">No costumes found</div>
          )}
        </Spin>
      </Card>
    </>
  );
};

export default ServiceCostumes;
