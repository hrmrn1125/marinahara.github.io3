/* eslint-disable prefer-const */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import $ from 'jquery'
import router from './modules/Router'
import '../scss/app.scss'
import slick from 'slick-carousel';

$(() => {
  new router()

  const hoge = 'hoge'
  console.log(hoge)
})

/* ============================================================
header
============================================================ */
//SP
//＜ハンバーガーメニュ→×＞切り替え
$(() => {
  $(".l-header-sp__menuTrigger").click(function() {
    $(this).toggleClass('active');
    return false;
  });
//SPメニューフェードイン
  $(".l-header-sp__menuTrigger").click(() => {
    $(".p-header-sp").fadeToggle(500);
  });
//SPメニューアコーディオン
  $(".p-header-sp__index").click(function() {
    $(this).next().slideToggle();
    $(this).toggleClass("active");
  });
});


//PC
//ヘッダーを縮小する
$(window).on('scroll', function () {
  if ($(this).scrollTop() > 0) {
    $('.l-header-pc').addClass('shrink');
  } else {
    $('.l-header-pc').removeClass('shrink');
  }
});

//search開閉
$(() => {
  $(".l-header-pc__searchIcon").click(() => {
    $(".l-header-pc .p-header-sp__searchBox").toggleClass('open');
    return false;
  });
});

//入力内容削除ボタン
$(() => {
  $(document).ready(() => {
    $('.l-header-pc .p-header-sp__searchBox form').addClass('empty');
    $('.l-header-pc .p-header-sp__searchBox form').append('<span class="l-header-pc__delete"></span>');
    //削除ボタン押下時
    $('.l-header-pc__delete').click(function(e) {
      const input = $(this).siblings('.l-header-pc__searchInput');
      input.val('');
      $(this).parent('form').addClass('empty');
      e.stopPropagation();
    });
    //テキストボックス入力時
    $('.l-header-pc__searchInput').keyup(function(e) {
      const input = $(this);
      if (input.val() === '' || input.val() === null)  {
        $(this).parent('form').addClass('empty');
      }
      else{
        $(this).parent('form').removeClass('empty');
      }
    });
  });
});

/* ============================================================
header メニュー（クリックバージョン）
============================================================ */
$(() => {
  const dd_btn = $(".l-header-pc__navIndex");
  if(dd_btn.length > 0){
    //ドロップダウンボタンクリック時
    dd_btn.on("click",function(e){

      const parent = $(this);

      if($(this).hasClass("selected")){
        parent.removeClass("selected");
      }
      else{
        dd_btn.removeClass("selected");
        parent.addClass("selected");
      }

      changeDisplay(parent);
      e.stopPropagation();
    });

    //ドロップダウンボタン以外クリック時
    $("body,.l-header-pc__subClose").on("click",() => {
      dd_btn.removeClass("selected");
      changeDisplay();
    });

    function changeDisplay(parent){
      $(".l-header-pc__subNav").removeClass("active");
      if(parent && parent.hasClass("selected")){
        parent.next(".l-header-pc__subNav").addClass("active");
      }
    }
  }
});


/* ============================================================
header navアンダーライン移動
============================================================ */
const j$ = jQuery,
    $nav = j$(".l-header-pc__navInner"),
    $slideLine = j$(".l-header-pc__textLine"),
    $currentItem = j$(".l-header-pc__nav .current");

j$(() => {
  if ($currentItem[0]) {
    $slideLine.css({
      "width": $currentItem.width() + 20,
      "left": $currentItem.position().left
    });
  }
  j$($nav).find(".l-header-pc__navIndex").hover(
    // Hover on
    function(){
      $slideLine.css({
        "width": j$(this).width() + 20,
        "left": j$(this).position().left
      });
    },
    // Hover out
    () => {
      if ($currentItem[0]) {
        $slideLine.css({
          "width": $currentItem.width() + 20,
          "left": $currentItem.position().left
        });
      } else {
        $slideLine.width(0);
      }
    }
  );
});


