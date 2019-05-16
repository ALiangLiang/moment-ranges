import expect from 'expect.js';
import M from 'moment';
import { DateRange, extendMoment as rangeExtendMoment } from 'moment-range';
import { DateRanges, extendMoment } from 'moment-ranges';

const moment = extendMoment(rangeExtendMoment(M));

describe('Moment', function() {
  const dr1 = moment.range(new Date(Date.UTC(2011, 2, 5)), new Date(Date.UTC(2011, 5, 5)));
  const dr2 = moment.range(new Date(Date.UTC(2011, 6, 5)), new Date(Date.UTC(2011, 7, 5)));
  let drs = moment.ranges(dr1, dr2);
  const m1 = moment('2011-04-15', 'YYYY-MM-DD');
  const m2 = moment('2012-12-25', 'YYYY-MM-DD');
  const mStart = moment('2011-03-05', 'YYYY-MM-DD');
  const mEnd = moment('2011-06-05', 'YYYY-MM-DD');
  const or = moment.range(null, '2011-05-05');
  const or2 = moment.range('2011-03-05', null);

  describe('#ranges()', function() {
    it('should return a DateRanges with DateRange(s)', function() {
      drs = moment.ranges(dr1, dr2);
      expect(moment.isRange(drs[0])).to.be(true);
      expect(moment.isRange(drs[1])).to.be(true);
    });

    it('should support string units like `year`, `month`, `week`, `day`, `minute`, `second`, etc...', function() {
      drs = moment.ranges(m1.range('year'));
      expect(drs[0].start.valueOf()).to.equal(moment(m1).startOf('year').valueOf());
      expect(drs[0].end.valueOf()).to.equal(moment(m1).endOf('year').valueOf());
    });
  });

  describe('#isRanges()', function() {
    it('should determine if the current object is ranges', function() {
      expect(moment.isRanges(drs)).to.be(true);
      expect(moment.isRanges(dr1)).to.be(false);
    });
  });
});

