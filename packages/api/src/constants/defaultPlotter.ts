import defaultsForPlotter from '../utils/defaultsForPlotter';
import optionsForPlotter from '../utils/optionsForPlotter';

import PlotterName from './PlotterName';

export default {
  displayName: 'Gold Proof of Space',
  options: optionsForPlotter(PlotterName.GOLDPOS),
  defaults: defaultsForPlotter(PlotterName.GOLDPOS),
  installInfo: { installed: true },
};
