import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { formatTime } from "../../util/util";

function TimeRangeSlider({timeRange, handleSliderChange}) {

  return (
    <div>
      <Slider
        min={10}
        max={48}
        range
        value={timeRange}
        onChange={handleSliderChange}
      />
      <div className="">
        <span>{formatTime(timeRange[0])}</span>
        &nbsp;-&nbsp;
        <span>{formatTime(timeRange[1])}</span>
      </div>
    </div>
  );
};

export default TimeRangeSlider;
