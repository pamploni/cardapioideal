import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
  background: #06039a;
  height: 56px;
  border-radius: 10px;
  border: 0;
  padding: 0 16px;
  color: #fff;
  width: 100%;
  font-weight: 500;
  margin-top: 16px;
  font-size: 18px;
  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#06039A')};
  }
`;
