import React, { useState } from "react";
import "./style.scss";
import { Button, Input } from "antd";
import {
  YoutubeFilled,
  EyeFilled,
  EyeInvisibleFilled
} from "@ant-design/icons";
import ReviewModal from "../ReviewModal";

type Props = {
  value?: string;
  onChange?: any;
  disabled?: boolean;
};

const ReviewInput = ({
  value,
  onChange,
  disabled = false,
  ...restProps
}: Props) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <div className="d-flex review-input">
      <Input
        className="input-link"
        prefix={<YoutubeFilled style={{ fontSize: "20px" }} />}
        onChange={onChange}
        value={value}
        style={{ flexGrow: 1 }}
        disabled={disabled}
        {...restProps}
      />
      <Button
        onClick={() => setOpenModal(true)}
        className="form-item-icon"
        icon={
          value ? (
            <EyeFilled style={{ fontSize: "20px" }} />
          ) : (
            <EyeInvisibleFilled style={{ fontSize: "20px" }} />
          )
        }
        disabled={!value}
      />
      <ReviewModal
        url={value || ""}
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
};

export default ReviewInput;
