import React from 'react';
import { GetStaticPropsContext } from 'next';
import Head from 'next/head';

import { EntryValue } from '../../entry/entryValue';
import { EntryList } from '../../components/EntryList';
import { SiteContents } from '../../components/SiteContents';
import { addSiteTitleToSuffix } from '../../site_title_inserter';
import { SITE_TITLE, SITE_URL } from '../../constants/site_data';
import { getEntryListByTag, getTagIdList } from '../../entry/entryGateway';

interface Props {
  filteredEntries: Array<EntryValue>;
  tag: string;
}

export const TagPage = (props: Props): JSX.Element => {
  const { tag, filteredEntries } = props;
  const title = `${tag}の記事一覧`;
  const titleInHead = addSiteTitleToSuffix(title);
  const description = `${SITE_TITLE}の「${tag}」に関連した記事の一覧です。`;
  const pageUrl = `${SITE_URL}/tags/${tag}`;

  const e = (
    <>
      <Head>
        <title>{titleInHead}</title>
        <meta property="og:title" content={titleInHead} />
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
      </Head>
      <SiteContents>
        <EntryList title={title} entries={filteredEntries} />
      </SiteContents>
    </>
  );

  return e;
};

export async function getStaticPaths(): Promise<{
  paths: { params: { [tag: string]: string } }[];
  fallback: boolean;
}> {
  const tagIdList = await getTagIdList();
  const paths = tagIdList.map((tag) => ({
    params: { tag },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: GetStaticPropsContext): Promise<{ props: Props }> {
  const tag = Array.isArray(params.tag) ? params.tag.join() : params.tag;
  const filteredEntries = await getEntryListByTag(tag);

  return {
    props: {
      filteredEntries,
      tag,
    },
  };
}

export default TagPage;
