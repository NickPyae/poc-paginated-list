export const fetchFromServer = (value, page) => {
  return (dispatch, getState) => {
    dispatch({ type: 'INIT_FETCH' });

    return fetch(apiURL(value, page))
      .then(response => response.json())
      .then((result) => {
        return page === 0 ? dispatch({ type: 'FETCH_FIRST_BATCH', payload: result}) :
          dispatch({ type: 'KEEP_FETCHING', payload: result });
      })
      .catch(err => dispatch({ type: 'FETCH_ERROR'}));
  };
};

const apiURL = (value, page) => `https://hn.algolia.com/api/v1/search?query=${value}&page=${page}&hitsPerPage=100`;
  