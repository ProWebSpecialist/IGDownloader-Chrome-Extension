let CURR_POSTS = [];
let modelUserId = null;
let authenticationKey = "viralgrowth";
var timer;
document.cookie = 'SameSite=None';

/**
 * @method getPosts
 * @description Scraps all the displayed/loaded posts
 * @returns data shortcodes and the data urls
 */
var getPosts = function () {
  //get all the posts from the explore page
  var explore = document.querySelectorAll('.pKKVh');
  if(explore.length > 0){
    for (var exp of explore) {
      var data_url;
      var shortcode = $(exp).find("a").attr("href");
      if(isNewPost(shortcode)){
        data_url = $(exp).find("img.FFVAD").attr("src");
        CURR_POSTS.push({
          post_url: shortcode,
          src_url: data_url,
        });
      }
    }
  }else {
    //get all the posts from the home page
    var articles = document.querySelectorAll('._8Rm4L.M9sTE');
    if(articles.length>0){
      for (var article of articles) {
        var data_url;
        var shortcode = $(article).find("a.c-Yi7").attr("href");
        if(isNewPost(shortcode)){
          data_url = $(article).find("img.FFVAD").attr("src");
          CURR_POSTS.push({
            post_url: shortcode,
            src_url: data_url,
          });
        }
      }
    }else{
      //get all the posts from user's profile page
      var profile = document.querySelectorAll('.v1Nh3.kIKUG');
      for (var prof of profile) {
        var data_url;
        var shortcode = $(prof).find("a").attr("href");
        if(isNewPost(shortcode)){
          data_url = $(prof).find("img.FFVAD").attr("src");
          CURR_POSTS.push({
            post_url: shortcode,
            src_url: data_url,
          });
        }
      }
    } 
  }
  return CURR_POSTS;
};

/**
 * @method isNewPost
 * @param {*} post_url
 * @returns Boolean
 */
var isNewPost = function(post_url){
  let index = CURR_POSTS.findIndex(temp => temp.post_url === post_url);
  // return (index<0) ? true: false;
  if(index < 0){
    return true;
  }else{
    return false;
  }
}

/**
 * @method displayDownloadPopUp
 * @description Append download top post popup menu to the current page
 */
function displayDownloadPopUp(){
  let backImg = chrome.extension.getURL("../icons/icon_32.png");
  let imgURL = chrome.extension.getURL("../icons/download_white.svg");
  let childElement = '';
  let downloadBtnElem = $(".XrOey1").find("#download-post-btn-element");
  let pageUrl = window.location.href;

  if (downloadBtnElem.length == 0 && pageUrl.search('/direct/inbox/')<0) {
    childElement = '<div id="download-post-btn-element"><div class="ext_all_popup_wrap1">';
    childElement += '<div class="ext_dl_all_dialog1" role="dialog"></div>';
    childElement += '<div class="hUQsm1"></div>';
    childElement += '<div class="T5hFd1"></div>';
    childElement += '<div class="ext_dl_all_popup_loader1" style="display: none;"><span class="ext_icon1"></span></div>';
    childElement += '<div class="ext_dl_all_popup1" style="display: block;">';
    childElement += '<div class="ext_popup_header1">Posts found on page: <br><span class="post_number">24</span></div>';
    childElement += '<div class="ext_popup_links_wrap1"><div class="choose_count_dl_all_form1">';
    childElement += '<div class="ext_form_header1">Range</div>';
    childElement += '<input id="ext_dl_all_start" type="number" min="1" max="23" value="1" class="">';
    childElement += '<span>to</span><input id="ext_dl_all_end" type="number" min="1" max="24" value="24" class=""></div>';
    childElement += '<div class="ext_btn_wrap1"><div class="ext_popup_dl_btn1" data-count=""><span class="ext_icon1" style="background-image:url(' + imgURL + ')"></span>';
    childElement += '<span class="ext_text1">Download All Posts</span></div></div>';
    childElement += '<div class="ext_popup_footer1">Scroll down the page to download more files</div>'
    childElement += '<div class="ext_btn_wrap2"><div class="ext_popup_dl_btn2" data-count=""><span class="ext_icon2" style="background-image:url(' + imgURL + ')"></span>';
    childElement += '<span class="ext_text2">Download Top Posts</span></div>';
    childElement += '<div class="payment_input"><div class="payment_entry">Enter authentication key</div>'
    childElement += '<input class="payment_key"></div>'
    childElement += '<div class="payment_exit">Sorry, You are not authorized.</div></div>'
    childElement += '<div class="payment_page inactive"><a href="https://www.igkit.io/authentication-key" target="_blank">Get your Authentication Key</a></div></div></div>';

    $(".ctQZg .ZcHy5").append("<div class='XrOey1'><div class='download_all_wrap1'><span class='ext_tooltip1 download_all1'>Download</span><a class='_8scx21 _gvoze1 ext_btn_dl_all1' style='background-image:url(" + backImg + ")'></a></div></div>");
    $(".ctQZg ._47KiJ").append("<div class='XrOey1'><div class='download_all_wrap1'><span class='ext_tooltip1 download_all1'>Download</span><a class='_8scx21 _gvoze1 ext_btn_dl_all1' style='background-image:url(" + backImg + ")'></a></div></div>");
  
    $(".XrOey1").append(childElement);
  }
  displayPostValue();
}

