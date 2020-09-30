import Prism from 'prismjs';
import cheerio from 'cheerio';
import loadLanguages from 'prismjs/components/';
import { isUndefined } from 'option-t/lib/Undefinable/Undefinable';

interface CodeHighlighterOption {
  code: string;
  language?: string;
}

export function applySyntaxHighlight(body: string): string {
  const $ = cheerio.load(body, { decodeEntities: false, xmlMode: true });

  $('pre code').each((_, elm) => {
    const code = $(elm).text();
    const language = $(elm).attr('class')?.replace('language-', '');
    $(elm).html(addCodeHighlight({ code, language }));
  });

  return $.html();
}

function addCodeHighlight({ code, language }: CodeHighlighterOption): string {
  if (isUndefined(language)) {
    return code;
  }

  loadLanguages([language]);

  try {
    return Prism.highlight(code, Prism.languages[language], language);
  } catch (err) {
    return code;
  }
}
