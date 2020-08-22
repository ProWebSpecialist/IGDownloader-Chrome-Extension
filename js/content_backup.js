let posts = [];

let detailedPosts = [] ; 

var getPosts = function () {

    var postCollections = document.querySelectorAll('.v1Nh3.kIKUG');

  for (var item of postCollections) {
    $(item).trigger('mouseover');
    let index = posts.findIndex(post => post.postUrl === $(item).find("a").attr("href"));

    if (index < 0) {

      posts.push({

        postUrl: $(item).find("a").attr("href"),

        imgUrl: $(item).find("img").attr("src")

      });

    }

  }

  return posts;

};


async function getUserId( url ) {
  
  var userId = [];
  
  await fetch(url)
      .then(response => response.text())
      .then(response => {

        userId = response.match('<meta property="instapp:owner_user_id" content="(.*?)"');   

      })
      .catch(err => {

        console.log(err);

      })

  return userId[1] ;

}

function getUserUrl() {

  let tempUrl = getPosts() ; 

  let userUrl = tempUrl[0].postUrl ;

  return userUrl ;

}


function download_top_post() {

  let backImg = chrome.extension.getURL("icons/icon_16.png");
  let imgURL = chrome.extension.getURL("image/download1.svg"); 
  let childElement = '' ;

  childElement = '<div><div class="ext_all_popup_wrap">' ;
  childElement += '<div class="ext_dl_all_dialog" role="dialog"></div>' ;
  childElement += '<div class="hUQsm"></div>';
  childElement += '<div class="T5hFd"></div>';
  childElement += '<div class="ext_dl_all_popup_loader" style="display: none;"><span class="ext_icon"></span></div>';
  childElement += '<div class="ext_dl_all_popup" style="display: block;">';
  childElement += '<div class="ext_popup_header">Posts found on page: <br><span class="post_number">24</span></div>' ;
  childElement += '<div class="ext_popup_links_wrap"><div class="choose_count_dl_all_form">';
  childElement += '<div class="ext_form_header">Set the range</div><span>from</span>';
  childElement += '<input id="ext_dl_all_start" type="number" min="1" max="23" value="1" class="">';
  childElement += '<span>to</span><input id="ext_dl_all_end" type="number" min="2" value="24" max="24" class=""></div>';
  childElement += '<div class="ext_btn_wrap"><div class="ext_popup_dl_btn" data-count=""><span class="ext_icon" style="background-image:url(' + imgURL + ')"></span>';
  childElement += '<span class="ext_text">Download All Posts</span></div></div>';
  childElement += '<div class="ext_btn_wrap1"><div class="ext_popup_dl_btn1" data-count=""><span class="ext_icon1" style="background-image:url(' + imgURL + ')"></span>';
  childElement += '<span class="ext_text1">Download Top Posts</span></div></div></div>';
  childElement += '<div class="ext_popup_footer">Scroll down the page to download more files</div></div>';

 // console.log(childElement);
  $(".ctQZg .ZcHy5").append("<div class='XrOey'><div class='download_all_wrap'><span class='ext_tooltip download_all'>Download</span><a class='_8scx2 _gvoze ext_btn_dl_all' style='background-image:url(" + backImg + ")'></a></div></div>") ;

  $(".XrOey").append(childElement);

}

function displayPostValue() {

  let postLength = getPosts().length;

  $(".post_number").html( postLength );

  $("#ext_dl_all_end").val( postLength );

  $("#ext_dl_all_end").attr( "max", postLength) ;

  $(".ext_popup_dl_btn").attr( "data-count", postLength ) ;

}


