const COLOR = [
  '#D0F5A9',
  '#00ffa2',
  '#90cfee',
  '#b0fba4',
  '#f29acf',
  '#8dadbd',
  '#b09ba2',
  '#e54747',
  '#00c5ec',
  '#6083ff',
  '#f6ed93',
  '#f0904e',
  '#a7abb0',
  '#c15b5b',
  '#008194',
  '#D0F5A9',
];

export const setLabelsColor = labels => {
  const labelsProcessed = [];
  labels.map(label => {
    const color = label.color || COLOR[label.id] || '#ffe184';
    labelsProcessed.push({
      ...label,
      color,
    });
  });
  return labelsProcessed;
};