/* ============================================================
メイン Slider
============================================================ */
let $main_slider = $('.p-main__slider'),
    $main_slider_li = $('.p-main__slider li'),
    $main_indicator = $('.p-main__sliderDots'),
    slider_count = $main_slider_li.length,
    current_num = 0,
    indicator_html = "",
    slide_timer = "",
    windowSm = 768,
    windowWidth = $(window).outerWidth();

$(document).ready(() => {
  $main_slider.each(() => {

    for(let i = 0; i < slider_count; i++){
      indicator_html += "<li></li>";
    }
    $main_indicator.html(indicator_html);
    slide_initialize();
  });

  $main_indicator.find('li').on('click',function(){
    if(!$(this).hasClass('active')){
      const num = $(this).index();
      slide_fade(num);
    }
  });

  $main_indicator.find('li').on({
    mouseenter:stop_slide,
    mouseleave:start_slide
  });
});

$(window).on('load resize', () => {
  windowWidth = $(window).outerWidth();
  slide_initialize();
});

function slide_initialize(){
  if (windowWidth > windowSm) {
    //横スライダーが機能していれば解除する
    if($main_slider.hasClass('slick-initialized')){
      $('.p-main__slider').slick('unslick');
    }

    //PCのフェードインアウトアニメーション スタート
    if(!slide_timer){
      slide_fade(current_num);
      start_slide();
    }
  }

	//スマホの条件開始
  else{
    if(slide_timer){
      stop_slide();
      $main_slider_li.css('opacity','');
      $main_slider_li.css('zIndex','');
    }
    if(!$main_slider.hasClass('slick-initialized')){
		$main_slider.slick({
			infinite: true,
			autoplay: true,
			dots: true,
			arrows: false,
			pauseOnHover: false,
			centerMode: false,
			slidesToScroll: 1,
			slidesToShow: 1,
			autoplaySpeed: 5000,
		})
			.on("afterChange", function(event, slick, current_num) {
			switch (current_num){
				case 0:// 1枚目のスライドの秒数は3.5秒
					$(this).slick("slickSetOption", "autoplaySpeed", 3500);
					break;
				default://その他のスライドの秒数は5秒
					$(this).slick("slickSetOption", "autoplaySpeed", 5000);
					break;
			}
		});
	}
  }
}

function slide_fade(num){
	$(`.p-main__slider li:eq(${num})`).stop().animate({
		zIndex: 1,
		opacity: 1
	},4000);
	$(`.p-main__slider li:not(:eq(${num}))`).stop().animate({
		zIndex: 0,
		opacity: 0
	},4000);
	$(`.p-main__sliderDots li:eq(${num})`).addClass('active');
	$(`.p-main__sliderDots li:not(:eq(${num}))`).removeClass('active');

	current_num = ( num +1 ) % slider_count;
}

function start_slide(){
	slide_timer = setInterval(() => {
		slide_fade(current_num);
	},7000);
}

function stop_slide(){
	clearInterval(slide_timer);
  slide_timer = "";
}


/* ============================================================
PC pageTop
============================================================ */
$(() => {
  $('a[href^="#"]').click(function(){
    let speed = 800;
    let href= $(this).attr("href");
    let target = $(href === "#" || href === "" ? 'html' : href);
    let position = target.offset().top;
    $("html, body").animate({scrollTop:position}, speed, "swing");
    return false;
  });
});

$(() => {
  $(window).bind("scroll", function() {
  if ($(this).scrollTop() > 100) {
    $(".l-footer-pc__pageTop").fadeIn();
  } else {
    $(".l-footer-pc__pageTop").fadeOut();
  }
  let scrollHeight = $(document).height();
  let scrollPosition = $(window).height() + $(window).scrollTop();
  let footHeight = $(".l-footer-pc__main").height();

  if ( scrollHeight - scrollPosition  <= footHeight ) {
    $(".l-footer-pc__pageTop a").css({"position":"fixed","bottom": "0px"});
  } else {
    $(".l-footer-pc__pageTop a").css({"position":"fixed","bottom": "0px"});
    }
  });
});