import React from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import Link from 'next/link';
import { isNotNull } from 'option-t/lib/Nullable/Nullable';

import { SITE_TITLE } from '../constants';
import { CONTENTS_SEPARATOR_SPACE } from '../common_styles/space';
import { SITE_WIDTH } from '../common_styles/size';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import entries from '../data/entries.json';

const SiteContents = styled.main`
  max-width: ${SITE_WIDTH};
  margin: ${CONTENTS_SEPARATOR_SPACE} auto 0;
`;
const ArticlesTitle = styled.h2``;
const Article = styled.article``;
const EntryTitle = styled.h3``;
const Contents = styled.p``;
const NotFound = styled.p``;

const TopPage = (): JSX.Element => (
  <React.Fragment>
    <Head>
      <title>{SITE_TITLE}</title>
    </Head>
    <SiteHeader />
    <SiteContents>
      <ArticlesTitle>最近の記事</ArticlesTitle>
      {isNotNull(entries) ? (
        entries.map(entry => {
          const { excerpt, id, slug, title } = entry;

          return (
            <Article key={id}>
              <EntryTitle>
                <Link href="/entry/[slug]" as={`/entry/${slug}`}>
                  <a>{title}</a>
                </Link>
              </EntryTitle>
              <Contents dangerouslySetInnerHTML={{ __html: excerpt }} />
            </Article>
          );
        })
      ) : (
        <NotFound>記事はありません。</NotFound>
      )}
    </SiteContents>
    <SiteFooter />
  </React.Fragment>
);

export default TopPage;
