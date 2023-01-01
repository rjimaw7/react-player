import { UploadOutlined } from "@ant-design/icons";
import { Button, Divider, Input, Modal, Upload, UploadFile } from "antd";
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import PlayerControls from "./PlayerControls";

interface UploadFileTypes {
  status: string;
  uid: string;
  name: string;
  size: number;
  type: string;
}

const ReactPlayerMain = () => {
  const [url, setUrl] = useState("");
  const [source, setSource] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const [fileList, setFileList] = useState<UploadFile<UploadFileTypes>[]>([]);

  const [playing, setPlaying] = useState(true);
  const [onMute, setOnMute] = useState(false);

  const [current, setCurrent] = useState<number>();
  const [duration, setDuration] = useState<number>();

  const playerRef = useRef<any>();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setIsUploaded(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsUploaded(false);
  };

  useEffect(() => {
    if (isUploaded && url && url !== source) {
      setSource(url);
    }
  }, [isUploaded, url]);

  return (
    <>
      <div className="flex items-center h-screen border border-black">
        <div className="mx-auto">
          {isUploaded ? (
            <>
              <h1 className="text-5xl text-center font-bold mx-auto mb-2">
                React Player
              </h1>
              <ReactPlayer
                id="player"
                url={source}
                playing={playing}
                ref={playerRef}
                onProgress={(progress) => setCurrent(progress.playedSeconds)}
                onDuration={(dur) => setDuration(dur)}
                muted={onMute}
              />
              <PlayerControls
                isUploaded={isUploaded}
                isPlaying={playing}
                setPlaying={setPlaying}
                playerRef={playerRef}
                current={current}
                setCurrent={setCurrent}
                duration={duration}
                onMute={onMute}
                setOnMute={setOnMute}
              />

              {/* RESET BUTTON */}
              <Button
                onClick={() => window.location.reload()}
                className="m-auto flex"
              >
                <span>Reset</span>
              </Button>
            </>
          ) : (
            <>
              <h1 className="text-5xl text-center font-bold mx-auto mb-2">
                React Player
              </h1>
              <Button className="w-full" onClick={showModal}>
                <UploadOutlined />
                <span>Upload Video / Link</span>
              </Button>
            </>
          )}
        </div>
      </div>
      {/* MODAL */}
      <Modal
        title="Upload"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            className="bg-blue text-black"
            onClick={handleOk}
          >
            Upload
          </Button>,
        ]}
        centered
      >
        <div className="m-4">
          <div className="my-10 items-center flex flex-col justify-center">
            <Upload
              className="flex flex-row items-center justify-center"
              accept=".mp4,.mp3"
              onRemove={(file) => {
                const index = fileList.indexOf(file);
                const newFileList = fileList.slice();
                newFileList.splice(index, 1);
                setFileList(newFileList);
              }}
              beforeUpload={(file) => {
                setFileList([...fileList, file]);

                return false;
              }}
              fileList={fileList}
            >
              {fileList.length > 0 ? null : (
                <Button>
                  <UploadOutlined />
                  <span>Upload Video</span>
                </Button>
              )}
            </Upload>
            <Divider
              className="w-20 text-gray-800 text-base"
              style={{ borderBlockStart: "0 rgba(5, 5, 5, 0.2)" }}
              dashed
            >
              OR
            </Divider>
            <div className="my-10 items-center flex flex-col justify-center">
              <Input
                addonBefore="Enter video URL"
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ReactPlayerMain;
