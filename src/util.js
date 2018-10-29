export const checkMandatory = (obj, fields) => {
    fields.forEach(element => {
        if (!obj[element]) throw new Error(`ERROR: ${element} is mandatory.`);
    });
};

export const getLogger = enabled => {
    return enabled ? console.log : () => {};
};
