export const INITIAL_STATE = {
  hits: [],
  page: null,
  isLoading: false,
  isError: false
};

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
      case 'INIT_FETCH':
        return { ...state, isLoading: true };
      case 'FETCH_FIRST_BATCH':
        return { ...state, isLoading: false, hits: action.payload.hits, page: action.payload.page };
      case 'KEEP_FETCHING':
        return { ...state, hits: [...state.hits, ...action.payload.hits], page: action.payload.page, isLoading: false };
      case 'FETCH_ERROR':
        return { ...state, isError: true, isLoading: false };
      default:
        return state;
    }
}
  