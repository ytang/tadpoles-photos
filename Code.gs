function doGet(e) {
  var lic1 = 'MIT License';
  var lic2 = 'Copyright (c) 2019 Yang Tang';
  var lic3 = 'Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:';
  var lic4 = 'The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.';
  var lic5 = 'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.';
  var license = '<p>' + lic1 + '</p><p>' + lic2 + '</p><p>' + lic3 + '</p><p>' + lic4 + '</p><p>' + lic5 + '</p>';
  var folders = DriveApp.getFoldersByName('Tadpoles');
  if (folders.hasNext()) {
    var folder = folders.next();
  } else {
    var folder = DriveApp.createFolder('Tadpoles');
  }
  var ret = '<h1><a href="' + folder.getUrl() + '" target="_blank">Your photos are here.</a></h1>' + license;
  var threads = GmailApp.search('Daily Report from:updates@tadpoles.com');
  for (var i = 0; i < threads.length; i++) {
    var lines = threads[i].getMessages()[0].getPlainBody().split('\n');
    for (var j = 0; j < lines.length; j++) {
      var matches = lines[j].match('(\\w+)\\s+DAILY REPORT - (.+)');
      if (matches) {
        var name = matches[1];
        var date = matches[2];
        var subfolders = folder.getFoldersByName(date);
        if (subfolders.hasNext()) {
          return HtmlService.createHtmlOutput(ret);
        } else {
          var subfolder = folder.createFolder(date);
        }
      }
      matches = lines[j].match('<(https:\\/\\/www.tadpoles.com\\/m\\/p\\/.+)>');
      if (matches) {
        var file = subfolder.createFile(UrlFetchApp.fetch(matches[1] + '?d=t').getBlob());
        file.setName(name + ' - ' + date + ' - ' + file.getName());
      }
    }
  }
  return HtmlService.createHtmlOutput('All photos have been stored <a href="' + folder.getUrl() + '">here</a>.' + license);
}
