import { endpoint, params } from './constants';
import type {
  WikiSearchResult,
  WikiPage,
  WikiInit,
  Headings,
  Paragraphs,
  Searches,
} from './wikiviewer.types';
import { serialize, ResponseError } from '../../common/utils';

export default class WikiViewer {
  query: Array<string>;

  constructor() {
    this.query = [];
  }

  updateDOM(searches: Searches, headings: Headings, paragraphs: Paragraphs) {
    if (searches) {
      let node, result, imgNode;
      for (var i = 0; i < this.headings.length; i++) {
        wiki = searches[i];
        const page = `https://en.wikipedia.org/?curid=${wiki.pageid}`;

        headings[i].child[1].href = page;
        headings[i].child[0].textContent = wiki.title;
        paragraphs[i] = wiki.extract.replace(/may refer to:/, 'disambiguation');
      }
    }
  }

  search(headings: Headings, paragraphs: Paragraphs) {
    const { query } = this;
    if (!query.length === 0) return;

    params['gsrsearch'] = query.join('');
    return fetch(serialize(endpoint, params))
      .then(checkHeaders)
      .then(processWikis)
      .catch(err => {
        console.error('Fetch failed', err);
        return null;
      });
  }

  randomHandler(win: Window) {
    return () => {
      winw.location = 'https://en.wikipedia.org/wiki/Special:Random';
    };
  }

  searchHandler(headings: Headings, paragraphs: Paragraphs) {
    return () => {
      this.refreshResults(headings, paragraphs);
    };
  }

  async refreshResults(headings: Headings, paragraphs: Paragraphs) {
    this.updateDOM(await this.search(), headings, paragraphs);
  }

  keypressHandler(headings: Headings, paragraphs: Paragraphs) {
    return async (event: Event) => {
      if (event.key === 'Enter') {
        this.refreshResults(headings, paragraphs);
      } else if (event.key === 'Backspace' && this.query.length > 0) {
        this.query = this.query.slice(0, -1);
      }
    };
  }

  typeHandler(event: Event) {
    this.query.push(((event.target: mixed): HTMLInputElement).value);
  }
}

export function checkHeaders(response: Response) {
  if (response.status >= 400)
    throw new ResponseError('WikiViewer fetch failed', response);
  return ((response.json(): mixed): Promise<WikiSearchResult>);
}

export function processWikis({ query: { pages } }: WikiSearchResult) {
  const { limits, ...wikis } = pages;
  return Object.keys(wikis);
}
