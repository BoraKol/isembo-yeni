const ejs = require("ejs");
const fs = require("fs");

function ejs2html(options) {
  ejs.renderFile(options.path, options.data, options, (err, html) => {
    if (err) {
      console.log(err);
      return false;
    }
    fs.writeFile(options.outPath, html, function(err) {
      if (err) {
        console.log(err);
        return false;
      }
      return true;
    });
  });
}

// Example usage
ejs2html({
  path: `${__dirname}/views/index.ejs`,
  outPath: `${__dirname}/public/index.html`
});