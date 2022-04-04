const toMonetaryNumber = function (num: number) {
    var pow = Math.pow(10, 2);
    return Math.round(num * pow) / pow;
}

export default { toMonetaryNumber }