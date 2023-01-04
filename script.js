

// Ripple effect for .ripple-button

(function addRippleEffectForButtons () {
  const rippleButtons = document.querySelectorAll('.ripple-button');

  rippleButtons.forEach(btn => btn.addEventListener('click', createRipple));
  
  function createRipple (e) {
    let buttonCoordinates = e.target.getBoundingClientRect();
    const buttonTop = buttonCoordinates.top;
    const buttonLeft = buttonCoordinates.left;
    const x = e.clientX;
    const y = e.clientY;
    const xInside = x - buttonLeft;
    const yInside = y - buttonTop;
  
    const circle = document.createElement('div');
    circle.classList.add('ripple-button__circle');
    circle.style.top = yInside + 'px';
    circle.style.left = xInside + 'px';
  
    this.appendChild(circle);
  
  
    setTimeout(() => circle.remove(), 500);
  }  
})();



// Header Main Menu Header Main Menu Header Main Menu Header Main Menu

(function toggleActiveMainMenu () {
  const mainMenuBurgerBtn = document.querySelector('.header-content__burger-btn');
  const headerMainMenu = document.querySelector('.header-content__nav');

  mainMenuBurgerBtn.addEventListener('click', () => {
    mainMenuBurgerBtn.classList.toggle('header-content__burger-btn_active');
    headerMainMenu.classList.toggle('header-content__nav_active');

    const menuItems = document.querySelectorAll('.header-nav__item');

    menuItems.forEach((item) => {
      item.addEventListener('click', () => {
        mainMenuBurgerBtn.classList.remove('header-content__burger-btn_active');
        headerMainMenu.classList.remove('header-content__nav_active');
    });
    });

    const backArea = document.querySelector('.main');

    backArea.addEventListener('click', () => {
      mainMenuBurgerBtn.classList.remove('header-content__burger-btn_active');
      headerMainMenu.classList.remove('header-content__nav_active');
    })
  });
})();

// Welcome Section Slider Welcome Section Slider Welcome Section Slider

