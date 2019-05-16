# moment-ranges [![CircleCI](https://circleci.com/gh/ALiangLiang/moment-ranges.svg?style=shield)](https://circleci.com/gh/ALiangLiang/moment-ranges)

<p align="center">
  <img src=".github/logo.png" alt="moment-ranges"/>
</p>

<p align="center">
  Fancy date ranges for [Moment.js][moment] and [moment-range][moment-range].
</p>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
  - [Node / NPM](#node--npm)
  - [Browser](#browser)
  - [Older browsers and IE11](#older-browsers-and-ie11)
- [Examples](#examples)
  - [Create](#create)
  - [Inherit from Array](#inherit-from-array)
  - [Querying](#querying)
    - [Contains](#contains)
    - [Within](#within)
    - [Overlaps](#overlaps)
    - [Intersect](#intersect)
    - [IsRanges](#isranges)
  - [Manipulation](#manipulation)
    - [Add](#add)
    - [Clone](#clone)
    - [Subtract](#subtract)
  - [Compare](#compare)
    - [Equality](#equality)
    - [Difference](#difference)
  - [Conversion](#conversion)
    - [`toDate`](#todate)
    - [`toString`](#tostring)
    - [`valueOf`](#valueof)
- [Running Tests](#running-tests)
- [Contributors](#contributors)
  - [Contributors of moment-range](#contributors-of-moment-range)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

moment-ranges works in both the browser and [node.js][node].

### Node / NPM

Install via npm:

``` sh
npm install --save moment-ranges
```

**ES6:**

``` js
import Moment from 'moment';
import { extendMoment } from 'moment-ranges';

const moment = extendMoment(Moment);
```

**CommonJS:**

``` js
const Moment = require('moment');
const MomentRange = require('moment-range');
const MomentRanges = require('moment-ranges');

const moment = MomentRanges.extendMoment(MomentRange.extendMoment(Moment));
```

### Browser

``` html
<script src="moment.js"></script>
<script src="moment-range.js"></script>
<script src="moment-ranges.js"></script>
```

``` js
window['moment-range'].extendMoment(moment);
```

Thanks to the fine people at [cdnjs][cdnjs], you can link to moment-ranges from
the [cdnjs servers][cdnjs-moment-ranges].

### Older browsers and IE11

This library makes use of `Symbol.iterator` to provide the [iteration
protocols] now that there is [broad support] for them, if you need to support
older browsers (specifically IE11) you will need to include a polyfill. Any of
the following should work, depending on your project configuration:

- [babel runtime transform plugin]
- [babel polyfill]
- [medikoo/es6-iterator](https://github.com/medikoo/es6-iterator)
- [zloirock/core-js](https://github.com/zloirock/core-js)

## Examples

### Create

Create a date-ranges with date-range(s), and also sort and merge overlapping ranges:

``` js
const start1 = new Date(2009, 1, 8);
const end1   = new Date(2012, 3, 7);
const range1 = moment.range(start1, end1);

const start2 = new Date(2012, 0, 15);
const end2   = new Date(2012, 4, 23);
const range2 = moment.range(start2, end2);

const start3 = new Date(2019, 10, 26);
const end3   = new Date(2019, 11, 3);
const range3 = moment.range(start3, end3);

const ranges = moment.ranges(range1, range2, range3);
// => DateRanges [moment.range(start1, end2), moment.range(start3, end3)]

// Arrays work too:
const ranges = moment.ranges([range1, range2, range3]);
```

### Inherit from Array

Date-Ranges is inherit from Array. So you can use any Array methods and attributes of Array:

``` js
const ranges = moment.range(range1, range2, range3);

// Print out all ranges
ranges.forEach((range) => console.log(range))

// Filter out ranges duration more than 1 day
ranges.filter((range) => range > moment.duration(1, 'days'))
```

### Querying

Many of the following examples make use of these moments:

``` js
const a = moment('2016-03-10');
const b = moment('2016-03-15');
const c = moment('2016-03-29');
const d = moment('2016-04-01');

const range_ab = moment.range(a, b);
const range_bc = moment.range(b, c);
const range_cd = moment.range(c, d);
const range_ad = moment.range(a, d);
```

#### Contains

Check to see if your date-ranges contains a date/moment/range. By default the start and end
dates are included in the search. E.g.:

``` js
const ranges_ab_cd = moment.ranges(range_ab, range_cd);

ranges_ab_cd.contains(range_ab); // true
ranges_ab_cd.contains(range_cd); // true
ranges_ab_cd.contains(range_bc); // false
ranges_ab_cd.contains(range_ad); // false
```

You can also control whether the start or end dates should be excluded from the
search with the `excludeStart` and `excludeEnd` options:

``` js
const range = moment.range(a, c);

range.contains(a); // true
range.contains(a, { excludeStart: true }); // false
range.contains(c); // true
range.contains(c, { excludeEnd: true; }); // false
```

**Note**: You can obtain the same functionality by setting `{ excludeStart:
true, excludeEnd: true }`

``` js
range.contains(c); // true
range.contains(c, { exclusive: false }); // true
range.contains(c, { exclusive: true }); // false
```

#### Within

Find out if your moment or date-range falls within a date range:

``` js
const range_ac = moment.range(a, c);
const range_bd = moment.range(b, d);
const ranges = moment.range(range_ac, range_bd);

b.within(ranges); // true
range_ac.within(ranges); // true
```

#### Overlaps

Does it overlap another range?

``` js
const range_ac = moment.range(a, c);
const range_bd = moment.range(b, d);

const ranges_ac = moment.range(range_ac);
const ranges_bd = moment.range(range_bd);

// ranges-ranges
ranges_ac.overlaps(ranges_bd); // true

// ranges-range
ranges_ac.overlaps(range_bd); // true
```

Include adjacent ranges:

``` js
const range_ab = moment.range(a, b);
const range_bc = moment.range(b, c);
const range_cd = moment.range(c, d);
const ranges_ac = moment.range(range_ab, range_bc);

ranges_ac.overlaps(range_bc)                      // true
ranges_ac.overlaps(range_cd, { adjacent: false }) // false
ranges_ac.overlaps(range_cd, { adjacent: true })  // true
```

#### Intersect

What is the intersecting range?

``` js
const range_ac = moment.range(a, c);
const range_bd = moment.range(b, d);
const ranges_ac = moment.range(range_ac);

ranges_ac.intersect(range_bd); // DateRanges [moment.range(b, c)]
```

#### IsRanges

Is it a Ranges?

``` js
moment.isRanges(ranges); // true
moment.isRanges(IamNotRanges); // false
```

### Manipulation

#### Add

Add/combine/merge overlapping or adjacent ranges.

``` js
const range1 = moment.range(a, c);
const range2 = moment.range(b, d);
const ranges = moment.ranges(range1);
ranges.add(range2); // DateRanges [moment.range(a, d)]
// Merge into one date-range

const range3 = moment.range(a, b);
const range4 = moment.range(c, d);
const ranges = moment.ranges(range4);
ranges.add(range3); // DateRanges [moment.range(a, b), moment.range(c d)]
// No merge but sorted
```

#### Clone

Deep clone a range

``` js
const range1 = moment.range(a, d);
const ranges1 = moment.ranges(range1)

const range2 = range1.clone();
const ranges2 = moment.ranges(range2)
ranges2[0].start.add(2, 'days');

range1.start.toDate().valueOf() === range2.start.toDate().valueOf() // false
```

#### Subtract

Subtracting one range from another.

``` js
const range_ab = moment.range(a, b);
const range_bc = moment.range(b, c);
const range_cd = moment.range(c, d);
const range_ad = moment.range(a, d);
range_ad.subtract(range_bc); // [moment.range(a, b) moment.range(c, d)]
range_ac.subtract(range_bc); // [moment.range(a, b)]
range_ab.subtract(range_cd); // [moment.range(a, b)]
range_bc.subtract(range_bd); // [null]
```

### Compare

Compare range lengths or whole ranges length. Or add them together with simple math:

``` js
const range1 = moment.range(new Date(2011, 2, 5), new Date(2011, 3, 15));
const range2 = moment.range(new Date(1995, 0, 1), new Date(1995, 12, 25));
const ranges1 = moment.ranges(range1, range2)

const range3 = moment.range(new Date(2011, 3, 5), new Date(2011, 3, 15));
const range4 = moment.range(new Date(1995, 1, 1), new Date(1995, 12, 25));
const ranges2 = moment.ranges(range3, range4)

ranges2 > ranges1 // true
ranges2 > range3 // true

ranges1 + ranges2 // duration of both ranges in milliseconds
ranges1 + range3 // duration of ranges and range in milliseconds

Math.abs(ranges1 - ranges2); // difference of ranges in milliseconds
```

#### Equality

Check if two ranges are the same, i.e. their starts and ends are the same:

``` js
const range1 = moment.range(new Date(2011, 2, 5), new Date(2011, 3, 15));
const range2 = moment.range(new Date(2011, 2, 5), new Date(2011, 3, 15));
const range3 = moment.range(new Date(2011, 3, 5), new Date(2011, 6, 15));

range1.isSame(range2); // true
range2.isSame(range3); // false

range1.isEqual(range2); // true
range2.isEqual(range3); // false
```

#### Difference

The difference of the entire ranges given various units.

Any of the units accepted by [moment.js' `add` method][add] may be used.

``` js
const start1 = new Date(2011, 2, 5);
const end1   = new Date(2011, 5, 5);
const range1 = moment.range(start, end);

const start2 = new Date(2014, 3, 5);
const end2   = new Date(2014, 5, 5);
const range2 = moment.range(start, end);

const ranges = moment.ranges(range1, range2);

ranges.diff('months'); // 6
ranges.diff('days');   // ?
ranges.diff();         // ?
```

Optionally you may specify if the difference should not be truncated. By default it
mimics moment-js' behaviour and truncates the values:

``` js
const d1 = new Date(Date.UTC(2011, 4, 1));
const d2 = new Date(Date.UTC(2011, 4, 5, 12));
const range = moment.range(d1, d2);
const ranges = moment.ranges(range);

ranges.diff('days')        // 4
ranges.diff('days', false) // 4
ranges.diff('days', true)  // 4.75
```

`#duration` is an alias for `#diff` and they may be used interchangeably.

### Conversion

#### `toDate`

Converts the `DateRanges` to an `Array` of `Array` of the start and end `Date` objects.

``` js
const range1 = moment.range(new Date(2011, 2, 5), new Date(2011, 5, 5));
const range2 = moment.range(new Date(2014, 3, 10), new Date(2014, 3, 20));
const ranges = moment.ranges(range1, range2);

ranges.toDate();
// [
//   [new Date(2011, 2, 5), new Date(2011, 5, 5)],
//   [new Date(2011, 3, 10), new Date(2011, 3, 20)]
// ]
```

#### `toString`

Converting a `DateRange` to a `String` will format it as many [ISO 8601 time
interval][interval] concatenated by comma:

``` js
const range1 = moment.range(moment.utc('2015-01-17T09:50:04+08:00'), moment.utc('2015-04-17T08:29:55+08:00'));
const range2 = moment.range(moment.utc('2015-03-10T02:70:04+08:00'), moment.utc('2015-03-20T07:56:51+08:00'));

range.toString()
// "2015-01-17T09:50:04+08:00/2015-04-17T08:29:55+08:00,2015-03-10T02:70:04+08:00/2015-03-20T07:56:51+08:00"
```

#### `valueOf`

The difference between the end date and start date in milliseconds.

``` js
const range1 = moment.range(new Date(2011, 2, 5), new Date(2011, 5, 5));
const range2 = moment.range(new Date(2014, 3, 10), new Date(2014, 3, 20));
const ranges = moment.ranges(range1, range2);

range1.valueOf(); // 7945200000
range2.valueOf(); // 864000000

ranges.valueOf(); // 8809200000
// 7945200000 + 864000000 = 8809200000
```

## Running Tests

Clone this bad boy:

``` sh
git clone https://git@github.com/rotaready/moment-ranges.git
```

Install the dependencies:

``` sh
yarn install
```

Do all the things!

``` sh
yarn run check
yarn run test
yarn run lint
```

## Contributors

### Contributors of moment-range

Many thanks to these contributors. They built the predecessor of this project.

- [**Gianni Chiappetta**](https://github.com/rotaready)  ([https://butt.zone](https://butt.zone)) (Author of [moment-range][moment-range])
- [**Adam Biggs**](https://github.com/adambiggs) ([http://lightmaker.com](http://lightmaker.com))
- [**Mats Julian Olsen**](https://github.com/mewwts)
- [**Matt Patterson**](https://github.com/fidothe) ([http://reprocessed.org/](http://reprocessed.org/))
- [**Wilgert Velinga**](https://github.com/wilgert) ([http://neocles.io](http://neocles.io))
- [**Tomasz Bak**](https://github.com/tb) ([http://twitter.com/tomaszbak](http://twitter.com/tomaszbak))
- [**Stuart Kelly**](https://github.com/stuartleigh)
- [**Jeremy Forsythe**](https://github.com/jdforsythe)
- [**Александр Гренишин**](https://github.com/nd0ut)
- [**@scotthovestadt**](https://github.com/scotthovestadt)
- [**Thomas van Lankveld**](https://github.com/thomasvanlankveld)
- [**nebel**](https://github.com/pronebel)
- [**Kevin Ross**](https://github.com/rosskevin) ([http://www.alienfast.com](http://www.alienfast.com))
- [**Thomas Walpole**](https://github.com/twalpole)
- [**Jonathan Kim**](https://github.com/jkimbo) ([http://jkimbo.co.uk](http://jkimbo.co.uk))
- [**Tymon Tobolski**](https://github.com/teamon) ([http://teamon.eu](http://teamon.eu))
- [**Aristide Niyungeko**](https://github.com/aristiden7o)
- [**Bradley Ayers**](https://github.com/bradleyayers)
- [**Ross Hadden**](https://github.com/rosshadden) ([http://rosshadden.github.com/resume](http://rosshadden.github.com/resume))
- [**Victoria French**](https://github.com/victoriafrench)
- [**Jochen Diekenbrock**](https://github.com/JochenDiekenbrock)

## License

moment-ranges is [MIT license][mit].

[add]: http://momentjs.com/docs/#/manipulating/add/
[babel runtime transform plugin]: https://babeljs.io/docs/plugins/transform-runtime
[babel polyfill]: https://babeljs.io/docs/usage/polyfill
[broad support]: http://kangax.github.io/compat-table/es6/#test-well-known_symbols_Symbol.iterator,_existence_a_href=_https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator_title=_MDN_documentation_img_src=_../mdn.png_alt=_MDN_(Mozilla_Development_Network)_logo_width=_15_height=_13_/_/a_nbsp;
[cdnjs]: https://github.com/cdnjs/cdnjs
[cdnjs-moment-ranges]: https://cdnjs.com/libraries/moment-ranges
[interval]: http://en.wikipedia.org/wiki/ISO_8601#Time_intervals
[iterable]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#Syntaxes_expecting_iterables
[iteration protocols]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
[moment]: http://momentjs.com/
[moment-range]: https://github.com/rotaready/moment-range
[node]: http://nodejs.org/
[mit]: https://opensource.org/licenses/MIT
[parseZone]: https://momentjs.com/docs/#/parsing/parse-zone/
