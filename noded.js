var http = require('http'),
  fs = require('fs'),
  spawn = require('child_process').spawn;

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
      var nodedReq = JSON.parse(postData.join(''));

      var complete = function(err) {
        res.end(JSON.stringify({
          result: err ? 'FAILURE' : 'SUCCESS',
          msg: err
        }));
      }

      /*
      if (nodedReq.type == 'commit') {
        if (nodedReq)

        // commit the file with GIT
        var gitAdd = spawn('git', ['add', saveData.path], { cwd: process.cwd() });
        var addErr = '';
        gitAdd.stdout.on('data', function(data) {
          addErr = data + '';
        });
        gitAdd.on('exit', function(code) {
          console.log('Added with code: ' + code);
          if (addErr)
            return complete(addErr);

          var gitCommit = spawn('git', ['commit', '-m', '"Noded auto commit "']);
          gitCommit.stdout.on('data', function(data) {
          });
          gitCommit.on('exit', function(code) {
            console.log('Commited with code: ' + code);
          });
        });
      }
      else */if (nodedReq.type == 'save') {
        if (!nodedReq.path)
          return complete('No save path specified.');

        if (nodedReq.path.substr(0, 1) == '.' || nodedReq.path.substr(0, 1) == '/')
          return complete('Path located outside of project folder.');

        fs.writeFile(nodedReq.path, nodedReq.data, function(err) {
          if (err)
            return complete(err);
          
          // commit the file with GIT
          /*
          var gitAdd = spawn('git', ['add', saveData.path], { cwd: process.cwd() });
          var addErr = '';
          gitAdd.stdout.on('data', function(data) {
            addErr = data + '';
          });
          gitAdd.on('exit', function(code) {
            console.log('Added with code: ' + code);
            if (addErr)
              return complete(addErr);

            var gitCommit = spawn('git', ['commit', '-m', '"Noded auto commit "']);
            gitCommit.stdout.on('data', function(data) {
            });
            gitCommit.on('exit', function(code) {
              console.log('Commited with code: ' + code);
            });
          });
          */
          complete();
        });
      }
      else
        complete('No action type specified.')
    });

  }).listen(port);
}

