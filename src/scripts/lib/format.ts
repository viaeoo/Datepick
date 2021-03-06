import { getTime, today } from './date';

import { ILocale } from '../interface/locale';

const reFormatTokens = /dd?|DD?|mm?|MM?|yy?(?:yy)?/;
const reNonDateParts = /[\s!-/:-@[-`{-~年月日]+/;
const knownFormats = {};

const parseFns = {
  y (date: Date|number, year: number) {
    return new Date(date).setFullYear(year);
  },

  M: undefined,

  m (date: Date|number, month: number) {
    const newDate = new Date(date);
    const monthIndex = month - 1;

    newDate.setMonth(monthIndex);

    return newDate.getMonth() !== normalizeMonth(monthIndex)
      ? newDate.setDate(0)
      : newDate.getTime();
  },

  d (date: Date|number, day: number) {
    return new Date(date).setDate(day);
  },
};

parseFns.M = parseFns.m;

const formatFns = {
  d (date: Date) {
    return date.getDate();
  },
  dd (date: Date) {
    return padZero(date.getDate(), 2);
  },
  D (date: Date, locale: any) {
    return locale.daysShort[date.getDay()];
  },
  DD (date: Date, locale: any) {
    return locale.days[date.getDay()];
  },
  m (date: Date) {
    return date.getMonth() + 1;
  },
  mm (date: Date) {
    return padZero(date.getMonth() + 1, 2);
  },
  M (date: Date, locale: any) {
    return locale.monthsShort[date.getMonth()];
  },
  MM (date: Date, locale: any) {
    return locale.months[date.getMonth()];
  },
  y (date: Date) {
    return date.getFullYear();
  },
  yy (date: Date) {
    return padZero(date.getFullYear(), 2).slice(-2);
  },
  yyyy (date: Date) {
    return padZero(date.getFullYear(), 4);
  },
};

function padZero (num: number, length: number): string {
  return num.toString().padStart(length, '0');
}

function normalizeMonth (monthIndex: number): any {
  return monthIndex > -1
    ? monthIndex % 12 :
    normalizeMonth(monthIndex + 12);
}

function parseFormatString (format: string): any {
  if (typeof format !== 'string') {
    throw new Error('Invalid date format.');
  }

  if (format in knownFormats) {
    return knownFormats[format];
  }

  const separators = format.split(reFormatTokens);
  const parts = format.match(new RegExp(reFormatTokens, 'g'));

  if (separators.length === 0 || !parts) {
    throw new Error('Invalid date format.');
  }

  const partFormatters = parts.map((token) => {
    return formatFns[token];
  });

  const partParsers = Object.keys(parseFns).reduce((parsers, key) => {
    const token = parts.find(part => part[0] === key);

    if (!token) {
      return parsers;
    }

    parsers[key] = parseFns[key];

    return parsers;
  }, {});

  const partParserKeys = Object.keys(partParsers);

  return knownFormats[format] = {
    parser (dateStr: string, locale: ILocale): Date|number {
      const dateParts = dateStr.split(reNonDateParts).reduce((dtParts, part, index) => {
        if (part.length > 0 && parts[index]) {
          const token = parts[index][0];

          if (parseFns[token] !== undefined) {
            dtParts[token] = part;
          }
        }

        return dtParts;
      }, {});

      return partParserKeys.reduce((origDate, key) => {
        const newDate = partParsers[key](origDate, dateParts[key], locale);

        return isNaN(newDate) ? origDate : newDate;
      }, today());
    },

    formatter (date: Date|number, locale: ILocale): string {
      let dateStr = partFormatters.reduce((str, fn, index) => {
        return str += `${separators[index]}${fn(date, locale)}`;
      }, '');

      return dateStr += separators[separators.length - 1];
    },
  };
}

export function parseDate (date: Date|number, locale: ILocale): Date|number {
  if (
    date instanceof Date
    || typeof date === 'number'
  ) {
    return getTime(date);
  }

  if (!date) {
    return undefined;
  }

  if (date === 'today') {
    return today();
  }

  return parseFormatString(locale.format).parser(date, locale);
}

export function formatDate (date: Date|number, format: string, locale: ILocale): string {
  if (!date && date !== 0) {
    return null;
  }

  const dateObj = typeof date === 'number'
    ? new Date(date)
    : date;

  return parseFormatString(format).formatter(dateObj, locale);
}
