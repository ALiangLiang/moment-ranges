const moment = require('moment'); // moment is a peer dependency.
require('moment-range').extendMoment(moment); // moment-range is a peer dependency.
require('moment-ranges').extendMoment(moment);

const moment_a = new Date(2009, 1, 8);
const moment_c = new Date(2012, 3, 7);
const range_ac = moment.range(moment_a, moment_c);

const moment_b = new Date(2012, 0, 15);
const moment_d = new Date(2012, 4, 23);
const range_bd = moment.range(start2, end2);

const moment_e = new Date(2019, 10, 26);
const moment_f = new Date(2019, 11, 3);
const range_ef = moment.range(start3, end3);

const ranges_ad_ef = moment.ranges(range_ac, range_bd, range_ef);
// => DateRanges [moment.range(moment_a, moment_d), moment.range(moment_e, moment_f)]

const range_ab = moment.range(moment_a, moment_b);
const ranges_ac_ef = moment.ranges(range_ab, range_ef);

console.log(ranges_ad_ef.contains(moment_b)); // true
console.log(ranges_ad_ef.contains(range_bd)); // true
console.log(ranges_ad_ef.contains(ranges_ac_ef)); // true
