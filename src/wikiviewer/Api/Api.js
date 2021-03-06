/* @flow */

import { ENDPOINT, PARAMS } from '../Models';
import type { WikiSearchResult, WikiPage } from '../wikiviewer.types';
import { serialize, ResponseError, checkHeaders } from 'common/js/utils';
import { WIKI_PROXY } from 'protected/proxies';

const headers = new Headers({
  'Content-Type': 'text/plain',
});

const search = (query: ?string): Promise<Array<WikiPage>> => {
  PARAMS['gsrsearch'] = query;

  const opts = {
    headers,
    method: 'POST',
    body: serialize(ENDPOINT, PARAMS),
  };

  return fetch(WIKI_PROXY, opts)
    .then(checkHeaders)
    .then(processWikis)
    .catch(message => {
      console.error(message);
      return null;
    });
};

const processWikis = ({ query: { pages } }: WikiSearchResult) => {
  const { limits, ...wikis } = pages;
  return Object.values(wikis);
};

export { search, processWikis };
