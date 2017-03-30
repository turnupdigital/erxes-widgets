import gql from 'graphql-tag';
import {
  FORM_TOGGLE,
  CONVERSATION_SENT,
  EMAIL_LOCAL_STORAGE_KEY,
  NEW_CONVERSATION,
  STATUS_CHANGED,
} from './constants';
import client from '../apollo-client';
import { connection } from './connection';

export const toggle = (isVisible) => {
  // notify parent window launcher state
  window.parent.postMessage({
    fromErxes: true,
    isFormVisible: isVisible,
  }, '*');

  return {
    type: FORM_TOGGLE,
  };
};

export const createConversation = doc =>
  dispatch =>
    client.mutate({
      mutation: gql`
        mutation chatCreateConversation(${connection.queryVariables},
          $email: String!, $content: String!) {

          chatCreateConversation(${connection.queryParams}, email: $email, content: $content) {
            _id
          }
        }`,

      variables: {
        ...connection.data,
        ...doc,
      },
    })

    .then(() => {
      // notify as sent
      dispatch({
        type: STATUS_CHANGED,
        status: CONVERSATION_SENT,
      });
    });


export const cacheEmail = email => () =>
  localStorage.setItem(EMAIL_LOCAL_STORAGE_KEY, email);


export const newConversation = () => dispatch =>
  dispatch({
    type: STATUS_CHANGED,
    status: NEW_CONVERSATION,
  });