describe('DateRanges', function() {
  const d1 = new Date(Date.UTC(2011, 2, 5));
  const d2 = new Date(Date.UTC(2011, 5, 5));
  const d3 = new Date(Date.UTC(2011, 4, 9));
  const d4 = new Date(Date.UTC(1988, 0, 1));
  const m1 = moment.utc('06-05-1996', 'MM-DD-YYYY');
  const m2 = moment.utc('11-05-1996', 'MM-DD-YYYY');
  const m3 = moment.utc('08-12-1996', 'MM-DD-YYYY');
  const m4 = moment.utc('01-01-2012', 'MM-DD-YYYY');
  const sStart = '1996-08-12T00:00:00.000Z';
  const sEnd = '2012-01-01T00:00:00.000Z';
  const dr1 = moment.range(new Date(Date.UTC(2011, 2, 5)), new Date(Date.UTC(2011, 4, 5)));
  const dr2 = moment.range(new Date(Date.UTC(2011, 3, 5)), new Date(Date.UTC(2011, 5, 5)));
  const dr3 = moment.range(new Date(Date.UTC(2011, 6, 5)), new Date(Date.UTC(2011, 7, 5)));
  const dr4 = moment.range(new Date(Date.UTC(2011, 7, 5)), new Date(Date.UTC(2011, 8, 5)));

  describe('constructor', function() {
    it('should allow initialization with range rest', function() {
      const drs = moment.ranges(dr1, dr2, dr3);

      expect(moment.isRange(drs[0])).to.be(true);
      expect(moment.isRange(drs[1])).to.be(true);
      expect(drs[2]).to.be(undefined);
    });

    it('should allow initialization with range array', function() {
      const drs = moment.ranges([dr1, dr2], dr3);

      expect(moment.isRange(drs[0])).to.be(true);
      expect(moment.isRange(drs[1])).to.be(true);
      expect(drs[2]).to.be(undefined);
    });
  });

  describe('#clone()', function() {
    const dr1 = moment().range(sStart, sEnd);

    it('should deep clone ranges', function() {
      const drs1 = moment.ranges(dr1);
      const drs2 = drs1.clone();

      drs2[0].start.add('days', 2);
      expect(drs1[0].start.toDate()).to.not.equal(drs2[0].start.toDate());
    });
  });

  describe('#contains()', function() {
    it('should work with Date objects', function() {
      const drs = moment.ranges(dr2);

      expect(drs.contains(d3)).to.be(true);
      expect(drs.contains(d4)).to.be(false);
    });

    it('should work with Moment objects', function() {
      const drs = moment.ranges(dr2);

      expect(drs.contains(moment.utc('05-05-2011', 'MM-DD-YYYY'))).to.be(true);
      expect(drs.contains(moment.utc('07-05-2011', 'MM-DD-YYYY'))).to.be(false);
    });

    it('should work with DateRange objects', function() {
      const drs = moment.ranges(dr1, dr2);

      expect(drs.contains(dr1)).to.be(true);
      expect(drs.contains(dr3)).to.be(false);
    });

    it('should work with DateRanges objects', function() {
      const drs1 = moment.ranges(dr1, dr2, dr3);
      const drs2 = moment.ranges(dr2, dr3);
      const drs3 = moment.ranges(dr2, dr4);

      expect(drs1.contains(drs2)).to.be(true);
      expect(drs1.contains(drs3)).to.be(false);
    });

    it('should be an inclusive comparison', function() {
      const drs = moment.ranges(dr1, dr2);

      expect(drs.contains(moment.utc('03-05-2011', 'MM-DD-YYYY'))).to.be(true);
      expect(drs.contains(moment.utc('06-05-2011', 'MM-DD-YYYY'))).to.be(true);
      expect(drs.contains(drs)).to.be(true);
    });

    it('should exclude the start date when `excludeStart` is set to `true`', function() {
      const drs = moment.ranges(dr1, dr2);

      expect(drs.contains(moment.utc('03-05-2011', 'MM-DD-YYYY'), { excludeStart: true })).to.be(false);
      expect(drs.contains(moment.utc('06-05-2011', 'MM-DD-YYYY'), { excludeStart: true })).to.be(true);
      expect(drs.contains(drs, { excludeStart: true })).to.be(false);
    });

    it('should exclude the end date when `excludeEnd` is set to `true`', function() {
      const drs = moment.ranges(dr1, dr2);

      expect(drs.contains(moment.utc('03-05-2011', 'MM-DD-YYYY'), { excludeEnd: true })).to.be(true);
      expect(drs.contains(moment.utc('06-05-2011', 'MM-DD-YYYY'), { excludeEnd: true })).to.be(false);
      expect(drs.contains(drs, { excludeEnd: true })).to.be(false);
    });
  });

  describe('#overlaps()', function() {
    it('should work with DateRange objects', function() {
      const drs = moment.ranges(dr1);

      expect(drs.overlaps(dr2)).to.be(true);
      expect(drs.overlaps(dr3)).to.be(false);
    });

    it('should work with DateRanges objects', function() {
      const drs1 = moment.ranges(dr1);
      const drs2 = moment.ranges(dr2);
      const drs3 = moment.ranges(dr3);

      expect(drs1.overlaps(drs2)).to.be(true);
      expect(drs1.overlaps(drs3)).to.be(false);
    });

    it('should indicate if ranges overlap if the options is passed in', function() {
      const drs1 = moment.ranges(dr3);
      const drs2 = moment.ranges(dr4);

      expect(drs1.overlaps(drs2)).to.be(false);
      expect(drs1.overlaps(drs2, { adjacent: false })).to.be(false);
      expect(drs1.overlaps(drs2, { adjacent: true })).to.be(true);
    });

    it('should not overlap zero-length ranges on the start date when `adjacent` is `false`', function() {
      const a = moment.utc('2018-02-01T03:00:00');
      const b = moment.utc('2018-02-01T13:00:00');
      const range1 = moment.range(a, a);
      const range2 = moment.range(a, b);
      const drs1 = moment.ranges(range1);
      const drs2 = moment.ranges(range2);

      expect(drs1.overlaps(drs1)).to.be(false);
      expect(drs1.overlaps(drs1, { adjacent: false })).to.be(false);
    });

    it('should overlap zero-length ranges on the start date when `adjacent` is `true`', function() {
      const a = moment.utc('2018-02-01T03:00:00');
      const b = moment.utc('2018-02-01T13:00:00');
      const range1 = moment.range(a, a);
      const range2 = moment.range(a, b);
      const drs1 = moment.ranges(range1);
      const drs2 = moment.ranges(range2);

      expect(drs1.overlaps(drs2, { adjacent: true })).to.be(true);
    });

    it('should not overlap zero-length ranges on the end date when `adjacent` is `false`', function() {
      const a = moment.utc('2018-02-01T03:00:00');
      const b = moment.utc('2018-02-01T13:00:00');
      const range1 = moment.range(a, b);
      const range2 = moment.range(b, b);
      const drs1 = moment.ranges(range1);
      const drs2 = moment.ranges(range2);

      expect(drs1.overlaps(drs2)).to.be(false);
      expect(drs1.overlaps(drs2, { adjacent: false })).to.be(false);
    });

    it('should overlap zero-length ranges on the end date when `adjacent` is `true`', function() {
      const a = moment.utc('2018-02-01T03:00:00');
      const b = moment.utc('2018-02-01T13:00:00');
      const range1 = moment.range(a, b);
      const range2 = moment.range(b, b);
      const drs1 = moment.ranges(range1);
      const drs2 = moment.ranges(range2);

      expect(drs1.overlaps(drs2, { adjacent: true })).to.be(true);
    });
  });

  // describe('#intersect()', function() {
  //   const d5 = new Date(Date.UTC(2011, 2, 2));
  //   const d6 = new Date(Date.UTC(2011, 4, 4));
  //   const d7 = new Date(Date.UTC(2011, 6, 6));
  //   const d8 = new Date(Date.UTC(2011, 8, 8));

  //   it('should work with [---{==]---} overlaps where (a=[], b={})', function() {
  //     const dr1 = moment.range(d5, d7);
  //     const dr2 = moment.range(d6, d8);

  //     expect(dr1.intersect(dr2).isSame(moment.range(d6, d7))).to.be(true);
  //   });

  //   it('should work with {---[==}---] overlaps where (a=[], b={})', function() {
  //     const dr1 = moment.range(d6, d8);
  //     const dr2 = moment.range(d5, d7);

  //     expect(dr1.intersect(dr2).isSame(moment.range(d6, d7))).to.be(true);
  //   });

  //   it('should work with [{===]---} overlaps where (a=[], b={})', function() {
  //     const dr1 = moment.range(d5, d6);
  //     const dr2 = moment.range(d5, d7);

  //     expect(dr1.intersect(dr2).isSame(moment.range(d5, d6))).to.be(true);
  //   });

  //   it('should work with {[===}---] overlaps where (a=[], b={})', function() {
  //     const dr1 = moment.range(d5, d7);
  //     const dr2 = moment.range(d5, d6);

  //     expect(dr1.intersect(dr2).isSame(moment.range(d5, d6))).to.be(true);
  //   });

  //   it('should work with [---{===]} overlaps where (a=[], b={})', function() {
  //     const dr1 = moment.range(d5, d7);
  //     const dr2 = moment.range(d6, d7);

  //     expect(dr1.intersect(dr2).isSame(moment.range(d6, d7))).to.be(true);
  //   });

  //   it('should work with {---[===}] overlaps where (a=[], b={})', function() {
  //     const dr1 = moment.range(d6, d7);
  //     const dr2 = moment.range(d5, d7);

  //     expect(dr1.intersect(dr2).isSame(moment.range(d6, d7))).to.be(true);
  //   });

  //   it('should work with [---] {---} overlaps where (a=[], b={})', function() {
  //     const dr1 = moment.range(d5, d6);
  //     const dr2 = moment.range(d7, d8);

  //     expect(dr1.intersect(dr2)).to.be(null);
  //   });

  //   it('should work with {---} [---] overlaps where (a=[], b={})', function() {
  //     const dr1 = moment.range(d7, d8);
  //     const dr2 = moment.range(d5, d6);

  //     expect(dr1.intersect(dr2)).to.be(null);
  //   });

  //   it('should work with [---]{---} overlaps where (a=[], b={})', function() {
  //     const dr1 = moment.range(d5, d6);
  //     const dr2 = moment.range(d6, d7);

  //     expect(dr1.intersect(dr2)).to.be(null);
  //   });

  //   it('should work with {---}[---] overlaps where (a=[], b={})', function() {
  //     const dr1 = moment.range(d6, d7);
  //     const dr2 = moment.range(d5, d6);
  //     expect(dr1.intersect(dr2)).to.be(null);
  //   });

  //   it('should work with {--[===]--} overlaps where (a=[], b={})', function() {
  //     const dr1 = moment.range(d6, d7);
  //     const dr2 = moment.range(d5, d8);

  //     expect(dr1.intersect(dr2).isSame(dr1)).to.be(true);
  //   });

  //   it('should work with [--{===}--] overlaps where (a=[], b={})', function() {
  //     const dr1 = moment.range(d5, d8);
  //     const dr2 = moment.range(d6, d7);

  //     expect(dr1.intersect(dr2).isSame(dr2)).to.be(true);
  //   });

  //   it('should work with [{===}] overlaps where (a=[], b={})', function() {
  //     const dr1 = moment.range(d5, d6);
  //     const dr2 = moment.range(d5, d6);

  //     expect(dr1.intersect(dr2).isSame(dr2)).to.be(true);
  //   });

  //   it('should work with [--{}--] overlaps where (a=[], b={})', function() {
  //     const dr1 = moment.range(d6, d6);
  //     const dr2 = moment.range(d5, d7);

  //     expect(dr1.intersect(dr2).isSame(dr1)).to.be(true);
  //   });

  //   it('should return `null` with [---{}] non-overlaps where (a=[], b={})', function() {
  //     const a = moment.utc('2018-02-01T03:00:00');
  //     const b = moment.utc('2018-02-01T13:00:00');
  //     const dr1 = moment.range(a, b);
  //     const dr2 = moment.range(b, b);

  //     expect(dr1.intersect(dr2)).to.be(null);
  //   });

  //   it('should return `null` with [{}---] non-overlaps where (a=[], b={})', function() {
  //     const a = moment.utc('2018-02-01T03:00:00');
  //     const b = moment.utc('2018-02-01T13:00:00');
  //     const dr1 = moment.range(a, b);
  //     const dr2 = moment.range(a, a);

  //     expect(dr1.intersect(dr2)).to.be(null);
  //   });

  //   it('should return `null` with {---[]} non-overlaps where (a=[], b={})', function() {
  //     const a = moment.utc('2018-02-01T03:00:00');
  //     const b = moment.utc('2018-02-01T13:00:00');
  //     const dr1 = moment.range(b, b);
  //     const dr2 = moment.range(a, b);

  //     expect(dr1.intersect(dr2)).to.be(null);
  //   });

  //   it('should return `null` with {[]---} non-overlaps where (a=[], b={})', function() {
  //     const a = moment.utc('2018-02-01T03:00:00');
  //     const b = moment.utc('2018-02-01T13:00:00');
  //     const dr1 = moment.range(a, a);
  //     const dr2 = moment.range(a, b);

  //     expect(dr1.intersect(dr2)).to.be(null);
  //   });
  // });

  // describe.only('#add()', function() {
  //   const d5 = new Date(Date.UTC(2011, 2, 2));
  //   const d6 = new Date(Date.UTC(2011, 4, 4));
  //   const d7 = new Date(Date.UTC(2011, 6, 6));
  //   const d8 = new Date(Date.UTC(2011, 8, 8));

  //   it('should add ranges with [---{==]---} overlaps where (a=[], b={})', function() {
  //     const dr1 = moment.range(d5, d7);
  //     const dr2 = moment.range(d6, d8);

  //     expect(dr1.add(dr2).isSame(moment.range(d5, d8))).to.be(true);
  //   });

  //   it('should add ranges with {---[==}---] overlaps where (a=[], b={})', function() {
  //     const dr1 = moment.range(d6, d8);
  //     const dr2 = moment.range(d5, d7);

  //     expect(dr1.add(dr2).isSame(moment.range(d5, d8))).to.be(true);
  //   });

  //   it('should add ranges with [{===]---} overlaps where (a=[], b={})', function() {
  //     const dr1 = moment.range(d5, d6);
  //     const dr2 = moment.range(d5, d7);

  //     expect(dr1.add(dr2).isSame(moment.range(d5, d7))).to.be(true);
  //   });

  //   it('should add ranges with {[===}---] overlaps where (a=[], b={})', function() {
  //     const dr1 = moment.range(d5, d7);
  //     const dr2 = moment.range(d5, d6);

  //     expect(dr1.add(dr2).isSame(moment.range(d5, d7))).to.be(true);
  //   });

  //   it('should add ranges with [---{===]} overlaps where (a=[], b={})', function() {
  //     const dr1 = moment.range(d5, d7);
  //     const dr2 = moment.range(d6, d7);

  //     expect(dr1.add(dr2).isSame(moment.range(d5, d7))).to.be(true);
  //   });

  //   it('should add ranges with {---[===}] overlaps where (a=[], b={})', function() {
  //     const dr1 = moment.range(d6, d7);
  //     const dr2 = moment.range(d5, d7);

  //     expect(dr1.add(dr2).isSame(moment.range(d5, d7))).to.be(true);
  //   });

  //   it('should not add ranges with [---] {---} overlaps where (a=[], b={})', function() {
  //     const dr1 = moment.range(d5, d6);
  //     const dr2 = moment.range(d7, d8);

  //     expect(dr1.add(dr2)).to.be(null);
  //   });

  //   it('should not add ranges with {---} [---] overlaps where (a=[], b={})', function() {
  //     const dr1 = moment.range(d7, d8);
  //     const dr2 = moment.range(d5, d6);

  //     expect(dr1.add(dr2)).to.be(null);
  //   });

  //   it('should not add ranges with [---]{---} overlaps where (a=[], b={}) by default or with adjacent: false', function() {
  //     const dr1 = moment.range(d5, d6);
  //     const dr2 = moment.range(d6, d7);

  //     expect(dr1.add(dr2)).to.be(null);
  //     expect(dr1.add(dr2, { adjacent: false })).to.be(null);
  //   });

  //   it('should add ranges with [---]{---} overlaps where (a=[], b={}) with adjacent: true', function() {
  //     const dr1 = moment.range(d5, d6);
  //     const dr2 = moment.range(d6, d7);

  //     expect(dr1.add(dr2, { adjacent: true }).isSame(moment.range(d5, d7))).to.be(true);
  //   });

  //   it('should not add ranges with {---}[---] overlaps where (a=[], b={}) by default or with adjacent: false', function() {
  //     const dr1 = moment.range(d6, d7);
  //     const dr2 = moment.range(d5, d6);

  //     expect(dr1.add(dr2)).to.be(null);
  //     expect(dr1.add(dr2, { adjacent: false })).to.be(null);
  //   });

  //   it('should add ranges with {---}[---] overlaps where (a=[], b={}) with adjacent: true', function() {
  //     const dr1 = moment.range(d6, d7);
  //     const dr2 = moment.range(d5, d6);

  //     expect(dr1.add(dr2, { adjacent: true }).isSame(moment.range(d5, d7))).to.be(true);
  //   });

  //   it('should add ranges {--[===]--} overlaps where (a=[], b={})', function() {
  //     const dr1 = moment.range(d6, d7);
  //     const dr2 = moment.range(d5, d8);

  //     expect(dr1.add(dr2).isSame(moment.range(d5, d8))).to.be(true);
  //   });

  //   it('should add ranges [--{===}--] overlaps where (a=[], b={})', function() {
  //     const dr1 = moment.range(d5, d8);
  //     const dr2 = moment.range(d6, d7);

  //     expect(dr1.add(dr2).isSame(moment.range(d5, d8))).to.be(true);
  //   });

  //   it('should add ranges [{===}] overlaps where (a=[], b={})', function() {
  //     const dr1 = moment.range(d5, d6);
  //     const dr2 = moment.range(d5, d6);

  //     expect(dr1.add(dr2).isSame(moment.range(d5, d6))).to.be(true);
  //     expect(dr1.add(dr2, { adjacent: false }).isSame(moment.range(d5, d6))).to.be(true);
  //     expect(dr1.add(dr2, { adjacent: true }).isSame(moment.range(d5, d6))).to.be(true);
  //   });
  // });

  // describe('#subtract()', function() {
  //   const d5 = new Date(Date.UTC(2011, 2, 2));
  //   const d6 = new Date(Date.UTC(2011, 4, 4));
  //   const d7 = new Date(Date.UTC(2011, 6, 6));
  //   const d8 = new Date(Date.UTC(2011, 8, 8));

  //   it('should turn [--{==}--] into (--) (--) where (a=[], b={})', function() {
  //     const dr1 = moment.range(d5, d8);
  //     const dr2 = moment.range(d6, d7);

  //     expect(dr1.subtract(dr2)).to.eql([moment.range(d5, d6), moment.range(d7, d8)]);
  //   });

  //   it('should turn {--[==]--} into () where (a=[], b={})', function() {
  //     const dr1 = moment.range(d6, d7);
  //     const dr2 = moment.range(d5, d8);

  //     expect(dr1.subtract(dr2)).to.eql([]);
  //   });

  //   it('should turn {[==]} into () where (a=[], b={})', function() {
  //     const dr1 = moment.range(d5, d6);
  //     const dr2 = moment.range(d5, d6);

  //     expect(dr1.subtract(dr2)).to.eql([]);
  //   });

  //   it('should turn [--{==]--} into (--) where (a=[], b={})', function() {
  //     const dr1 = moment.range(d5, d7);
  //     const dr2 = moment.range(d6, d8);

  //     expect(dr1.subtract(dr2)).to.eql([moment.range(d5, d6)]);
  //   });

  //   it('should turn [--{==]} into (--) where (a=[], b={})', function() {
  //     const dr1 = moment.range(d5, d7);
  //     const dr2 = moment.range(d6, d7);

  //     expect(dr1.subtract(dr2)).to.eql([moment.range(d5, d6)]);
  //   });

  //   it('should turn {--[==}--] into (--) where (a=[], b={})', function() {
  //     const dr1 = moment.range(d6, d8);
  //     const dr2 = moment.range(d5, d7);

  //     expect(dr1.subtract(dr2)).to.eql([moment.range(d7, d8)]);
  //   });

  //   it('should turn {[==}--] into (--) where (a=[], b={})', function() {
  //     const dr1 = moment.range(d6, d8);
  //     const dr2 = moment.range(d6, d7);

  //     expect(dr1.subtract(dr2)).to.eql([moment.range(d7, d8)]);
  //   });

  //   it('should turn [--] {--} into (--) where (a=[], b={})', function() {
  //     const dr1 = moment.range(d5, d6);
  //     const dr2 = moment.range(d7, d8);

  //     expect(dr1.subtract(dr2)).to.eql([dr1]);
  //   });

  //   it('should turn {--} [--] into (--) where (a=[], b={})', function() {
  //     const dr1 = moment.range(d7, d8);
  //     const dr2 = moment.range(d5, d6);

  //     expect(dr1.subtract(dr2)).to.eql([dr1]);
  //   });

  //   it('should turn [--{==}--] into (--) where (a=[], b={})', function() {
  //     const o = moment.range('2015-04-07T00:00:00+00:00/2015-04-08T00:00:00+00:00');
  //     const s = moment.range('2015-04-07T17:12:18+00:00/2015-04-07T17:12:18+00:00');
  //     const subtraction = o.subtract(s);
  //     const a = moment.range('2015-04-07T00:00:00+00:00/2015-04-07T17:12:18+00:00');
  //     const b = moment.range('2015-04-07T17:12:18+00:00/2015-04-08T00:00:00+00:00');

  //     expect(subtraction[0].start.isSame(a.start)).to.be(true);
  //     expect(subtraction[0].end.isSame(a.end)).to.be(true);
  //     expect(subtraction[1].start.isSame(b.start)).to.be(true);
  //     expect(subtraction[1].end.isSame(b.end)).to.be(true);
  //   });
  // });

  // describe('#isSame()', function() {
  //   it('should true if the start and end of both DateRange objects equal', function() {
  //     const dr1 = moment.range(d1, d2);
  //     const dr2 = moment.range(d1, d2);

  //     expect(dr1.isSame(dr2)).to.be(true);
  //   });

  //   it('should false if the starts differ between objects', function() {
  //     const dr1 = moment.range(d1, d3);
  //     const dr2 = moment.range(d2, d3);

  //     expect(dr1.isSame(dr2)).to.be(false);
  //   });

  //   it('should false if the ends differ between objects', function() {
  //     const dr1 = moment.range(d1, d2);
  //     const dr2 = moment.range(d1, d3);

  //     expect(dr1.isSame(dr2)).to.be(false);
  //   });
  // });

  // describe('#toString()', function() {
  //   it('should be a correctly formatted ISO8601 Time Interval', function() {
  //     const start = moment.utc('2015-01-17T09:50:04+00:00');
  //     const end   = moment.utc('2015-04-17T08:29:55+00:00');
  //     const dr = moment.range(start, end);

  //     expect(dr.toString()).to.equal(start.format() + '/' + end.format());
  //   });
  // });

  // describe('#valueOf()', function() {
  //   it('should be the value of the range in milliseconds', function() {
  //     const dr = moment.range(d1, d2);

  //     expect(dr.valueOf()).to.eql(d2.getTime() - d1.getTime());
  //   });

  //   it('should correctly coerce to a number', function() {
  //     const dr1 = moment.range(d4, d2);
  //     const dr2 = moment.range(d3, d2);

  //     expect((dr1 > dr2)).to.be(true);
  //   });
  // });

  // describe('#toDate()', function() {
  //   it('should be a array like [dateObject, dateObject]', function() {
  //     const dr = moment.range(d1, d2);
  //     const drTodate = dr.toDate();

  //     expect(drTodate.length).to.eql(2);
  //     expect(drTodate[0].valueOf()).to.eql(d1.valueOf());
  //     expect(drTodate[1].valueOf()).to.eql(d2.valueOf());
  //   });
  // });

  // describe('#diff()', function() {
  //   it('should use momentjs’ diff method', function() {
  //     const dr = moment.range(d1, d2);

  //     expect(dr.diff('months')).to.equal(3);
  //     expect(dr.diff('days')).to.equal(92);
  //     expect(dr.diff()).to.equal(7948800000);
  //   });

  //   it('should optionally pass the precise argument', function() {
  //     const d1 = new Date(Date.UTC(2011, 4, 1));
  //     const d2 = new Date(Date.UTC(2011, 4, 5, 12));
  //     const dr = moment.range(d1, d2);

  //     expect(dr.diff('days', true)).to.equal(4.5);
  //   });
  // });
});
