import React from "react";
import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

type Props = {
  onClick: () => void;
};

const AddButton = ({ onClick }: Props) => {
  return (
    <Button type="primary" icon={<PlusCircleOutlined />} onClick={onClick}>
      Thêm mới
    </Button>
  );
};

export default AddButton;
