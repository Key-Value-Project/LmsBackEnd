// Utility function to capitalize the first letter of each word
const CapitalizeWords = (string: string) => {
    return string
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

export default CapitalizeWords;
