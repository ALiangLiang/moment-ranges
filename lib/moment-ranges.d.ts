import * as moment from 'moment';
import { DateRange } from 'moment-range';
import {Moment, unitOfTime} from 'moment';

export class DateRanges {
  constructor(...ranges: DateRange[]);
  constructor(ranges: DateRange[]);

  add(other: DateRange, options?: { adjacent?: boolean }): DateRanges;

  clone(): DateRanges;

  contains(other: Date | DateRange | DateRanges | Moment, options?: { excludeStart?: boolean; excludeEnd?: boolean; }): Boolean;

  diff(unit?: unitOfTime.Diff, precise?: boolean): number;

  duration(unit?: unitOfTime.Diff, precise?: boolean): number;

  intersect(other: DateRange | DateRanges): DateRanges;

  isEqual(other: DateRanges): boolean;

  isSame(other: DateRanges): boolean;

  overlaps(other: DateRange | DateRanges, options?: { adjacent?: boolean; }): Boolean;

  subtract(other: DateRange | DateRanges): DateRange[];

  toDate(): [Date, Date];

  toString(): string;

  valueOf(): number;
}

export interface MomentRangesStaticMethods {
  ranges(...ranges: DateRange[]): DateRanges;
  ranges(ranges: DateRange[]): DateRanges;
}

export interface MomentRanges extends MomentRangesStaticMethods {
  (...args: any[]): MomentRangesStaticMethods & Moment;
}

declare module 'moment' {
  export interface Moment {
    isRanges(range: any): boolean;

    within(range: DateRange): boolean;
  }
}

export function extendMoment(momentClass: typeof moment): MomentRanges & typeof moment;
