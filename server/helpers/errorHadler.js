module.exports = (next) => {
    return (err, result) => {
        if (err) {
            throw new Error(err);
        }
        return next(result);
    };
};