import { IOptions } from '../interface/options';
import { optimizeTemplateHTML } from '../lib/utlis';

import grid from './grid';

const days = (options: IOptions): string => {
  let gridNode = '';

  for (let i = 0; i < options.grid; i++) {
    gridNode += grid(options);
  }

  return optimizeTemplateHTML(`
    <div class="datepick-days${options.daysClass ? ` ${options.daysClass}` : ''}">
      ${gridNode}
    </div>
  `);
};

export default days;
