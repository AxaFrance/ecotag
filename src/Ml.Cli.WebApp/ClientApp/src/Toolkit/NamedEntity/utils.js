import _ from 'lodash';

const sortBy = _.sortBy;

export const getSubToken = (text, start, end) => {
  const reg2 = /[0-9]+|[A-Za-z_-\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff]+|\s+|[^\s\w]+/g;

  const rootTokens = text.match(reg2);
  const subText = text.slice(start, end);

  const tokens = subText.match(reg2);
  if (tokens && rootTokens) {
    const cleanTokens = tokens.filter(t => !_.includes(t, ' '));

    const counstSpaceWordtable = [];
    const firstWordTable = [0];
    rootTokens.map((word, index) => {
      let countSpace = 0;
      let countFirst = 0;

      if (index !== 0) {
        countSpace = counstSpaceWordtable[index - 1];
        countFirst = firstWordTable[index];
      }
      let wordCount = word.length || 1;
      let isSpaceExist = _.includes(word, ' ') ? 1 : 0;
      counstSpaceWordtable.push(countSpace + isSpaceExist);
      firstWordTable.push(countFirst + wordCount);
    });

    const index_start_Data = firstWordTable.indexOf(start);
    const start_index = index_start_Data - counstSpaceWordtable[index_start_Data];
    const end_index = start_index + cleanTokens.length;
    return { tokens: cleanTokens, subText, start_index, end_index };
  }
  return { tokens: [], subText, start_index: 0, end_index: 0 };
};

export const generateTextToken = text => {
  const tokenIndex = [];
  const tokenIndexLast = [];
  const tokenData = [];
  const data = [];
  const regex = /[0-9]+|[A-Za-z_-\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff]+|\s+|([^\s\w]|[_])+/g;
  let match;
  let index = 0;
  while ((match = regex.exec(text)) != null) {
    const word = match[0];
    if (!_.includes(word, ' ')) {
      tokenIndex.push(match.index);
      const lastIndex = match.index + word.length;
      tokenIndexLast.push(lastIndex);
      tokenData.push(word);
      data.push({
        word: word,
        start: match.index,
        end: lastIndex,
        index,
      });
      index++;
    }
  }
  return { tokenData, tokenIndex, tokenIndexLast, data };
};

export const splitTokensWithOffsets = ({ text, tokenData, tokenIndex, tokenIndexLast }, offsets) => {
  let lastEnd = 0;
  const splits = [];
  for (let offset of sortBy(offsets, o => o.start)) {
    const { start, end } = offset;
    const { tokens, end_index, start_index } = getSubToken(text, start, end);

    if (lastEnd < start_index) {
      for (let i = lastEnd; i < start_index; i++) {
        splits.push({
          i,
          content: tokenData[i],
          start: tokenIndex[i],
          end: tokenIndexLast[i],
        });
      }
    }
    splits.push({
      ...offset,
      mark: true,
      content: tokens,
    });
    lastEnd = end_index;
  }

  for (let i = lastEnd; i < tokenData.length; i++) {
    splits.push({
      i,
      content: tokenData[i],
      start: tokenIndex[i],
      end: tokenIndexLast[i],
    });
  }

  return splits;
};

export const selectionIsEmpty = selection => {
  let position = selection.anchorNode.compareDocumentPosition(selection.focusNode);

  return position === 0 && selection.focusOffset === selection.anchorOffset;
};

export const selectionIsBackwards = selection => {
  if (selectionIsEmpty(selection)) return false;

  let position = selection.anchorNode.compareDocumentPosition(selection.focusNode);

  let backward = false;
  if ((!position && selection.anchorOffset > selection.focusOffset) || position === Node.DOCUMENT_POSITION_PRECEDING)
    backward = true;

  return backward;
};