(function WelcomeSectionSlider () {
  const nextBtn = document.querySelector('.slider-controls__vector_next');
  const prevBtn = document.querySelector('.slider-controls__vector_prev');
  const dotsBtns = document.querySelectorAll('.slider-controls__dot');
  const currentNumberOutput = document.querySelector('.slides-numbers__current-number');
  const sliderItems = document.querySelectorAll('.welcome-background-container__item');
  const slidesCount = sliderItems.length;
  let isEnabled = true;

  let indexActiveSlide = 0;

  function changeIndexActiveSlide (newIndex) {
    indexActiveSlide = (newIndex + slidesCount) % slidesCount;
  }

  function changeActiveDote (index) {
    dotsBtns.forEach(item => item.classList.remove('active'));
    dotsBtns[index].classList.add('active');
  }

  function changeCurrentNumber (index) {
    currentNumberOutput.innerHTML = `0${index + 1}`;
  }

  function hideItem (direction) {
    isEnabled = false;
    sliderItems[indexActiveSlide].classList.add(direction);

    sliderItems[indexActiveSlide].addEventListener('animationend', function () {
      this.classList.remove('active', direction);
    });

  }

  function showItem (direction) {
    sliderItems[indexActiveSlide].classList.add('next', direction);

    sliderItems[indexActiveSlide].addEventListener('animationend', function () {
      this.classList.remove('next', direction);
      this.classList.add('active');
      isEnabled = true;
    });
  }

  function nextItem (index) {
    hideItem('to-left');
    changeIndexActiveSlide(index + 1);
    changeActiveDote(indexActiveSlide);
    changeCurrentNumber(indexActiveSlide);
    showItem('from-right');
  }

  function previousItem (index) {
    hideItem('to-right');
    changeIndexActiveSlide(index - 1);
    changeActiveDote(indexActiveSlide);
    changeCurrentNumber(indexActiveSlide);
    showItem('from-left');
  }



  nextBtn.addEventListener('click', () => {
    if (isEnabled) {
      nextItem(indexActiveSlide);
    }
  });

  prevBtn.addEventListener('click', () => {
    if (isEnabled) {
      previousItem(indexActiveSlide);
    }
  });

  dotsBtns.forEach((item, index) => {
    item.addEventListener('click', function () {
      if (index < indexActiveSlide && isEnabled) {
        hideItem('to-right');
        changeIndexActiveSlide(index);
        changeActiveDote(index);
        changeCurrentNumber(index);
        showItem('from-left');
      } else if (index > indexActiveSlide && isEnabled) {
        hideItem('to-left');
        changeIndexActiveSlide(index);
        changeActiveDote(index);
        changeCurrentNumber(index);
        showItem('from-right');
      }
    });

    item.addEventListener('touchstart', function () {
      if (index < indexActiveSlide && isEnabled) {
        hideItem('to-right');
        changeIndexActiveSlide(index);
        changeActiveDote(index);
        changeCurrentNumber(index);
        showItem('from-left');
      } else if (index > indexActiveSlide && isEnabled) {
        hideItem('to-left');
        changeIndexActiveSlide(index);
        changeActiveDote(index);
        changeCurrentNumber(index);
        showItem('from-right');
      }
    });
  });


  (function swipeDetect () {
    const surface = document.querySelector('.welcome-container');

    let startX = 0;
    let startY = 0;
    let distanceX = 0;
    let distanceY = 0;

    let startTime = 0;
    let elapsedTime = 0;

    let thresholdDist = 150;
    let restraintY = 100;
    let allowedTime = 300;


    surface.addEventListener('mousedown', function (event) {
      startX = event.pageX;
      startY = event.pageY;
      startTime = new Date().getTime();
      // event.preventDefault();
    });

    surface.addEventListener('mouseup', function (event) {
      distanceX = event.pageX - startX;
      distanceY = event.pageY - startY;
      elapsedTime = new Date().getTime() - startTime;
      event.preventDefault();

      if (elapsedTime <= allowedTime) {
        if (Math.abs(distanceX) > thresholdDist && Math.abs(distanceY) < restraintY) {
          if (distanceX > 0 && isEnabled) {
            previousItem(indexActiveSlide);
          } else if (distanceX < 0 && isEnabled) {
            nextItem(indexActiveSlide);
          }
        }
      }
    });

    // TOUCH EVENTS

    surface.addEventListener('touchstart', function (event) {
      if (event.target.classList.contains('slider-controls__vector') ||
          event.target.classList.contains('slider-controls__dot')) {
        if (event.target.classList.contains('slider-controls__vector_prev')) {
          if (isEnabled) {
            previousItem(indexActiveSlide);
          }
        } else if (event.target.classList.contains('slider-controls__vector_next')) {
          if (isEnabled) {
            nextItem(indexActiveSlide);
          }
        } 
      }

      let touchObj = event.changedTouches[0];
      startX = touchObj.pageX;
      startY = touchObj.pageY;
      startTime = new Date().getTime();
      // event.preventDefault();
    });

    surface.addEventListener('touchmove', function (event) {
      event.preventDefault();
    });

    surface.addEventListener('touchend', function (event) {
      let touchObj = event.changedTouches[0];
      distanceX = touchObj.pageX - startX;
      distanceY = touchObj.pageY - startY;
      elapsedTime = new Date().getTime() - startTime;
      event.preventDefault();

      if (elapsedTime <= allowedTime) {
        if (Math.abs(distanceX) > thresholdDist && Math.abs(distanceY) < restraintY) {
          if (distanceX > 0 && isEnabled) {
            previousItem(indexActiveSlide);
          } else if (distanceX < 0 && isEnabled) {
            nextItem(indexActiveSlide);
          }
        }
      }
    });
  })();
})();


// Explore section 

const exploreSlider = document.querySelector('.explore-slider');
const exploreBefore = document.querySelector(".explore-slider__before-contain");
const exploreControl = document.querySelector(".explore-slider__control");

function changeImageWidth(event) {
  let offset = event.pageX - exploreSlider.offsetLeft;
  let exploreSliderWidth = exploreSlider.offsetWidth;

  if (offset < 20) {
    offset = 20;
  }
  if (offset > exploreSliderWidth - 20) {
    offset = exploreSliderWidth - 20;
  }

  exploreControl.style.left = `calc(${
    (offset / exploreSliderWidth) * 100
  }% - 20px)`;
  exploreBefore.style.width = (offset / exploreSliderWidth) * 100 + "%";
}

exploreControl.addEventListener("dragstart", (event) => false);
exploreControl.addEventListener("mousedown", function () {
  document.addEventListener("mousemove", changeImageWidth);
});

document.addEventListener("mouseup", function () {
  document.removeEventListener("mousemove", changeImageWidth);
});

// Video section  Video section  Video section  Video section

