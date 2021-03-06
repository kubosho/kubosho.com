import path from 'path';
import { promises } from 'fs';
import { isUndefined } from 'option-t/lib/Undefinable/Undefinable';
import fm from 'front-matter';
import unified from 'unified';
import gfm from 'remark-gfm';
import markdown from 'remark-parse';
import stringify from 'remark-stringify';
import breaks from 'remark-breaks';
import strip from 'strip-markdown';
import remarkToRehype from 'remark-rehype';
import html from 'rehype-stringify';
import lazyLoadPlugin from 'rehype-plugin-image-native-lazy-loading';
import resolveLayoutShiftPlugin from 'rehype-plugin-auto-resolve-layout-shift';
import rehypePrism from '@mapbox/rehype-prism';

import { EntryFileAttributes, EntryValue, MarkdownFileData } from './entryValue';

const MARKDOWN_FILE_REGEXP = /.*\.md$/;

const { readdir, readFile } = promises;

export async function getMarkdownFileNameList(dirpath: string, fileList?: Array<string>): Promise<Array<string>> {
  const fileNameList = fileList ?? [];
  const dirents = await readdir(dirpath, { withFileTypes: true });

  for (const dirent of dirents) {
    const fileName = path.join(dirpath, dirent.name);

    if (dirent.isDirectory()) {
      await getMarkdownFileNameList(fileName, fileNameList);
    } else if (MARKDOWN_FILE_REGEXP.test(dirent.name)) {
      fileNameList.push(fileName);
    }
  }

  return fileNameList;
}

export async function readMarkdownFileData(filepath: string): Promise<MarkdownFileData> {
  const { name } = path.parse(filepath);

  const fileContents = await readFile(filepath, 'utf8');

  const { attributes, body } = fm<EntryFileAttributes>(fileContents);
  const { title, created_at, updated_at, categories, tags } = attributes;

  const markDownFileData = {
    filename: name,
    title,
    body,
    categories,
    tags,
  };

  if (isUndefined(created_at)) {
    return markDownFileData;
  }

  const publishedAt = new Date(created_at);

  if (isUndefined(updated_at)) {
    return {
      ...markDownFileData,
      ...{ created_at: publishedAt.toISOString(), updated_at: publishedAt.toISOString() },
    };
  }

  const updatedAt = new Date(updated_at);

  return {
    ...markDownFileData,
    ...{ created_at: publishedAt.toISOString(), updated_at: updatedAt.toISOString() },
  };
}

export async function mapEntryValue(contents: MarkdownFileData): Promise<EntryValue> {
  const {
    filename,
    title,
    body: originalBody,
    categories,
    tags,
    created_at: createdAt,
    updated_at: updatedAt,
  } = contents;

  const markdownProcessor = (): unified.Processor<unified.Settings> => unified().use(markdown).use(gfm);
  const contentsProcessor = markdownProcessor()
    .use(breaks)
    .use(remarkToRehype, { allowDangerousHtml: true })
    .use(lazyLoadPlugin)
    .use(resolveLayoutShiftPlugin, { type: 'maxWidth', maxWidth: 800 })
    .use(rehypePrism, { ignoreMissing: true })
    .use(html, { allowDangerousHtml: true });
  const excerptProcessor = markdownProcessor().use(strip).use(stringify);

  const body = await contentsProcessor.process(originalBody);
  const excerpt = await excerptProcessor.process({ contents: originalBody.split('\n')[0] });

  const categoryList = categories?.split(',').map((category) => category.trim()) ?? [];
  const tagList = tags?.split(',').map((tag) => tag.trim()) ?? [];

  return new EntryValue({
    id: filename,
    title,
    body: body.contents.toString(),
    excerpt: excerpt.contents.toString().trim(),
    categories: categoryList,
    tags: tagList,
    createdAt,
    updatedAt,
  });
}
