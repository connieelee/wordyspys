// ID generator - curtesy of: https://gist.github.com/gordonbrander/2230317
const ID = () => Math.random().toString(36).substr(2, 7);

module.exports = {
  ID,
};
