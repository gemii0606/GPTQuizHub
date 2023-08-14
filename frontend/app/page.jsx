"use client";

import styled from "styled-components";

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: #bf4f74;
`;
const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;

const page = () => {
  return (
    <div>
      <Wrapper>
        <Title>Hello World!</Title>
      </Wrapper>
      <div className="text-3xl font-bold underline">page</div>
    </div>
  );
};

export default page;
