import { Config } from '@scrabble-solver/models';
import classNames from 'classnames';
import fs from 'fs';
import path from 'path';
import React, { FormEventHandler, FunctionComponent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useEffectOnce, useMeasure } from 'react-use';

import { Board, Dictionary, KeyMap, Logo, NavButtons, Results, Settings, Splash, Tiles, Well } from 'components';
import { useLocalStorage } from 'hooks';
import {
  boardSlice,
  dictionarySlice,
  initialize,
  localStorage,
  resultsSlice,
  selectConfig,
  solveSlice,
  tilesSlice,
  useTypedSelector,
} from 'state';

import styles from './index.module.scss';

// TODO: moove to constants?
const MIN_TILE_SIZE = 20;
const MAX_TILE_SIZE = 60;
const SIDEBAR_MARGIN_LEFT = 40; // TODO: unhardcode?
const SPLASH_DURATION = 1000;
const SETTINGS_SPLASH_DELAY = 100;

const INITIAL_SIZE = { height: 0, width: 0 };

const getCellSize = (config: Config, width: number, height: number): number => {
  const cellBorderWidth = 1; // TODO: unhardcode
  const maxWidth = (width - cellBorderWidth) / config.boardWidth - cellBorderWidth;
  const maxHeight = (height - cellBorderWidth) / config.boardHeight - cellBorderWidth;
  const cellSize = Math.min(maxWidth, maxHeight);
  return Math.min(Math.max(cellSize, MIN_TILE_SIZE), MAX_TILE_SIZE);
};

const getVersion = (): string => {
  const packageJsonFilepath = path.resolve(process.cwd(), 'package.json');
  const packageJsonFile = fs.readFileSync(packageJsonFilepath, 'utf-8');
  const packageJson = JSON.parse(packageJsonFile);
  return packageJson.version;
};

interface Props {
  version: string;
}

const Index: FunctionComponent<Props> = ({ version }) => {
  const dispatch = useDispatch();
  const [showKeyMap, setShowKeyMap] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [boardRef, { height: boardHeight }] = useMeasure<HTMLDivElement>();
  const [contentRef, { width: contentWidth }] = useMeasure<HTMLDivElement>();
  const [resultsRef, { height: resultsHeight, width: resultsWidth }] = useMeasure<HTMLDivElement>();
  const config = useTypedSelector(selectConfig);
  const cellSize = getCellSize(config, contentWidth - resultsWidth - SIDEBAR_MARGIN_LEFT, boardHeight);
  const isInitialized =
    contentWidth !== INITIAL_SIZE.width && boardHeight !== INITIAL_SIZE.height && resultsWidth !== INITIAL_SIZE.width;

  const handleClear = () => {
    dispatch(boardSlice.actions.reset());
    dispatch(dictionarySlice.actions.reset());
    dispatch(resultsSlice.actions.reset());
    dispatch(tilesSlice.actions.reset());
  };

  const handleSubmit: FormEventHandler = (event) => {
    event.preventDefault();
    dispatch(solveSlice.actions.submit());
  };

  const handleHideKeyMap = () => setShowKeyMap(false);
  const handleShowKeyMap = () => setShowKeyMap(true);
  const handleHideSettings = () => setShowSettings(false);
  const handleShowSettings = () => setShowSettings(true);

  useLocalStorage();

  useEffectOnce(() => {
    dispatch(initialize());
  });

  useEffectOnce(() => {
    if (!localStorage.getHasVisited()) {
      setTimeout(() => {
        setShowSettings(true);
        localStorage.setHasVisited(true);
      }, SPLASH_DURATION + SETTINGS_SPLASH_DELAY);
    }
  });

  return (
    <>
      <form className={classNames(styles.index, { [styles.initialized]: isInitialized })} onSubmit={handleSubmit}>
        <div className={styles.nav}>
          <div className={styles.logoContainer} title={`scrabble-solver@${version}`}>
            <Logo className={styles.logo} />
          </div>

          <NavButtons onClear={handleClear} onShowKeyMap={handleShowKeyMap} onShowSettings={handleShowSettings} />
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.content} ref={contentRef}>
            <div className={styles.boardContainer} ref={boardRef}>
              {contentWidth > 0 && boardHeight > 0 && <Board cellSize={cellSize} />}
            </div>

            <div className={styles.sidebar}>
              <Well className={styles.results} ref={resultsRef}>
                {resultsWidth > 0 && resultsHeight > 0 && <Results height={resultsHeight} width={resultsWidth} />}
              </Well>

              <Well className={styles.dictionary}>
                <Dictionary />
              </Well>
            </div>
          </div>
        </div>

        <div className={styles.tilesContainer}>
          <Tiles className={styles.tiles} />
        </div>
      </form>

      <Settings hidden={!showSettings} onClose={handleHideSettings} />

      <KeyMap hidden={!showKeyMap} onClose={handleHideKeyMap} />

      <Splash forceShow={!isInitialized} />
    </>
  );
};

export const getStaticProps = async () => {
  const props: Props = {
    version: getVersion(),
  };

  return { props };
};

export default Index;