$(window).load(function () {

  let imgURL = chrome.extension.getURL("image/download.svg");
  let downloadImage = chrome.extension.getURL("image/preloader2.gif");

  $(document).on('mouseenter', '.v1Nh3.kIKUG', function (evt) {

    var postUrl = evt.currentTarget.children[0].href;

    if ($(evt.currentTarget).find("a").length < 2) {
      
      $(evt.currentTarget).append('<a class="ext_desktop_dl_btn" type="button" data-shortcode="' + postUrl + '"><span class="ext_icon" style="background-image:url(' + imgURL + ')"></span><span class="ext_text">DOWNLOAD</span></a>');

    }

  });

  $(document).on('mouseenter', '._97aPb .ZyFrc', function (evt) {
    
    if (evt.currentTarget.children.length < 2) {

      var imgURL = chrome.extension.getURL("image/download.svg");

      $(evt.currentTarget).append('<a class="ext_desktop_dl_btn" type="button" data-shortcode="' + window.location.href + '"><span class="ext_icon" style="background-image:url(' + imgURL + ')"></span><span class="ext_text">DOWNLOAD</span></a>');

    }

  });

  $(document).on('click', "a.ext_desktop_dl_btn", function () {
    
    $(this).find(".ext_icon").css("background-image", "url(" + downloadImage + ")");

    var cur_item = $(this).find(".ext_icon");

    let postUrl = $(this).data('shortcode');

    fetch(postUrl)
      .then(response => response.text())
      .then(response => {

        let videourl = response.match('<meta property="og:video:secure_url" content="(.*?)"');
  
        let pictureurl = response.match('<meta property="og:image" content="(.*?)"');

        if (videourl) {

          location.href = videourl[1] + '&dl=1';

        } else {

          location.href = pictureurl[1] + '&dl=1';

        }

      })
      .catch(err => {

        console.log(err);

      })

    setTimeout(function () {

      cur_item.css("background-image", "url(" + imgURL + ")");

    }, 1500);

  });

  download_top_post() ;

  $("._8scx2._gvoze.ext_btn_dl_all").click( function() {
  
    $(".ext_all_popup_wrap").toggleClass("active") ;

    displayPostValue() ;
  
  }) ;

  $(".ext_dl_all_dialog").click ( function() {

    $(".ext_all_popup_wrap").toggleClass("active") ;

  })

  $(".ext_popup_dl_btn").click ( async function () {

    console.log("hello") ;

    var endCursor = '' ;
    
    let modelUserUrl = getUserUrl() ; 
   
    let modelUserId =  await getUserId( modelUserUrl ) ;
   
    var requestUrl = 'https://www.instagram.com/graphql/query/?query_hash=472f257a40c653c64c666ce877d59d2b&variables={"id":"' + modelUserId + '","first":50}' ;
   // var requestUrl = 'https://www.instagram.com/graphql/query/?query_hash=472f257a40c653c64c666ce877d59d2b&variables={"id":"21314721","first":50,"after":"QVFCTktvdUt6aUp0Vl9ZbEliUkktM3BEbUJmcjdtX2NZeVRGY0ExUTBCMFBIelFiUDRDTnFYMTdBRFZicFVCbUd0Mm9qX2NjX1pldTl1MkF1eVJxUEpiMA==" }' ;
    var i = 0;
   // while (endCursor != null) {
   while ( i < 4) {

      console.log("******************"); 

      console.log(requestUrl);

      fetch(requestUrl)

        .then(response => response.text())
        .then(response => {

          //detailedPosts

          var obj = JSON.parse(response);
          console.log("*********************");
          console.log(obj);

          var node = obj.data.user.edge_owner_to_timeline_media.edges;

          var hasNextPage = obj.data.user.edge_owner_to_timeline_media.page_info.has_next_page;

          if (hasNextPage == true)

            endCursor = obj.data.user.edge_owner_to_timeline_media.page_info.end_cursor;

          else

            endCursor = null;

          for (i = 0; i < node.length; i++) {

            detailedPosts.push({

              likesCount: node[i].node.edge_media_preview_like.count,

              commnetsCount: node[i].node.edge_media_to_comment.count,

              thumbSrc: node[i].node.thumbnail_src,

              shortCode: node[i].node.shortcode

            });

          }

          requestUrl = 'https://www.instagram.com/graphql/query/?query_hash=472f257a40c653c64c666ce877d59d2b&variables={"id":"' + modelUserId + '","first":50, "after":"' + endCursor + '"}';

          
          
          console.log(endCursor);

          console.log("******************");
          //console.log(detailedPosts);

        })
        .catch(err => {

          console.log(err);

        })

        i++;
      }

  }) ;

});

$(window).scroll(function () {
 
  let prevLength = posts.length;

  getPosts();

  if (posts.length > prevLength) {

    chrome.runtime.sendMessage({

      message: "success",

      data: posts

    }, function (response) {

      if (response)

        console.log("success");

    });

    displayPostValue() ;

  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  if (request.message == "MSG_POST")

    sendResponse({

      message: "success",

      data: getPosts(),

      data1: window.location.href

    });
});