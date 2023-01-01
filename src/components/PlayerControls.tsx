import {
  CaretRightFilled,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LeftOutlined,
  PauseOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { Direction, Slider } from "react-player-controls";
import VolumeOff from "./VolumeOff";
import VolumeUp from "./VolumeUp";
import { format, toDate } from "date-fns";

const WHITE_SMOKE = "#eee";
const GRAY = "#878c88";
const PRIMARY = "#1890FF";

interface Props {
  direction: Direction;
  value: number;
  style?: any;
}

interface ProgressProps extends Props {
  isEnabled: boolean;
  setCurrent: React.Dispatch<React.SetStateAction<number | undefined>>;
  duration?: number;
  playerRef: React.MutableRefObject<any>;
}

interface ComponentProps {
  isUploaded: boolean;
  isPlaying: boolean;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  playerRef: React.MutableRefObject<any>;
  current?: number;
  duration?: number;
  onMute: boolean;
  setOnMute: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrent: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const SliderBar = ({ direction, value, style }: Props) => (
  <div
    className="bg-primary-500"
    style={{
      position: "absolute",
      background: GRAY,
      borderRadius: 4,
      ...(direction === Direction.HORIZONTAL
        ? {
            top: 0,
            bottom: 0,
            left: 0,
            width: `${value * 100}%`,
          }
        : {
            right: 0,
            bottom: 0,
            left: 0,
            height: `${value * 100}%`,
          }),
      ...style,
    }}
  />
);

// A handle to indicate the current value
const SliderHandle = ({ direction, value, style }: Props) => (
  <div
    className="absolute w-4 h-4 rounded-full"
    style={{
      transform: "scale(1)",
      transition: "transform 0.2s",
      "&:hover": {
        transform: "scale(1.3)",
      },
      ...(direction === Direction.HORIZONTAL
        ? {
            top: 0,
            left: `${value * 100}%`,
            marginTop: -6,
            marginLeft: -8,
          }
        : {
            left: 0,
            bottom: `${value * 100}%`,
            marginBottom: -8,
            marginLeft: -4,
          }),
      ...style,
    }}
  />
);

// A composite progress bar component
const ProgressBar = ({
  isEnabled,
  direction,
  value,
  setCurrent,
  duration,
  playerRef,
  ...props
}: ProgressProps) => (
  <Slider
    direction={direction}
    onChange={(current: number) => {
      playerRef.current?.seekTo(current * Number(duration));
      setCurrent(current * Number(duration));
    }}
    className="w-full"
    style={{
      height: direction === Direction.HORIZONTAL ? 5 : 130,
      borderRadius: 4,
      background: WHITE_SMOKE,
      transition:
        direction === Direction.HORIZONTAL ? "width 0.1s" : "height 0.1s",
      cursor: isEnabled === true ? "pointer" : "default",
    }}
    {...props}
  >
    <SliderBar
      direction={direction}
      value={value}
      style={{ background: isEnabled ? PRIMARY : GRAY }}
    />
    <SliderHandle
      direction={direction}
      value={value}
      style={{ background: isEnabled ? PRIMARY : GRAY }}
    />
  </Slider>
);

const PlayerControls = ({
  isUploaded,
  isPlaying,
  setPlaying,
  playerRef,
  current,
  setCurrent,
  duration,
  onMute,
  setOnMute,
}: ComponentProps) => {
  return (
    <div className="flex flex-col m-4">
      <div className="mb-4">
        <ProgressBar
          isEnabled={isUploaded}
          direction={Direction.HORIZONTAL}
          value={Number(current) / Number(duration)}
          setCurrent={setCurrent}
          playerRef={playerRef}
          duration={duration}
        />
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button
            type="text"
            disabled={!isUploaded}
            onClick={() => {
              playerRef.current?.seekTo(0);
              setCurrent(0);
            }}
          >
            <LeftOutlined className="text-lg" />
          </Button>

          <Button
            type="text"
            disabled={!isUploaded}
            onClick={() => {
              playerRef.current?.seekTo(Number((current as number) - 10));
              setCurrent(Number((current as number) - 10));
            }}
          >
            <DoubleLeftOutlined className="text-lg" />
          </Button>

          <Button
            type="text"
            disabled={!isUploaded}
            onClick={() => setPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <PauseOutlined className="text-lg" />
            ) : (
              <CaretRightFilled className="text-lg" />
            )}
          </Button>

          <Button
            type="text"
            disabled={!isUploaded}
            onClick={() => {
              playerRef.current?.seekTo(Number((current as number) + 10));
              setCurrent(Number((current as number) + 10));
            }}
          >
            <DoubleRightOutlined className="text-lg" />
          </Button>

          <Button
            type="text"
            disabled={!isUploaded}
            onClick={() => {
              playerRef.current?.seekTo(Number((duration as number) - 1));
              setCurrent(Number((duration as number) - 1));
            }}
          >
            <RightOutlined className="text-lg" />
          </Button>

          <Button
            type="text"
            disabled={!isUploaded}
            onClick={() => setOnMute(!onMute)}
          >
            {onMute ? (
              <VolumeOff disabled={!isUploaded} />
            ) : (
              <VolumeUp disabled={!isUploaded} />
            )}
          </Button>
        </div>
        <div>
          {/* current duration */}
          <span className="mr-1">
            {current
              ? format(
                  toDate(
                    new Date(0, 0, 0, 0, 0, 0, (current as number) * 1000)
                  ),
                  "HH:mm:ss.SSS"
                )
              : "00:00:00.000"}
          </span>
          <span>/</span>
          {/* total duration */}
          <span className="ml-1">
            {duration
              ? format(
                  toDate(
                    new Date(0, 0, 0, 0, 0, 0, (duration as number) * 1000)
                  ),
                  "HH:mm:ss.SSS"
                )
              : "00:00:00.000"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;