(function VideoSectionVideoAndPlaylist() {
  (function VideoSectionCustomPlayer() {
    // const AllVideoItems = document.querySelector('.main-video-contain__video-item');
    let VideoWithPanelContain = document.querySelector(".main-video-contain");
    let Video = document.querySelector(".active-main-video");
    const RangeTime = document.querySelector(".panel-control__range_time");
    const RangeSound = document.querySelector(".panel-control__range_sound");
    const ScreenPlayBtn = document.querySelector(
      ".main-video-contain__screen-btn"
    );
    const PlayPauseBtn = document.querySelector(".panel-control__play");
    const MuteBtn = document.querySelector(".panel-control__sound-ico");
    const FullScreenBtn = document.querySelector(".panel-control__full-screen");

    function rangeMoveFeedback(element) {
      const value = element.value;
      element.style.background = `linear-gradient(to right, #710707 0%, #710707 ${value}%, #C4C4C4 ${value}%, #C4C4C4 100%)`;
    }

    function timeProgressListener() {
      RangeTime.value = (Video.currentTime / Video.duration) * 100;
      rangeMoveFeedback(RangeTime);
    }
    Video.addEventListener("timeupdate", timeProgressListener);

    function changeTimeProgress() {
      Video.currentTime = (Video.duration / 100) * this.value;
      rangeMoveFeedback(this);
    }
    RangeTime.addEventListener("input", changeTimeProgress);

    function changeSoundProgress() {
      Video.volume = this.value / 100;
      rangeMoveFeedback(this);
      if (this.value < 1) {
        MuteBtn.classList.add("mute");
      } else if (this.value > 1) {
        MuteBtn.classList.remove("mute");
      }
    }
    RangeSound.addEventListener("input", changeSoundProgress);

    function toggleFullScreenVideo() {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        const rfs =
          VideoWithPanelContain.requestFullscreen ||
          VideoWithPanelContain.webkitRequestFullScreen ||
          VideoWithPanelContain.mozRequestFullScreen ||
          VideoWithPanelContain.msRequestFullscreen;
        rfs.call(VideoWithPanelContain);
      }
    }
    FullScreenBtn.addEventListener("click", toggleFullScreenVideo);
    VideoWithPanelContain.addEventListener("fullscreenchange", function () {
      FullScreenBtn.classList.toggle("active");
    });

    function togglePlayPauseVideoAct() {
      if (Video.paused) {
        Video.play();
        ScreenPlayBtn.style.display = "none";
        PlayPauseBtn.classList.add("paused");
      } else {
        Video.pause();
        ScreenPlayBtn.style.display = "block";
        PlayPauseBtn.classList.remove("paused");
      }
    }
    Video.addEventListener("click", togglePlayPauseVideoAct);
    PlayPauseBtn.addEventListener("click", togglePlayPauseVideoAct);
    ScreenPlayBtn.addEventListener("click", togglePlayPauseVideoAct);

    function toggleMuteVideo() {
      if (Video.muted) {
        Video.muted = false;
        MuteBtn.classList.remove("mute");
      } else {
        Video.muted = true;
        MuteBtn.classList.add("mute");
      }
    }

    MuteBtn.addEventListener("click", toggleMuteVideo);

    (function videoKeyBoardEvents() {
      function speedUp() {
        if (Video.playbackRate > 2) {
          return;
        } else {
          Video.playbackRate += 0.1;
        }
      }

      function speedDown() {
        if (Video.playbackRate < 0.5) {
          return;
        } else {
          Video.playbackRate -= 0.1;
        }
      }

      function hotKeys(event) {
        if (event.keyCode === 32) {
          event.preventDefault();
          togglePlayPauseVideoAct();
        }
        if (event.keyCode === 77) {
          toggleMuteVideo();
        }
        if (event.keyCode === 70) {
          toggleFullScreenVideo();
        }

        if (event.keyCode === 190) {
          speedUp();
        }
        if (event.keyCode === 188) {
          speedDown();
        }
      }

      document.addEventListener("scroll", function () {
        if (window.pageYOffset > 3000 && window.pageYOffset < 4000) {
          window.addEventListener("keydown", hotKeys);
        } else {
          window.removeEventListener("keydown", hotKeys);
        }
      });
    })();
  })();

  const playlistSlider = new Swiper(".video-slider", {
    // Optional parameters
    direction: "horizontal",
    loop: true,
    autoHeight: true,
    slidesPerView: 3,
    spaceBetween: 42,

    // If we need pagination
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },

    // Navigation arrows
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  const AllMainVideos = document.querySelectorAll(
    ".main-video-contain__video-item"
  );
  const PlaylistPanelControl = document.querySelector(".controls-video-slider");

  function changeMainVideo() {
    let indexActiveSlideInplaylist = playlistSlider.realIndex;
    AllMainVideos.forEach((item) => item.classList.remove("active-main-video"));
    AllMainVideos[indexActiveSlideInplaylist].classList.add(
      "active-main-video"
    );
    AllMainVideos[indexActiveSlideInplaylist].load();
  }
  PlaylistPanelControl.addEventListener("click", changeMainVideo);
})();

// Gallery section

