$(window).load(function () {
  document.cookie = 'SameSite=None';

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: "MSG_POST" }, function (response) {
      var content_data = [];
      var url;
      var itemContainer = $(".download_item_container");
      if (response) {
        content_data = cleanContent(response.data);
        url = response.url;
        console.log(content_data);
        if (content_data.length) {
          setDownloadContainer(content_data, itemContainer)
          $("body").on("click", ".download_item_icon", downloadMedia)
        }else if (url.indexOf("https://www.instagram.com/") >= 0 && content_data.length == 0) {
          $(".download_item_container").empty();
          if (!$(".instagram").hasClass("inactive"))
            $(".instagram").addClass("inactive");
          if (!$(".links_not_found").hasClass("inactive"))
            $(".links_not_found").addClass("inactive");
          setTimeout(function () {
            if (!$(".loader").hasClass("inactive"))
              $(".loader").addClass("inactive");
            $(".links_not_found").removeClass("inactive");
          }, 1500);
        }
      }
      else {
        console.log("other");
        $(".download_item_container").empty();
        if ($(".instagram").hasClass("inactive"))
          $(".instagram").removeClass("inactive")
        if (!$(".links_not_found").hasClass("inactive"))
          $(".links_not_found").addClass("inactive");
        if (!$(".loader").hasClass("inactive"))
          $(".loader").addClass("inactive");
      }
    });
  });

  function cleanContent(content_data){
    temp = [];
    index =0;
    for (let i =0; i< content_data.length;i++) {
      if(typeof content_data[i].src_url != "undefined"){
        temp[index] = content_data[i];
        index++;
      }
    }
    return temp;
  }

  function setDownloadContainer(content_data, itemContainer){
    itemContainer.empty();

    $(".instagram").addClass("inactive");
    $(".loader").addClass("inactive");
    $(".links_not_found").addClass("inactive");
    
    for (i = 0; i < content_data.length; i++) {
      itemContainer.append("<div class='download_item photo mini_size'>");
    }
    var eachItem = $(".download_item");
    eachItem.append("<div class='download_item_overlay'></div><div class='download_item_icon'></div>");
    for (i = 0; i < content_data.length; i++) {          
      const temp = eachItem.eq(i).find(".download_item_icon");
      temp.attr("data-shortcode", content_data[i].post_url);
      var thumbnail = document.createElement("img");
      thumbnail.setAttribute("src", content_data[i].src_url);
      thumbnail.setAttribute("width","100%");
      thumbnail.setAttribute("height","100%");
      eachItem.eq(i).append(thumbnail);
    }
  }

  function downloadMedia() {
    var content = $(this);
    var downloadUrl = "https://www.instagram.com" + content.attr("data-shortcode") + "?__a=1";

    content.css("background-image", "url(../image/preloader2.gif)");
    var curItem = $(this);

    fetch(downloadUrl)
    .then(response => response.json())
    .then(response => {
      var username = response.graphql.shortcode_media.owner.username;
      var data_url = "";
      if(response.graphql.shortcode_media.is_video){
        data_url = response.graphql.shortcode_media.video_url;
      }else{
        data_url = response.graphql.shortcode_media.display_resources[2].src;
      }
      var filename = username.concat("_", getFilename(data_url));
      chrome.runtime.sendMessage({src_url: data_url, filename: filename,action: "downloadPost"});
    })
    .catch(err => {
      console.log(err);
    })
    setTimeout(function () {curItem.css("background-image", "url(../image/download_big.png)")}, 1500);
  }

  function getFilename(url){
    var tokens = url.split("/");
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
});
