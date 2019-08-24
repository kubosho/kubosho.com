import React from 'react';
import Document, { Main, NextScript, Head, DocumentInitialProps } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import { GA_TRACKING_ID, SITE_TITLE } from '../constants';

type Props = {
  isProduction: boolean;
} & DocumentInitialProps;

export default class MyDocument extends Document<Props> {
  static async getInitialProps(ctx): Promise<Props> {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    const isProduction = process.env.NODE_ENV === 'production';

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        isProduction,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render(): JSX.Element {
    const { isProduction } = this.props;
    return (
      <html lang="ja">
        <Head>
          <meta itemProp="name" content={SITE_TITLE} />
          <meta property="og:site_name" content={SITE_TITLE} />
          <meta property="og:type" content="blog" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@kubosho_" />
          <script
            async
            defer
            crossOrigin="anonymous"
            src="https://connect.facebook.net/ja_JP/sdk.js#xfbml=1&version=v4.0"
          />
          <script async defer src="https://platform.twitter.com/widgets.js" />
        </Head>
        <body>
          {isProduction && (
            <>
              <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
              <script dangerouslySetInnerHTML={setGATag()} />
            </>
          )}
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

function setGATag(): {
  __html: string;
} {
  return {
    __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', ${GA_TRACKING_ID});
      `,
  };
}
