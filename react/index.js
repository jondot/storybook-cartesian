'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var styled = _interopDefault(require('styled-components'));

const Container = styled.div `
  font-size: 10px;
  font-family: 'Helvetica', sans-serif;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
`;
const Item = styled.div `
  border: 1px solid #f0f0f0;
  padding: 4px;
  flex-direction: column;
`;
const Title = styled.div `
  color: #a8a8a8;
`;
const Subject = styled('div') `
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-width: ${({ size: { width } }) => width}px;
  min-height: ${({ size: { height } }) => height}px;
`;
const Tiles = ({ items, size = { width: 200, height: 150 }, className }) => (React.createElement(Container, { className: className }, items.map((c) => (React.createElement(Item, null,
    React.createElement(Title, null, c.title),
    React.createElement(Subject, { size: size }, c.story))))));
const Rows = styled(Tiles) `
  flex-direction: column;
`;
const applyWith = (title, Komponent) => (stories, candidates) => {
    stories.add(title, () => React.createElement(Komponent, { items: candidates }));
};

exports.Tiles = Tiles;
exports.Rows = Rows;
exports.applyWith = applyWith;
//# sourceMappingURL=index.js.map
