export const increment = (function (n) {
    return function () {
        n += 1;
        return n;
    };
})(0);
