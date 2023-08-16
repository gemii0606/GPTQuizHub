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
  border: 1px solid rgb(189, 113, 113);
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
  background-color: rgb(130, 152, 192);
  animation: ${progressAnimation} 1s linear;
`;

function AnimatedProgress({ percentage }) {
  return (
    <div>
      答對率：{percentage}%
      <StyledAnimatedProgress className="animated-progress">
        <ProgressSpan percentage={percentage} />
      </StyledAnimatedProgress>
    </div>
  );
}

export default AnimatedProgress;
