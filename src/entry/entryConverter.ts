import { readFile as legacyReadFile, readdir as legacyReaddir, stat as legacyStat } from 'fs';
import path from 'path';
import { promisify } from 'util';
import fm from 'front-matter';
import marked from 'marked';
import sanitizeHtml from 'sanitize-html';
import { EntryFileAttributes, EntryValueParameter, MarkdownFileData } from './entryValue';

const MARKDOWN_FILE_REGEXP = /.*\.md$/;

const readFile = promisify(legacyReadFile);
const readdir = promisify(legacyReaddir);
const stat = promisify(legacyStat);

export async function retrieveMarkdownFiles(dirpath: string, fileList?: Array<string>): Promise<Array<string>> {
  const mdFileList = fileList ?? [];

  const dirents = await readdir(dirpath, { withFileTypes: true });

  for (const dirent of dirents) {
    const fp = path.join(dirpath, dirent.name);

    if (dirent.isDirectory()) {
      await retrieveMarkdownFiles(fp, mdFileList);
    } else if (MARKDOWN_FILE_REGEXP.test(dirent.name)) {
      mdFileList.push(fp);
    }
  }

  return mdFileList;
}

export async function readMarkdownFileData(filepath: string): Promise<MarkdownFileData> {
  const { name } = path.parse(filepath);

  const fileContents = await readFile(filepath, 'utf8');
  const fileStatus = await stat(filepath);

  const { attributes, body } = fm<EntryFileAttributes>(fileContents);
  const { birthtime, ctime } = fileStatus;
  const { title, publishedAt, tags } = attributes;

  const birthtimeDate = new Date(birthtime);
  const ctimeDate = new Date(ctime);
  const publishedAtDate = new Date(publishedAt);

  return {
    filename: name,
    title,
    body,
    tags,
    publishedAt: publishedAtDate.toISOString(),
    birthtime: birthtimeDate.toISOString(),
    ctime: ctimeDate.toISOString(),
  };
}

export function mapEntryValueParameter(contents: MarkdownFileData): EntryValueParameter {
  const { filename, title, body: originalBody, tags, birthtime, ctime, publishedAt } = contents;
  const body = marked(originalBody);
  const excerpt = createExcerptText(originalBody);

  const tagList = tags?.split(',').map((tag) => tag.trim()) ?? [];

  const r: EntryValueParameter = {
    id: filename,
    title,
    body,
    excerpt,
    tags: tagList,
    createdAt: birthtime,
    updatedAt: ctime,
    publishedAt,
  };

  return r;
}

function createExcerptText(contents: string): string {
  const excerpt = marked(contents.split('\n')[0]);

  const sanitizeExcerpt = sanitizeHtml(excerpt, {
    allowedTags: [],
    allowedAttributes: {},
  });

  return sanitizeExcerpt;
}