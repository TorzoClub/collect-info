const readline = require('readline');

const throws = {
	get noStruct(){
		throw new Error('no struct')
	},
};

class Collect {
	constructor(struct = throws.noStruct){
		this.struct = struct;
		this.question = {};
	}
	start(stdin = process.stdin){
		this.rl = readline.createInterface({
			input: stdin,
			output: process.stdout,
		});

		const question = this.question;
		const struct = this.struct;
		const self = Collect;
		let cursor = 0;
		return new Promise((resolve, reject) => {

			this.rl.setPrompt(struct[cursor].prompt || `[${struct[cursor].name}]输入： `)
			this.rl.prompt();

			this.rl.on('line', line => {
				const current = struct[cursor];

				/* 配置默认类型 */
				if (current.type === undefined) {
					current.type = self.DefaultType;
				}

				if (current.type === Number.isInteger) {
					let num = Number(line.trim());
					if (!Number.isInteger(num)) {
						process.stdout.write(current.catch || '需要整数类型');
						return ;
					} else {
						++cursor;
						question[current.name] = num;
					}
				}
				else if (current.type === Number || (current.type.toLowerCase && current.type.toLowerCase() === 'number')) {
					/* process by Number */
					let num = Number(line.trim());
					if (isNaN(num)) {
						process.stdout.write(current.catch || '需要数字类型：');
						return ;
					} else {
						++cursor;
						question[current.name] = num;
					}
				}
				else {	/* 默认直接使用字符模式 */
					/* process by String */
					++cursor;
					question[current.name] = line;
				}

				if (cursor === struct.length) {
					this.rl.close();
					resolve(question)
				} else {
					this.rl.setPrompt(struct[cursor].prompt || `[${struct[cursor].name}]输入： `)
					this.rl.prompt();
				}
			})
			this.rl.on('close', () => {
				process.stdout.write('\n');
			})
		})
	}
}

Object.assign(Collect, {
	DefaultType: String,
});

module.exports = Collect;
