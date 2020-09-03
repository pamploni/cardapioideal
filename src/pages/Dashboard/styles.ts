import styled, { keyframes } from 'styled-components';

import { shade } from 'polished';
import signUpImg from '../../assets/signupimg.png';

export const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Header = styled.div`
  background-color: #06039a;
  height: 100px;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  img {
    width: 40px;
    height: 60px;
    resize: contain;
    margin-bottom: 12px;
    margin-left: 24px;
  }

  span {
    text-align: center;
    font-size: 16px;
  }

  #user-content {
    display: flex;
    flex: 1;
    flex-direction: row;
    margin-left: 64px;

    #user-avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border-color: #ff1;
      border-width: 3px;
      border-style: solid;
      margin-right: 16px;
    }

    #user-data {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;

      #user-name {
        font-family: 'Roboto';
        font-weight: 700;
        font-size: 16px;
        font-style: normal;
      }

      #user-email {
        font-family: 'Roboto';
        font-weight: 500;
        font-size: 14px;
        font-style: italic;
      }
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  max-width: 700px;
  align-items: center;
`;

const appearFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0px);
  }
`;

export const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  animation: ${appearFromRight} 1s;

  aside {
    width: 30%;
    padding-left: 15px;
    margin-left: 15px;
    float: right;
    font-style: italic;
    background-color: lightgray;
  }

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 24px;
      font-size: 20px;
      color: #06039a;
    }

    a {
      color: #f4ede8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.2, '#f4ede8')};
      }
    }
  }

  > a {
    color: #ff9000;
    display: block;
    margin-top: 24px;
    text-decoration: none;
    transition: color 0.2s;

    display: flex;
    align-items: center;

    svg {
      margin-right: 16px;
    }

    &:hover {
      color: ${shade(0.2, '#ff9000')};
    }
  }
`;

export const Background = styled.div`
  flex: 1;
  background: url(${signUpImg}) no-repeat center;
  background-size: cover;
`;

export const AvatarInput = styled.div`
  margin-top: 0px;
  margin-bottom: 16px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;

  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  label {
    position: absolute;
    width: 48px;
    height: 48px;
    background: #ff9000;
    border-radius: 50%;
    border: 0;
    right: 0;
    bottom: 0;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 30%;

    input {
      display: none;
    }

    svg {
      width: 20px;
      height: 20px;
      color: #312e38;
    }

    &:hover {
      background: ${shade(0.2, '#ff9000')};
    }
  }
`;
