import React, { FunctionComponent } from 'react';

import { cog, eraser, github, keyboard } from 'icons';
import { useTranslate } from 'state';

import IconButton from '../IconButton';

import styles from './NavButtons.module.scss';

const GITHUB_PROJECT_URL = 'https://github.com/kamilmielnik/scrabble-solver';

interface Props {
  onClear: () => void;
  onShowKeyMap: () => void;
  onShowSettings: () => void;
}

const NavButtons: FunctionComponent<Props> = ({ onClear, onShowKeyMap, onShowSettings }) => {
  const translate = useTranslate();

  return (
    <div className={styles.navButtons}>
      <IconButton
        as="a"
        className={styles.button}
        href={GITHUB_PROJECT_URL}
        icon={github}
        rel="noopener noreferrer"
        target="_blank"
        title={translate('github')}
      />
      <IconButton className={styles.button} icon={keyboard} title={translate('keyMap')} onClick={onShowKeyMap} />

      <div className={styles.separator} />

      <IconButton className={styles.button} icon={eraser} title={translate('clear')} onClick={onClear} />

      <IconButton className={styles.button} icon={cog} title={translate('settings')} onClick={onShowSettings} />
    </div>
  );
};

export default NavButtons;