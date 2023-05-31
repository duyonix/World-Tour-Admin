import React, { useState } from "react";
import { Modal } from "antd";
import _ReactPlayer, { ReactPlayerProps } from "react-player";
const ReactPlayer = _ReactPlayer as unknown as React.FC<ReactPlayerProps>;

type Props = {
  url: string;
  open: boolean;
  onClose: () => void;
};

const ReviewModal = ({ url, open, onClose }: Props) => {
  return (
    <Modal
      title="Xem giới thiệu"
      centered
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
      destroyOnClose
    >
      <ReactPlayer
        url={url}
        controls
        width="100%"
        height="535px"
        playing
        config={{
          youtube: {
            playerVars: { showinfo: 1 }
          }
        }}
      />
    </Modal>
  );
};

export default ReviewModal;
