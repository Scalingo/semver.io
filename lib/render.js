var marked = require('marked');
var rfs = require('fs').readFileSync;

marked.setOptions({
  gfm: true,
  highlight: function(code, lang) {
    const hljs = require('highlight.js');
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }
});

var layout = rfs('./public/layout.html').toString();
var readme = rfs('./README.md').toString();

module.exports = function render(resolvers, callback) {
  marked.parse(readme, injectIntoLayout);

  function injectIntoLayout(err, content) {
    if (err) {
      throw err;
    }
    callback(undefined, layout.replace('{{content}}', content));
  }
}
