import React from "react";
import "./style.scss";
import { Button, Input } from "antd";
import {
  YoutubeFilled,
  EyeFilled,
  EyeInvisibleFilled
} from "@ant-design/icons";

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
  const handleReview = () => {
    if (value) {
      window.open(value, "_blank");
    }
  };

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
        onClick={handleReview}
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
    </div>
  );
};

export default ReviewInput;
