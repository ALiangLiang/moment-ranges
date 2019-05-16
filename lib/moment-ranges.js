import moment from 'moment';
import absFloor from 'moment/src/lib/utils/abs-floor';
import mergeRanges from 'merge-ranges';
import { DateRange } from 'moment-range';


//-----------------------------------------------------------------------------
// Date Ranges
//-----------------------------------------------------------------------------

export class DateRanges extends Array {
  constructor(...ranges) {
    ranges = flattenDeep(ranges).filter((range) => (range instanceof DateRange));
    const mergedRanges = mergeAndSortDateRanges(ranges);

    super(...mergedRanges);
  }

  add(other) {
    const ranges = this;

    ranges.push(other);

    return mergeDateRanges(ranges);
  }

  clone() {
    return new this.constructor(...this);
  }

  contains(other, options) {
    return (other instanceof DateRanges)
      ? other.every((range) => this.contains(range, options))
      : !!this.filter((range) => range.contains(other, options)).length;
  }

  diff(unit, precise) {
    const output = this.reduce((range, sum) => sum + (range.end.diff(range.start, unit, true)), 0);

    return precise ? output : absFloor(output);
  }

  duration(unit, precise) {
    return this.diff(unit, precise);
  }

  intersect(other) {
    const intersectRanges = this.map((range) => other.intersect(range))
      .filter((intersectRange) => !intersectRange);

    return new this.constructor(intersectRanges);
  }

  isEqual(other) {
    const ranges = this;
    const oRanges = other;

    return !ranges.find(
      (range) => !oRanges.find((oRange) => range.isEqual(oRange))
    );
  }

  isSame(other) {
    return this.isEqual(other);
  }

  overlaps(other, options = { adjacent: false }) {
    return (other instanceof DateRanges)
      ? !!this.filter((range) => other.overlaps(range, options)).length
      : !!this.filter((range) => range.overlaps(other, options)).length;
  }

  subtract(other) {
    return flatten(this.map((range) => other.subtract(range)));
  }

  toDate() {
    return this.map((range) => [range.start.toDate(), range.end.toDate()]);
  }

  toString() {
    return this.map((range) => range.start.format() + '/' + range.end.format()).toString();
  }

  valueOf() {
    return this.reduce((range, sum) => sum + (range.end.valueOf() - range.start.valueOf()), 0);
  }
}


//-----------------------------------------------------------------------------
// Moment Extensions
//-----------------------------------------------------------------------------

export function extendMoment(moment) {
  /**
   * Check if the moment-range extended first.
   */
  if (!moment.range || !(moment.range.constructor === DateRange)) {
    throw new Error('You need to extend moment-range first.');
  }

  /**
   * Build a date-ranges.
   */
  moment.ranges = function ranges(...ranges) {
    return new DateRanges(...ranges);
  };

  /**
   * Alias of static constructor.
   */
  moment.fn.ranges = moment.ranges;

  /**
   * Expose constructor
   */
  moment.ranges.constructor = DateRanges;

  /**
   * Check if the current object is a date-ranges.
   */
  moment.isRanges = function(ranges) {
    return ranges instanceof DateRanges;
  };

  /**
   * Check if the current moment is within a given date-ranges.
   */
  moment.fn.within = function(ranges) {
    return ranges.contains(this.toDate());
  };

  /**
   * Check if the current date-range is within a given date-ranges.
   */
  moment.range.prototype.within = function(ranges) {
    return ranges.contains(this);
  };

  return moment;
}

//-----------------------------------------------------------------------------
// Utility Functions
//-----------------------------------------------------------------------------

/**
 * Merge ranges.
 */
function mergeAndSortDateRanges(ranges) {
  return mergeRanges(ranges.map((range) => [range.start, range.end]))
    .map(([start, end]) => new DateRange(start, end))
    .sort((a, b) => a.start - b.start);
}

/**
 * Flatten array.
 */
function flatten(array) {
  return array.reduce((acc, val) => acc.concat(val), []);
}

/**
 * Deeply flatten array.
 */
function flattenDeep(arr1) {
  return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
}
