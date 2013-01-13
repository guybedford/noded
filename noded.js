var http = require('http'),
  fs = require('fs');

exports.createEditServer = function(port) {
  http.createServer(function(req, res) {
    if (req.method != 'POST')
      return;

    var postData = [];
    req.on('data', function(chunk) {
      postData.push(chunk);
      if (postData.length > 1e4) {
        res.writeHead(413, {'Content-Type': 'text/html'});
        req.connection.destroy();
      }
    });

    req.on('end', function() {
      var saveData = JSON.parse(postData.join(''));

      var complete = function(err) {
        res.end(JSON.stringify({
          result: err ? 'FAILURE' : 'SUCCESS',
          msg: err
        }));
      }

      if (saveData.path) {
        if (saveData.path.substr(0, 1) != '.' && saveData.path.substr(0, 1) != '/') {
          fs.writeFile(saveData.path, saveData.data, function(err) {
            complete(err);
          });
        }
        else
          complete('Path located outside of project folder.');
      }
      else
        complete('No file path specified!');
    });

  }).listen(port);
}

