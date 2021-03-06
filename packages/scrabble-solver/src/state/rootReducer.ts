import { combineReducers } from 'redux';

import { boardSlice, dictionarySlice, resultsSlice, settingsSlice, solveSlice, tilesSlice } from './slices';

const rootReducer = combineReducers({
  board: boardSlice.reducer,
  dictionary: dictionarySlice.reducer,
  results: resultsSlice.reducer,
  settings: settingsSlice.reducer,
  solve: solveSlice.reducer,
  tiles: tilesSlice.reducer,
});

export default rootReducer;
