export const isIntegerNumber = (val) => {
    return /^-?[0-9]*$/.test(val);
};

export const isFloatNumber = (val) => {
    return /^-?[0-9]*[.,]?[0-9]*([eE][-+]?[0-9]*)?$/.test(val);
};
