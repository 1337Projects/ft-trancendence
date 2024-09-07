export default class ParchmentError extends Error {
    message: string;
    name: string;
    stack: string;
    constructor(message: string);
}
