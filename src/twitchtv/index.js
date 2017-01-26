/* @flow */

import { 
  serialize, 
  // dateString, 
  // appendSuffix, 
  ResponseError,
} from '../common/utils';
import { TWITCH_TV_API_KEY, } from '../common/api_keys';
import { User } from './twitchtv.types';
import { users, streamsUrl, channelUrl } from './constants';

/* Objective: Build a CodePen.io app that is functionally similar to this: 
 * https://codepen.io/FreeCodeCamp/full/Myvqmo/.
 * 
 * Fulfill the below user stories. Use whichever libraries or APIs you need. 
 * Give it your own personal style.
 * 
 * User Story: I can see whether Free Code Camp is currently streaming on 
 * Twitch.tv.
 * 
 * User Story: I can click the status output and be sent directly to the 
 * Free Code Camp's Twitch.tv channel.
 * 
 * User Story: if a Twitch user is currently streaming, I can see additional 
 * details about what they are streaming.
 * 
 * User Story: I will see a placeholder notification if a streamer has closed 
 * their Twitch account (or the account never existed). You can verify this 
 * works by adding brunofin and comster404 to your array of Twitch streamers.
 */

const headers = new Headers({ 
  'Accept': 'application/vnd.twitchtv.v3+json',
  'Client-ID': TWITCH_TV_API_KEY,
})

const options = { headers, method: 'GET', mode: 'cors', }

/* Network calls
 */

const userVerificationFetch = (user: string): userChallegeResponse => {
  const endpoint = channelUrl + user

  return fetch(new Request(endpoint, options))
    .then(/*#TODO: write res process logic */)
};

const handleNullStream = async (res: Response): User => {
  //If stream is null this could either be due to:
  //a nonexistent user || an offline user
  //additional call to channel route is needed
  const user = '' //#TODO: Scaffolding
  const userState = await userVerificationFetch(user)

  userState.hasOwnProperty('status') && userState.status == 404
    ? return convertToNonExistentUser(response)
    : return convertToOfflineUser(response)
};

/**
 * Accepts the Response object from fetch, classifies response and returns
 * a User object
 * @param  {[type]} response: Response      [description]
 * @return {[type]}           [description]
 */
export const classifyResponse = (response: Response): User => {
  /* Needs to understand the various failures that can happen during fetch
   * and how to return a normalized obj(s) w/ null where applicable
   * 4 states:
   * user nonexistent, null stream
   * user offline, null stream
   * user online, stream object
   * streams object
   */

  if (response.hasOwnProperty('streams')) {
    return convertToUserArray(response)
  } else {
    response.stream
      ? return convertToUser(response)
      : return handleNullStream(response)
  }
 };

/**
 * fetchUserProfile calls twitchtv api, returns normalized user object
 * @type {Function}
 */
const fetchUserProfile = (user: string): Promise<User> => {
  const endpoint = streamsUrl + user

  return fetch(new Request(endpoint, options))
    .then(classifyResponse)
};

/**
 * fetchAllProfiles returns an array of promised normalized user objects
 * @type {Function}
 */
const fetchAllProfiles = (users: Array<string>): Promise<Array<User>> => {
  return Promise.all(...users.map(fetchUserProfile))
    .then(agglomerate)
};

const contentLoadedListener = async (): void => {
  const profiles = await fetchAllProfiles(user)
};

/* Start
 */
document.addEventListener('DOMContentLoaded', contentLoadedListener);


/* Helper Functions
 */
const agglomerate<T> = (userResponses: T): Array<User>  => {
  const accumulator = (curr, all) => {
    switch (typeof curr) {
      case 'Array':
        return all.concat(curr)
      default:
        all.push(curr)
    }
  }

  return (userResponses.reduce(accumulator, []): any): Array<User>)
};

const convertToUser = (res: Response): User => ();
const convertToUserArray = (res: Response): Array<User> => ();
const convertToNonExistentUser = (res: Response): User => ();
const convertToOfflineUser = (res: Response): User => ();
