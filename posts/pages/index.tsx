import React from 'react';
import Link from 'next/link';
import { isNotNull } from 'option-t/lib/Nullable/Nullable';

import entries from '../data/entries.json';

const TopPage = (): JSX.Element => (
  <React.Fragment>
    <h2 className="p-top-articles-title">最近の記事</h2>

    {isNotNull(entries) ? (
      entries.map(entry => {
        const { excerpt, id, slug, title } = entry;

        return (
          <section className="p-top-article" key={id}>
            <h1 className="p-top-article__title">
              <Link href="/entry/[slug]" as={`/entry/${slug}`}>
                {title}
              </Link>
            </h1>
            <p dangerouslySetInnerHTML={{ __html: excerpt }} />
          </section>
        );
      })
    ) : (
      <p>記事はありません。</p>
    )}
  </React.Fragment>
);

export default TopPage;
