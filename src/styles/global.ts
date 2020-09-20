import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
    -ms-flex: 0 0 auto;
    -webkit-flex: 0 0 auto;
    flex: 0 0 auto;
  }

  body {
    background: #E9EAEB ;
    color: #FFF;
    -webkit-font-smoothing: antialiased
  }

  body, input, button {
    font-family: "Nunito", serif;
    font-size: 14px;
  }

  h1, h2, h3, h4, h5, h6, strong {
    font-weight: 500;
    font-family: "Nunito";
    font-size: 14px;

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