/**
 * @method displayPostValue
 * @description Displays the number for posts found in the page
 */
function displayPostValue() {
  let postLength = getPosts().length;
  $(".post_number").html(postLength);
  $("#ext_dl_all_end").val(postLength);
  $("#ext_dl_all_end").attr('value', postLength);
  $("#ext_dl_all_end").attr("max", postLength);
  $(".ext_popup_dl_btn").attr("data-count", postLength);
  $(".ext_popup_dl_btn1").attr("data-count", postLength);
}

$(window).load(function () {

  let imgURL = chrome.extension.getURL("../icons/download_black.svg");
  let downloadImage = chrome.extension.getURL("image/preloader2.gif");

  //Thumbnails for posts in user's profile
  $(document).on('mouseenter', '.v1Nh3.kIKUG', function (evt) {
    var data_shortcode = evt.currentTarget.children[0].href;
    if ($(evt.currentTarget).find("a").length < 2) {
      $(evt.currentTarget).append('<a class="ext_desktop_dl_btn" type="button" data-shortcode="' + data_shortcode + '"><span class="ext_icon"></span><span class="ext_text">DOWNLOAD</span></a>');
    }
  });

  //User's posts in home page and user's profile page
  $(document).on('mouseenter', '._97aPb', function (evt) {
    if (evt.currentTarget.children.length < 2) {
      if (window.location.href == "https://www.instagram.com/") {
        let parent = $(evt.currentTarget).closest("._8Rm4L.M9sTE").find(".eo2As ");
        let data_shortcode = $(parent).find("a.c-Yi7").attr("href");
        $(evt.currentTarget).append('<a class="ext_desktop_dl_btn" type="button" data-shortcode="' + data_shortcode + '"><span class="ext_icon"></span><span class="ext_text">DOWNLOAD</span></a>');
      }else {
        $(evt.currentTarget).append('<a class="ext_desktop_dl_btn" type="button" data-shortcode="' + window.location.href + '"><span class="ext_icon"></span><span class="ext_text">DOWNLOAD</span></a>');
      }
    }
  });
  
  $(document).on('mouseenter', '.pKKVh', function (evt) {
    if (evt.currentTarget.children[0].children.length < 2) {
      var imgURL = chrome.extension.getURL("../icons/download_black.svg");
      if (window.location.href == "https://www.instagram.com/explore/") {
        let shortcode = evt.currentTarget.children[0].children[0].href;
        if(shortcode != 'undefined'){
          $(evt.currentTarget.children[0]).append('<a class="ext_desktop_dl_btn" type="button" data-shortcode="' + shortcode + '"><span class="ext_icon"></span><span class="ext_text">DOWNLOAD</span></a>');
        }
      }
    }
  });


  /**
   * @description Handles the on download post click events
   */
  $(document).on('click', "a.ext_desktop_dl_btn", function () {
    $(this).find(".ext_icon").css("background-image", "url(" + downloadImage + ")");

    var download_url 
    var cur_item = $(this).find(".ext_icon");
    var data_shortcode = $(this).attr('data-shortcode');
  

    if(data_shortcode.search("instagram") < 0){
        download_url  = "https://www.instagram.com" + $(this).attr('data-shortcode')+"?__a=1";;
    }else if(data_shortcode.search("instagram") > 0){
      download_url  = data_shortcode+"?__a=1";
    }

    fetch(download_url)
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
      chrome.runtime.sendMessage({src_url: data_url, filename: filename, action: "downloadPost"});
    })
    .catch(err => {
      console.log(err);
    })
    setTimeout(function () {
      cur_item.css("background-image", "url(" + imgURL + ")");
    }, 1500);
  });


  $(document).on('click',"._8scx21._gvoze1.ext_btn_dl_all1", function () {
    $(".ext_all_popup_wrap1").toggleClass("active");
    if(window.location.href == "https://www.instagram.com/" || window.location.href.search("explore") > 0){
      $(".ext_btn_wrap2").addClass("inactive") ;
    }else{
      $(".ext_btn_wrap2").removeClass("inactive");
    }
    // chrome.storage.local.get(['key'], function (result) {
    //   if (!result.key)
    //     $(".payment_page").removeClass("inactive");
    //   else {
    //     $(".payment_page").addClass("inactive") ;
    //   }
    // });
    displayPostValue();
  });

  $(document).on('click',".ext_dl_all_dialog1", function () {
    $(".ext_all_popup_wrap1").toggleClass("active");
    $(".payment_input").slideUp("fast");
    $(".payment_exit").slideUp("fast");
  });

  $(document).on('change', "#ext_dl_all_end", function() {
    let curLength = parseInt($(".post_number").text()) ;
    let startLength = parseInt($("#ext_dl_all_start").val());
    if ( $(this).val() < curLength && $(this).val() >= startLength ) {
      $(".ext_popup_dl_btn1").attr("data-count", $(this).val());  
    }
    else {
      $(".ext_popup_dl_btn1").attr("data-count", curLength);
      $(this).val(curLength) ;
    }
  });

  $(document).on('change', "#ext_dl_all_start", function () { 
    let limit = parseInt( $("#ext_dl_all_end").val());
    if ($(this).val() > limit ){
      $(this).val(limit) ;
    }
    if ($(this).val() < 1 ){
      $(this).val(1);
    }

  });

  $(document).on('keypress','.payment_key', function (event) {
    if (event.which == 13) {
      if ($(this).val() == authenticationKey) {
        chrome.storage.local.set({key: $(this).val() }, function () {
          console.log('success');
        });
        $(this).closest("div").fadeOut();
      }else{
        $(".payment_exit").slideDown("slow");
      }
    }
    else {
      $(".payment_exit").slideUp("slow");
    }
  });

  /**
   * @description Handles the on download all post click events
   */
  $(document).on('click', ".ext_popup_dl_btn1", function () {
    var cur_item = $(this);
    let end = parseInt($("#ext_dl_all_end").val());
    let start = parseInt($("#ext_dl_all_start").val())-1;
    cur_item = cur_item[0].children[0];
    let png = chrome.extension.getURL("../icons/download_white.svg");
    let gif = chrome.extension.getURL("../image/preloader2.gif");
    let diff = end-start;

    $(cur_item).css("background-image","url(" + gif + ")");
    if (window.location.href.search("instagram.com") > 0) {
      let POSTS = getPosts();
      if (diff > 0 && diff <= POSTS.length){
        var ALL_POSTS = [];
        for(i=start; i<end; i++){
          ALL_POSTS.push({
            post_url: POSTS[i].post_url,
            src_url: POSTS[i].src_url,
          })
        }
        fetchPostsData(ALL_POSTS).then(function(POSTS_DATA){
          var DATA = {posts: POSTS_DATA, ig_handle: getUsernameFromWindow(window.location.pathname)};
          chrome.runtime.sendMessage({data: DATA, action: 'downloadAllPosts'})
        });
      }else{
        console.log("Illigal range, downloading all");
        fetchPostsData(POSTS).then(function(POSTS_DATA){
          var DATA = {posts: POSTS_DATA, ig_handle: getUsernameFromWindow(window.location.pathname)};
          chrome.runtime.sendMessage({data: DATA, action: 'downloadAllPosts'})
        });
      }
      setTimeout(function () {
        $(cur_item).css("background-image", "url(" + png + ")");
      }, diff * 1200 );
    }
  });

  /**
   * @method fetchPostsData
   * @description Fetch the images or videos from the give data shortcodes
   * @param {*} POSTS 
   * @returns Posts Data
   */

  async function fetchPostsData(POSTS){
    var POSTS_DATA = [];
    for(i=0;i<POSTS.length; i++){
      var url = POSTS[i].post_url;
      //fix condition
      if(url.search("/p")<0){
        url = "/p/" + url + "/";
      }

      if(url.search("instagram") < 0){
        url  = "https://www.instagram.com" + url + "?__a=1";
      }else{
        url = url +"?__a=1";
      }
      await fetch(url)
      .then(response=>response.json())
      .then(response=>{
        var username = response.graphql.shortcode_media.owner.username;
        var data_url = "";
        if(response.graphql.shortcode_media.is_video){
          data_url = response.graphql.shortcode_media.video_url;
        }else{
          data_url = response.graphql.shortcode_media.display_resources[2].src;
        }
  
        var filename = username.concat("_", getFilename(data_url));
        POSTS_DATA.push({
          filename: filename,
          src_url: data_url,
        });
      })
      .catch(err=> {
        console.log(err, ": failed to fetch");
      });
    }
    return POSTS_DATA;
  }

  /**
   * @description handles on download top posts click event
   * @method downloadTopPosts
   */
  $(document).on('click', ".ext_popup_dl_btn2", function () {
    // chrome.storage.local.get(['key'], function (result) {
    //   if (!result.key){
    //     $(".payment_input").slideDown("slow");
    //   }else {
        
    //   }
    // });
    var cur_item = $(this)[0].children[0];
    let png = chrome.extension.getURL("../icons/download_white.svg");
    let gif = chrome.extension.getURL("../image/preloader2.gif");
    $(cur_item).css("background-image", "url(" + gif + ")");

    var ig_handle = getUsernameFromWindow(window.location.pathname);
    baseUrl = 'https://www.instagram.com/'+ ig_handle +'/?__a=1'

    var INIT_POSTS_DATA = getInitPosts(baseUrl);

    INIT_POSTS_DATA.then(function(data){
      var count = data[1] - data[2].length; // Total number of posts - feteched posts
      if(count > 30){
        count = 30; //get the next 30 posts
        var newURL = 'https://www.instagram.com/graphql/query/?query_id=17888483320059182&variables={"id":"'+data[0]+'","first":'+count+',"after":"'+data[3][0].cursor+'"}';
        return getAllPosts(data[2], newURL);
      }else{
        return data[2];
      }
    }).then(ALL_POSTS=>{
      var TOP_POSTS = getTopPosts(ALL_POSTS);
      fetchPostsData(TOP_POSTS).then(POSTS_DATA=>{
        var DATA = {top_posts: POSTS_DATA, ig_handle: ig_handle};
        chrome.runtime.sendMessage({data: DATA, action: 'downloadTopPosts'})
      });
    }).catch(err=>{
      console.log(err);
    });
    setTimeout(function () {
      $(cur_item).css("background-image", "url(" + png + ")");
    }, 3500);

  });
});

