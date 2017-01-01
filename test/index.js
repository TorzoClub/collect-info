const fs = require('fs');
const path = require('path');
const Collect = require('../index');
const should = require('should');

describe('收集', function () {
	it('必须要有 struct 参数', () => {
		(() => {
			new Collect
		}).should.throw('no struct');
	})
	it('数字类型', (done) => {
		const Schema = new Collect(
			[{
				type: Number,
				name: 'useClass',
			}, {
				type: 'numBer',
				name: 'useString'
			}, {
				type: Number,
				prompt: '输入一个数字',
				catch: '类型错误：',
				name: 'bad',
			}]
		);

		Schema.start(fs.createReadStream(path.join(__dirname, 'num.txt')))
			.then(obj => {
				should(obj.useClass).is.an.Number();
				should(obj.useClass).equal(9);

				should(obj.useString).is.an.Number();
				should(obj.useString).equal(4);

				should(obj.bad).is.an.Number();
				should(obj.bad).equal(999);
				done()
			})
			.catch(err => { console.error(err); throw err })
	})
	it('整数类型', done => {
		const Schema = new Collect(
			[{
				type: Number.isInteger,
				name: 'integer',
			}]
		);

		Schema.start(fs.createReadStream(path.join(__dirname, 'int.txt')))
			.then(obj => {
				should(obj.integer).equal(332)
				done()
			})
			.catch(err => { console.error(err); throw err })
	})
	it('修改默认类型', done => {
		const OldDefaultType = Collect.DefaultType;
		Collect.DefaultType = Number;
		const Schema = new Collect(
			[{
				name: 'default',
			}]
		);
		Schema.start(fs.createReadStream(path.join(__dirname, 'num.txt')))
			.then(obj => {
				should(obj.default).is.an.Number();
				should(obj.default).equal(9);

				Collect.DefaultType = OldDefaultType;
				done()
			})
			.catch(err => { console.error(err); throw err })
	})

	it('字符串类型', (done) => {
		const Schema = new Collect(
			[{
				type: String,
				name: 'useClass',
			}, {
				type: 'STRing',
				name: 'useStr',
			}, {
				type: String,
				name: 'space',
			}]
		);
		Schema.start(fs.createReadStream(path.join(__dirname, 'str.txt')))
			.then(obj => {
				should(obj.useClass).is.an.String();
				should(obj.useClass).equal('hahaha');

				should(obj.useStr).is.an.String();
				should(obj.useStr).equal('heihei');

				should(obj.space).is.an.String()
				should(obj.space).equal(' ');

				done();
			})
			.catch(err => { console.error(err); throw err })
	})
})
