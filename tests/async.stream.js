﻿var stream = require('stream');
var chai = require('chai');

var async = require('asyncawait/async');
var yield_ = require('asyncawait/yield');
var expect = chai.expect;

describe('A suspendable function returned by async.stream(...)', function () {
    var foo = async.stream(function (count, accum) {
        if (count < 1 || count > 9)
            throw new Error('out of range');
        for (var i = 1; i <= count; ++i) {
            if (accum)
                accum.push(111 * i);
            yield_(111 * i);
        }
        return 'done';
    });

    function nullFunc() {
    }

    it('synchronously returns a stream', function () {
        var syncResult = foo(3);
        expect(syncResult).instanceOf(stream.Readable);
    });

    it('executes its definition asynchronously', function (done) {
        var arr = [], items = foo(3, arr);
        items.resume();
        items.on('end', function () {
            expect(arr).to.not.be.empty;
            done();
        });
        expect(arr).to.be.empty;
    });

    it('eventually emits a \'data\' event for each yielded value', function (done) {
        var arr = [], items = foo(4);
        items.on('data', function (val) {
            return arr.push(val);
        });
        items.on('end', function () {
            expect(arr).to.deep.equal([111, 222, 333, 444]);
            done();
        });
    });

    it('eventually emits an \'end\' event if no error is thrown', function (done) {
        var items = foo(7);
        items.on('data', nullFunc);
        items.on('end', function () {
            return done();
        });
    });

    it('eventually emits an \'error\' event with its definition\'s thrown value', function (done) {
        var err, items = foo(20);
        items.on('data', nullFunc);
        items.on('error', function (err) {
            expect(err.message).to.equal('out of range');
            done();
        });
    });
});
//# sourceMappingURL=async.stream.js.map
