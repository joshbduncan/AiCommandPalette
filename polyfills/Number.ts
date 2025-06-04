interface Number {
	toRadians(): number;
	toDegrees(): number;
	padZero(decimals: number): string;
}

Number.prototype.toRadians = function () {
	return this * (Math.PI / 180);
};
Number.prototype.toDegrees = function () {
	return this * (180 / Math.PI);
};

Number.prototype.padZero = function (decimals) {
	if (typeof decimals == "undefined") {
		decimals = 2;
	}
	let numStr = this.toString();
	let decimalsFound = numStr.length;
	if (decimalsFound >= decimals) {
		return this;
	}
	while (decimalsFound < decimals) {
		numStr = '0' + numStr;
		decimalsFound += 1;
	}
	return numStr;
};

function round2 (num: number): number {
	return Math.round(num * 100) / 100;
}