import * as M from 'moment';
import { DateRange, extendMoment as rangeExtendMoment } from 'moment-range';
import { DateRanges, extendMoment } from 'moment-ranges';

const moment = extendMoment(rangeExtendMoment(M));


//-----------------------------------------------------------------------------
// Typescript Tests
//-----------------------------------------------------------------------------

// Create
moment.ranges(new DateRange(new Date(), new Date()), new DateRange(new Date(), new Date()));
moment.ranges([new DateRange(new Date(), new Date()), new DateRange(new Date(), new Date())]);

moment().isRanges(moment.ranges(new DateRange()));

// Create
new DateRanges(new DateRange(new Date(), new Date()), new DateRange(new Date(), new Date()));
new DateRanges([new DateRange(new Date(), new Date()), new DateRange(new Date(), new Date())]);

// Add
const ranges001 = new DateRanges(new DateRange());
ranges001.add(new DateRange('month'));

// Clone
const ranges002 = new DateRanges(new DateRange());
ranges002.clone();

// Contains
const ranges003 = new DateRanges(new DateRange());
ranges003.contains(new DateRanges(new DateRange()));
ranges003.contains(new Date());
ranges003.contains(new DateRange('day'));
ranges003.contains(moment());
ranges003.contains(new Date(), { excludeStart: true });
ranges003.contains(new DateRange('day'), { excludeStart: true });
ranges003.contains(moment(), { excludeStart: true });
ranges003.contains(new Date(), { excludeEnd: true });
ranges003.contains(new DateRange('day'), { excludeEnd: true });
ranges003.contains(moment(), { excludeEnd: true });
ranges003.contains(new Date(), { excludeStart: true, excludeEnd: true });
ranges003.contains(new DateRange('day'), { excludeStart: true, excludeEnd: true });
ranges003.contains(moment(), { excludeStart: true, excludeEnd: true });

// Diff
const ranges004 = new DateRanges(new DateRange('year'));
ranges004.diff();
ranges004.diff('month');
ranges004.diff('month', true);

// Duration
const ranges005 = new DateRanges(new DateRange('year'));
ranges005.duration();
ranges005.duration('month');
ranges005.duration('month', true);

// Intersect
const ranges006 = new DateRanges(new DateRange('year'));
ranges006.intersect(new DateRanges(new DateRange('year')));
ranges006.intersect(new DateRange('month'));

// Is Equal
const ranges007 = new DateRanges(new DateRange('year'));
ranges007.isEqual(new DateRanges(new DateRange('year')));

// Is Same
const ranges008 = new DateRanges(new DateRange('year'));
ranges008.isEqual(new DateRanges(new DateRange('year')));

// Overlaps
const ranges009 = new DateRanges(new DateRange('year'));
ranges009.overlaps(new DateRange('month'));
ranges009.overlaps(new DateRange('month'), { adjacent: true });
ranges009.overlaps(new DateRanges(new DateRange('year')));
ranges009.overlaps(new DateRanges(new DateRange('year')), { adjacent: true });

// Subtract
const ranges010 = new DateRanges(new DateRange('year'));
ranges010.subtract(new DateRange('month'));
ranges010.subtract(new DateRanges(new DateRange('year')));

// To Date
const ranges011 = new DateRanges(new DateRange('year'));
ranges011.toDate();

// To String
const ranges012 = new DateRanges(new DateRange('year'));
ranges012.toString();
// eslint-disable-next-line no-unused-expressions
ranges012 + '';

// Value Of
const ranges013 = new DateRanges(new DateRange('year'));
ranges013.valueOf();
// ranges013 + 1;

// Access to moment methods
moment.duration();
// eslint-disable-next-line no-unused-expressions
moment.HTML5_FMT.DATE;
