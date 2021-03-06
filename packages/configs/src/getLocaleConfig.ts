import { Config } from '@scrabble-solver/models';

import getConfig from './getConfig';

const getLocaleConfig = (configId: string, locale: 'en-GB' | 'en-US' | 'pl-PL' | 'fr-FR'): Config => {
  return getConfig(configId)[locale];
};

export default getLocaleConfig;