/**
 * @description Select the top posts from all the fetched posts
 * @param {*} ALL_POSTS 
 * @returns TOP_POSTS
 */
function getTopPosts(ALL_POSTS){
  var temp = [];

  for (let index = 0; index < ALL_POSTS.length; index++) {
    temp[index] = ALL_POSTS[index].likes;
  }

  const sum = temp.reduce(function(total,value) {
    return total + value;
  }, 0);

  var limit = Math.round((sum/temp.length)*1.2);
  var TOP_POSTS = ALL_POSTS.filter(isLargerThan(limit));

  return TOP_POSTS;
}

function isLargerThan(value) {
  return function(element, index, array) {
    return (element.likes >= value);
  }
}

/**
 * @method getAllPosts
 * @description Fetch all the posts from a users page
 * @param {*} INITDATA The first 15 posts
 * @param {*} downloadUrl The query for the next 30 posts
 * @returns ALL_POSTS
 */
async function getAllPosts(INITDATA, downloadUrl){
    var POSTS_DATA = [];
    await fetch(downloadUrl)
      .then(response => response.json())
      .then(response => {
        var edges = response.data.user.edge_owner_to_timeline_media.edges;
        for (i = 0; i < edges.length; i++) {
            POSTS_DATA[i] = {post_url:edges[i].node.shortcode,likes:edges[i].node.edge_media_preview_like.count};
        }
      }).catch(err => {
        console.log(err);
      })
      for (let index = 0; index < POSTS_DATA.length; index++) {
        INITDATA.push(POSTS_DATA[index]);
      }
      return INITDATA;
}

