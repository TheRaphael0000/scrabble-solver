import { BLANK } from '@scrabble-solver/constants';
import classNames from 'classnames';
import React, { createRef, FunctionComponent, useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { createKeyboardNavigation, zipCharactersAndTiles } from 'lib';
import { selectConfig, selectResultCandidate, selectTiles, tilesSlice, useTranslate, useTypedSelector } from 'state';

import Tile from '../Tile';

import styles from './Tiles.module.scss';

interface Props {
  className?: string;
}

// TODO: Move this
const useTiles = () => {
  const resultCandidate = useTypedSelector(selectResultCandidate);
  const characters = useTypedSelector(selectTiles);
  const tiles = resultCandidate?.tiles || [];

  return zipCharactersAndTiles(characters, tiles).map(({ character, tile }) => ({
    character,
    isCandidate: tile !== null,
  }));
};

const Tiles: FunctionComponent<Props> = ({ className }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const config = useTypedSelector(selectConfig);
  const tiles = useTiles();
  const tilesCount = tiles.length;
  const tilesRefs = useMemo(() => {
    return Array.from({ length: tilesCount }).map(() => createRef<HTMLInputElement>());
  }, [tilesCount]);
  const [activeIndex, setActiveIndex] = useState<number>();

  const handleCharacterChange = (index: number, character: string | null) => {
    dispatch(tilesSlice.actions.changeCharacter({ character, index }));
  };

  const changeActiveIndex = useCallback(
    (offset: number) => {
      const nextActiveIndex = Math.min(Math.max((activeIndex || 0) + offset, 0), tiles.length - 1);
      const tileRef = tilesRefs[nextActiveIndex].current;

      if (tileRef) {
        tileRef.focus();
      }

      setActiveIndex(nextActiveIndex);
    },
    [activeIndex, tiles, tilesRefs],
  );

  const onKeyDown = createKeyboardNavigation({
    onArrowLeft: (event) => {
      event.preventDefault();
      changeActiveIndex(-1);
    },
    onArrowRight: (event) => {
      event.preventDefault();
      changeActiveIndex(1);
    },
    onBackspace: () => {
      changeActiveIndex(-1);
    },
    onKeyDown: (event) => {
      const character = event.key.toLowerCase();

      if (config.hasCharacter(character) || character === BLANK) {
        changeActiveIndex(1);
      }
    },
  });

  return (
    <div className={classNames(styles.tiles, className)}>
      {tiles.map(({ character, isCandidate }, index) => (
        <Tile
          autoFocus={index === 0}
          className={styles.tile}
          // TODO: is this a hack?
          character={character === null ? undefined : character}
          highlighted={isCandidate}
          inputRef={tilesRefs[index]}
          isBlank={character === BLANK}
          key={index}
          placeholder={translate('tiles.placeholder')[index]}
          raised
          size={80} // TODO: unhardcode
          onFocus={() => setActiveIndex(index)}
          onKeyDown={createKeyboardNavigation({
            onBackspace: () => handleCharacterChange(index, null),
            onDelete: () => handleCharacterChange(index, null),
            onKeyDown: (event) => {
              const newCharacter = event.key.toLowerCase();

              if (config.hasCharacter(newCharacter) || newCharacter === BLANK) {
                handleCharacterChange(index, newCharacter);
              }

              onKeyDown(event);
            },
          })}
        />
      ))}
    </div>
  );
};

export default Tiles;
