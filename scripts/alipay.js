var fs = require('fs');



var j = {
  compileType: 'miniprogram',
  component2: true,
  axmlStrictCheck: true,
  enableAppxNg: true,
};

var p = './dist/alipay/mini.project.json'

fs.writeFile(p , JSON.stringify(j), function (err) {
  if (err) {
    return console.log(err);
  }
  console.log('The file was saved!');
});
