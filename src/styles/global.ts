import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  body {
    background: #E9EAEB ;
    color: #FFF;
    -webkit-font-smoothing: antialiased
  }

  body, input, button {
    font-family: "Roboto", serif;
    font-size: 14px;
  }

  h1, h2, h3, h4, h5, h6, strong {
    font-weight: 500;

  }

  span {
    font-family: "Roboto", serif;
    font-size: 12px;
    color: #FFF;
  }

  button {
    cursor: pointer;
  }
`;
