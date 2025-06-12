export const textsCounter = (text) => {
    if (text.length > 100) {
        return `${text.substring(0, 200)}...`;
    }
    return text;
};