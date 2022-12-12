const hexToRGB = hex => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

export const adaptTextColorToBackgroundColor = backgroundColorHex => {
    const rgbValue = hexToRGB(backgroundColorHex);
    return (rgbValue.r * 299 + rgbValue.g * 587 + rgbValue.b * 114) / 1000 > 125 ? '#000000' : '#ffffff';
};