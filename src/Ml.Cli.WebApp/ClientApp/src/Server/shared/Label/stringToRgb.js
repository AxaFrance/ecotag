const intToRGB = i => {
  const c = (i & 0x00ffffff).toString(16).toUpperCase();
  return '00000'.substring(0, 6 - c.length) + c;
};

const stringToRGB = () => intToRGB(Math.floor(Math.random() * Math.floor(99999999)).toString());

export default stringToRGB;