(function dinamicGalleryPicLoading() {
  const pictureInnerContainer = document.querySelector(
    ".picture-inner-container"
  );

  let images = [
    "assets/img/landing/galery/galery1.jpg",
    "assets/img/landing/galery/galery2.jpg",
    "assets/img/landing/galery/galery3.jpg",
    "assets/img/landing/galery/galery4.jpg",
    "assets/img/landing/galery/galery5.jpg",
    "assets/img/landing/galery/galery6.jpg",
    "assets/img/landing/galery/galery7.jpg",
    "assets/img/landing/galery/galery8.jpg",
    "assets/img/landing/galery/galery9.jpg",
    "assets/img/landing/galery/galery10.jpg",
    "assets/img/landing/galery/galery11.jpg",
    "assets/img/landing/galery/galery12.jpg",
    "assets/img/landing/galery/galery13.jpg",
    "assets/img/landing/galery/galery14.jpg",
    "assets/img/landing/galery/galery15.jpg",
  ];

  let shuffleImages = images.sort((a, b) => 0.5 - Math.random());

  for (i = 0; i < 15; i++) {
    const img = document.createElement("img");
    img.classList.add("picture-inner-container__item");
    img.src = images[i];
    img.alt = `section-galery-item`;
    pictureInnerContainer.append(img);
  }

  (function addOffsetForColumns() {
    const allImages = document.querySelectorAll(
      ".picture-inner-container__item"
    );

    allImages[5].onload = function () {
      let heightFirstColumn =
        allImages[0].offsetHeight +
        allImages[1].offsetHeight +
        allImages[2].offsetHeight +
        allImages[3].offsetHeight +
        allImages[4].offsetHeight +
        allImages[5].offsetHeight;
      // console.log(allImages[5].offsetHeight);
      // console.log(heightFirstColumn);
      // console.log(allImages[0], allImages[14]);

      if (heightFirstColumn < 3160) {
        allImages[6].style.paddingTop = "0px";
      } else {
        allImages[5].style.paddingTop = "0px";
      }
    };
  })();
})();

(function addAnimationForGalleryPics () {
  function debounce(func, wait = 20, immediate = true) {
    var timeout;
  
    return function() {
        var context = this;
        var args = arguments;
        
        var later = function() {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        }
  
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
  
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.apply(context, args);
        }
    }
  } 
  
  const gallery = document.querySelector('.gallery-section');
  const sliderImages = document.querySelectorAll('.picture-inner-container__item');
  
  function checkSlide() {
    sliderImages.forEach(sliderImage => {
        const slideInAt = (window.scrollY + window.innerHeight) - sliderImage.offsetHeight / 2;   
        const imageBottom = gallery.offsetTop + sliderImage.offsetTop + sliderImage.offsetHeight;
        const isHalfShown = slideInAt > sliderImage.offsetTop + gallery.offsetTop;
        const isntScrolledPast = window.scrollY < imageBottom;
  
        if (isHalfShown && isntScrolledPast) {
            sliderImage.classList.add('active');
        } else {
            sliderImage.classList.remove('active');
        }
    });
  }
  window.addEventListener('scroll', debounce(checkSlide));
})();


// Contacts section 

(function addMapOnPage () {
  mapboxgl.accessToken = 'pk.eyJ1Ijoib2tzZW4wMzIiLCJhIjoiY2t1aTY5Y3RnMDBjNDJ4bW9lenp3ZDJ6aSJ9.0cqzXLpByXnHdaN1qKLg9Q';
  const map = new mapboxgl.Map({
      container: 'map', 
      style: 'mapbox://styles/mapbox/light-v10', 
      center: [2.335824, 48.860880],
      zoom: 16
  });
  
  const nav = new mapboxgl.NavigationControl({
      shoeCompass: true,
      showZoom: true
  });

  map.addControl(nav, 'top-right');


  const geojson = {
      'type': 'FeatureCollection',
      'features': [
          {
              'type': 'Feature',
              'properties': {
              'message': 'Tunnel des Tuileries'
              },
              'geometry': {
              'type': 'Point',
              'coordinates': [2.3333015808733486, 48.86033392547728]
              }
          },
          {
              'type': 'Feature',
              'properties': {
              'message': 'Arc de triomphe du Carrousel'
              },
              'geometry': {
              'type': 'Point',
              'coordinates': [2.3329, 48.8617]
              }
          },
              {
              'type': 'Feature',
              'properties': {
              'message': 'Rue de Rivoli'
              },
              'geometry': {
              'type': 'Point',
              'coordinates': [2.336409, 48.862487]
              }
          },
              {
              'type': 'Feature',
              'properties': {
              'message': 'Sarcophage d\'Abou Roach'
              },
              'geometry': {
              'type': 'Point',
              'coordinates': [2.339643, 48.860745]
              }
          },
              {
              'type': 'Feature',
              'properties': {
              'message': 'Louvre Museum'
              },
              'geometry': {
              'type': 'Point',
              'coordinates': [2.335824, 48.860880]
              }
          }
      ]
  };

  for (const marker of geojson.features) {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = `url(./assets/svg/contacts/marker.svg)`;

      new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map);
  }
})();



