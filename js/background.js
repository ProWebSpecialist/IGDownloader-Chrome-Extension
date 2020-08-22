// Load the current saved data
var data = JSON.parse( localStorage.getItem( "data" ) || "{}" );

chrome.runtime.onConnect.addListener(port => {
  console.log('connected ', port); if (port.name === 'hi') {
    port.onMessage.addListener(this.processMessage);
  }
});

chrome.tabs.onUpdated.addListener(
  function (tabId, changeInfo, tab) {
    var url = tab.url;
    if (url !== undefined && changeInfo.status == "complete") {
      chrome.tabs.sendMessage(tabId, {
        message: 'MSG_URL_CHANGE',
        url: changeInfo.url
      });
    }
  }
);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == 'downloadPost') {
    chrome.downloads.download({
      url: request.src_url,
      filename: request.filename
    });
  } else if(request.action == 'downloadAllPosts'){
    downloadAllPosts(request.data)
  }else if(request.action == 'downloadTopPosts'){
    downloadTopPosts(request.data);
  }
});

async function downloadTopPosts(posts){
  var ig_handle = posts.ig_handle;
  var TOP_POSTS = posts.top_posts;

  var zip = new JSZip();
  var filename =  ig_handle.concat("_",getTimeStamp(),".zip");
  TOP_POSTS.forEach(element => {
    if(typeof element.src_url != "undefined"){
      zip.file(getFilename(element.src_url), getImgData(element.src_url), { binary: true });
    }
  });
  zip.generateAsync({type:"blob"})
  .then(function callback(blob) {
      saveAs(blob, filename);
  });

}

async function downloadAllPosts(posts){
  var prefix = posts.ig_handle;
  var ALL_POSTS = posts.posts;
  var zip = new JSZip();
  var filename =  prefix.concat("_",getTimeStamp(),".zip");
  ALL_POSTS.forEach(element => {
    if(typeof element.src_url != "undefined"){
      zip.file(element.filename, getImgData(element.src_url), { binary: true });
    }
  });
  zip.generateAsync({type:"blob"})
  .then(function callback(blob) {
      saveAs(blob, filename);
  });
}


function getTimeStamp(){
  var dateObj = new Date();
  var stamp = "";
  stamp = stamp.concat(
  dateObj.getFullYear(),"_",
  (dateObj.getMonth() + 1),"_",
  dateObj.getDate(), "_" ,
  dateObj.getHours(),"_", 
  dateObj.getMinutes()
  );
  return stamp;
}

function getImgData(url) {
  return new Promise(function(resolve, reject) {
      JSZipUtils.getBinaryContent(url, function (err, data) {
          if(err) {
              reject(err);
          } else {
              resolve(data);
          }
      });
  });
}


function getFilename(bgUrl){
  var tokens = bgUrl.split("/");
  for (let i = 0; i < tokens.length; i++) {
    if(tokens[i].includes(".jpg")){
      var n = tokens[i].indexOf(".jpg");
      var f = tokens[i].slice(0,n);
      return f.concat(".jpg");
    }else if(tokens[i].includes(".mp4")){
      var n = tokens[i].indexOf(".mp4");
      var f = tokens[i].slice(0,n);
      return f.concat(".mp4");
    }
  }
}

function getUsername(response){ 
  var n = response.lastIndexOf("username");
  var username = response.slice(n,(n + 64));
  var x = username.indexOf(":");
  username = username.slice((x+1),(x+33));
  return username.match(/"(.*?)"/g)[0].replace(/"/g, "");
}
