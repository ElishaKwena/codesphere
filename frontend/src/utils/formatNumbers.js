export const formatSocialNumber = (num) => {
  if (num >= 1000000) {
    const millions = num / 1000000;
    return `${millions % 1 === 0 ? millions : millions.toFixed(1)}M`;
  }
  if (num >= 1000) {
    const thousands = num / 1000;
    return `${thousands % 1 === 0 ? thousands : thousands.toFixed(1)}K`;
  }
  return num.toString();
};