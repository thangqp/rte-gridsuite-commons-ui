export const isIntegerNumber = (val) => {
    return /^-?[0-9]*$/.test(val);
};

// litmit the exponential part to two digits and <= 20 ([0-9]|1[0-9]|20)?
export const isFloatNumber = (val) => {
    return /^-?[0-9]*[.,]?[0-9]*([eE][-+]?([0-9]|1[0-9]|20)?)?$/.test(val);
};