/**
 * @method getInitPosts
 * @description Fetch the first 15 posts from a users page
 * @param {*} downloadUrl 
 * @returns Initial posts
 */
async function getInitPosts(downloadUrl){
  var POSTS_DATA = [];
  var FLAGS = [];
  var next; 
  var cursor;
  var user_id;
  var total_posts;
  await fetch(downloadUrl)
    .then(response => response.json())
    .then(response => {
      user_id = response.graphql.user.id;
      total_posts = response.graphql.user.edge_owner_to_timeline_media.count;
      var edges = response.graphql.user.edge_owner_to_timeline_media.edges;
      for (i = 0; i < edges.length; i++) {
          POSTS_DATA[i] = {post_url:edges[i].node.shortcode,likes:edges[i].node.edge_media_preview_like.count};
      }
      var page_info = response.graphql.user.edge_owner_to_timeline_media.page_info;
      if(page_info.has_next_page){
        next= page_info.has_next_page;
        cursor = page_info.end_cursor;
      }else{
        next = false;
        cursor = "null";
      }
      FLAGS = [
        {has_next_page: next, cursor: cursor}
      ];
    }).catch(err => {
      console.log(err);
    })
    var DATA = [];
    DATA[0]= user_id;
    DATA[1]= total_posts;
    DATA[2]= POSTS_DATA;
    DATA[3]= FLAGS;
  return DATA;
}

/**
 * @method getFilename
 * @description Creates the name of the file to be downloaded 
 * @param {*} bgUrl 
 * @returns Filename
 */
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

/**
 * Get the ig handle from the window url
 * @param {*} filepath 
 */
function getUsernameFromWindow(filepath){
  if(filepath == "/"){
    return "igkit";
  }else{
    return filepath.split('/')[1];
  }
}

$(window).scroll(function () {
  if(timer) {
    window.clearTimeout(timer);
	}
	timer = window.setTimeout(function() {
    let prevLength = CURR_POSTS.length;
    
    getPosts();
    if (CURR_POSTS.length > prevLength) {
      chrome.runtime.sendMessage({ message: "success", data: CURR_POSTS}, function (response) {
        if (response){
          console.log("success");
        }
      });
      displayPostValue();
    }
	}, 100);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'MSG_URL_CHANGE') {
    CURR_POSTS = [];
    getPosts();
    displayDownloadPopUp();
  }
  if (request.message == "MSG_POST")
  sendResponse({
    message: "success",
    data: getPosts(),
    url: window.location.href
  });
});


