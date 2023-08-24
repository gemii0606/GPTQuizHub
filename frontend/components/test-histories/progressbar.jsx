import React from "react";
import styled, { keyframes } from "styled-components";

const progressAnimation = keyframes`
  from {
    width: 0;
  }
`;

const StyledAnimatedProgress = styled.div`
  width: 200px;
  height: 30px;
  border-radius: 5px;
  margin: 20px 10px;
  border: 2px solid rgb(203 213 225);
  overflow: hidden;
  position: relative;
`;

const ProgressSpan = styled.span`
  height: 100%;
  display: block;
  width: ${(props) => props.percentage}%;
  color: rgb(255, 251, 251);
  line-height: 30px;
  position: absolute;
  text-align: end;
  padding-right: 5px;
  background-color: #84C1FF;
  animation: ${progressAnimation} 1s linear;
`;
function AnimatedProgress({ percentage }) {
  return (
    <div>
      <div className="flex">
        <p className="w-24">答對率：{percentage.toFixed(2)}%</p>
      </div>
      <StyledAnimatedProgress className="animated-progress">
        <ProgressSpan percentage={percentage} />
      </StyledAnimatedProgress>
    </div>
  );
}

export default AnimatedProgress;
