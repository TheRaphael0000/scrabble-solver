import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { play } from 'icons';
import {
  selectAreResultsOutdated,
  selectIsLoading,
  selectTiles,
  solveSlice,
  useTranslate,
  useTypedSelector,
} from 'state';

import Button from '../Button';

import styles from './Results.module.scss';

const SolveButton: FunctionComponent = () => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const isLoading = useTypedSelector(selectIsLoading);
  const tiles = useTypedSelector(selectTiles);
  const isOutdated = useTypedSelector(selectAreResultsOutdated);
  const hasTiles = tiles.some((tile) => tile !== null);

  const handleRefresh = () => {
    dispatch(solveSlice.actions.submit());
  };

  return (
    <Button
      className={styles.outdatedButton}
      disabled={isLoading || !isOutdated || !hasTiles}
      icon={play}
      title={translate('results.solve')}
      type="submit"
      onClick={handleRefresh}
    >
      {translate('results.solve')}
    </Button>
  );
};

export default SolveButton;
