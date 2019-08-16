import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
import { createGlobalStyle } from 'styled-components';
import { BACKGROUND_COLOR, TEXT_COLOR } from '../common_styles/color';
import { BASE_FONT_SIZE, LINE_HEIGHT } from '../common_styles/text';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${BACKGROUND_COLOR};
    color: ${TEXT_COLOR};
    font-size: ${BASE_FONT_SIZE};
    line-height: ${LINE_HEIGHT};
  }
`;

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Head>
          <link rel="stylesheet" href="/static/styles/foundation.css" />
        </Head>
        <GlobalStyle />
        <Component {...pageProps} />
      </Container>
    );
  }
}
