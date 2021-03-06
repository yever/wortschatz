import {readFileSync} from 'fs';

export type Datum = {
  page: number;
  marked: number;
  total: number;
};

const PATTERN = /^(\d+)\s+(\d+)\s+(\d+)/;

export const readData = (filename: string): Datum[] =>
  readFileSync(filename, 'utf8')
    .split('\n')
    .map(line => PATTERN.exec(line))
    .filter(match => match)
    .map(match => {
      if (!match) throw new Error('should not happen');
      const [_, page, marked, total] = match.map(s => +s);
      return {page, marked, total};
    });

export const isDataValid = (data: Datum[]): boolean => {
  if (data.length === 0) {
    console.error('No data!');
    return false;
  }

  const pages: number[] = [];

  for (const datum of data) {
    if (Object.keys(datum).length !== 3) {
      console.error('Wrong number of keys!');
      return false;
    }
  
    if (!('page' in datum) || !Number.isInteger(datum.page) || (datum.page < 0)) {
      console.error(`Value of 'page': ${datum.page} is invalid`);
      return false;
    }
      
    if (!('marked' in datum) || !Number.isInteger(datum.marked) || (datum.marked < 0)) {
      console.error(`Value of 'marked': ${datum.marked} is invalid`);
      return false;
    }

    if (!('total' in datum) || !Number.isInteger(datum.total) || (datum.total < 1)) {
      console.error(`Value of 'total': ${datum.total} is invalid`);
      return false;
    }

    if (pages.some(p => p === datum.page)) {
      console.error(`Page ${datum.page} already exists`);
      return false;
    }

    pages.push(datum.page);
  }

  return true;
};
