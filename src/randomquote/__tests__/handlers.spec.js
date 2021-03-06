/* @flow */
import { fetchQuoteHandler } from '../Handlers';
import { dispatch } from 'tests/utils';
import * as Api from '../Api';

jest.mock('../Api', () => {
  const module = {};

  module.fetchQuote = jest.fn(() => ({
    error: false,
    quote: 'a',
    author: 'b',
  }));
  module.createLink = jest.fn(() => 'stub');

  return module;
});

describe('RandomQuote Handlers', () => {
  beforeEach(() => {
    ((document.body: any): HTMLElement).innerHTML = require('../index.pug');
  });

  it('fetchQuoteHandler should fill in quote, author, and twitter link', async () => {
    const container = ((document.querySelector('#quotebox'): any): HTMLElement);
    const tweet = ((document.querySelector('.tweet'): any): HTMLAnchorElement);
    const ev = (({}: any): Event);
    await fetchQuoteHandler(container, tweet)(ev);
    expect(container.children[0].textContent).toBe('a');
    expect(container.children[1].textContent).toBe('b');
    expect(tweet.href).toBe('stub');
  });
});
