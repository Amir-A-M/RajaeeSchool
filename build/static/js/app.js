$(document).ready(() => {

  function isTouchDevice() {
    return (('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      (navigator.msMaxTouchPoints > 0));
  }

  //
  // locomotive Scroll + Scroll Trigger config
  //
  (function () {
    gsap.registerPlugin(ScrollTrigger);

    // Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll
    const locoScroll = new LocomotiveScroll({
      el: document.querySelector("[data-scroll-container]"),
      smooth: true
    });

    // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
    locoScroll.on("scroll", ScrollTrigger.update);

    // tell ScrollTrigger to use these proxy methods for the "[data-scroll-container]" element since Locomotive Scroll is hijacking things
    ScrollTrigger.scrollerProxy("[data-scroll-container]", {
      scrollTop(value) {
        return arguments.length ? locoScroll.scrollTo(value, { duration: 0, disableLerp: true }) : locoScroll.scroll.instance.scroll.y;
      }, // we don't have to define a scrollLeft because we're only scrolling vertically.
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
      // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
      pinType: document.querySelector("[data-scroll-container]").style.transform ? "transform" : "fixed"
    });

    // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.defaults({ scroller: "[data-scroll-container]" });

  })();

  //
  // Menu - NavigationBar
  //
  (function () {
    const navItems = ".navigation .nav-item";
    const navContact = ".navigation .contact";
    const navigation = ".navigation";
    const $menuBtn = $(".toggle-navigation");
    const tl = gsap.timeline();

    let isOpen = false;

    $menuBtn.click(() => {
      isOpen = !isOpen;

      $menuBtn.children('svg').toggleClass("active");

      if (isOpen) {
        tl.progress(0).clear()
          .fromTo(navigation, { opacity: 0 }, { duration: .4, opacity: 1, pointerEvents: "auto", })
          .fromTo(navItems, { yPercent: 100, },
            {
              yPercent: 0, delay: 0.2,
              duration: .4,
              stagger: .1,
              ease: Expo.ease,
            }
          )
          .fromTo(navContact, { opacity: 0 }, { opacity: 1, duration: .3 }, "+=.1")
      } else {
        tl.progress(0).clear()
          .fromTo(navItems, { yPercent: 0, },
            {
              yPercent: -100,
              duration: .4,
              stagger: .1,
              ease: Expo.easeIn,
            }
          )
          .fromTo(navContact, { opacity: 1 }, { opacity: 0, duration: .2 }, "+=.1")
          .fromTo(navigation, { opacity: 1 }, { duration: .4, opacity: 0, pointerEvents: "none", })
      }
    });
  })();

  // 
  // Hero
  // 
  (function () {
    const tl = gsap.timeline();

    tl.to('.hero-title div', { y: 0, delay: .3, stagger: .6, duration: .6 })
      .to('.hero-image-container, .main-header', { opacity: 1, duration: 1.6 }, "+=.3")

    if (ScrollTrigger.isInViewport('.partners')) {
      tl.to('.partners', { opacity: 1, duration: 1.6 }, '-=1.6')
    } else {
      gsap.to('.partners',
        {
          scrollTrigger: '.partners',
          opacity: 1,
          duration: .5,
        }
      )
    }

    if (ScrollTrigger.isInViewport('.our-story .reveal div')) {
      tl.to('.our-story .reveal div', {
        height: "100%",
        duration: 2,
      }, '-=1.6');
    }

    $('.hero-image').one("load", function () {
      gsap.to('.hero-image', {
        scrollTrigger: {
          trigger: '.hero-image-container',
          start: 'top 200px',
          scrub: 3,
        },
        y: $('.hero-image-container').height() - $('.hero-image').height(),
      })
    })
      .each(function () {
        if (this.complete) {
          $(this).trigger('load'); // For jQuery >= 3.0 
        }
      });

  })();

  // 
  // Marquee
  // 
  (function () {
    const marquees = $('.marquee');

    marquees.each((i, marquee) => {
      $(marquee).children('div').clone().appendTo(marquee);
    })

  })();

  // 
  // Reveal
  // 
  (function () {
    const elements = $('.reveal');

    elements.each((i, container) => {
      let el = $(container).children("div")[0];

      if (ScrollTrigger.isInViewport(el)) {
        return;
      }

      let tl = gsap.timeline({
        scrollTrigger: container
      });

      tl.to(el, {
        height: "100%",
        duration: 2,
        delay: .3
      });
    });

  })();

  //
  // Showcase Video
  //
  (function () {
    const tl = gsap.timeline({
      scrollTrigger: {
        target: '.our-story',
        start: 'bottom center',
        end: 'bottom top',
        scrub: 1,
        pin: '.our-story',
        pinSpacing: false,
      },
    });

    tl
      .fromTo('.our-story', { filter: "blur(0px)" }, {
        filter: "blur(40px)",
      }, 'showcase-our-story')
      .fromTo('.showcase-video', { scale: .5 }, {
        scale: .95,
      }, 'showcase-our-story')


    const video = $('.showcase-video video');
    let isMuted = video.prop("muted");

    const cursorText = () => isMuted ? "پخش صدا" : "قطع صدا";

    video.click(() => {
      video.prop("muted", !isMuted);

      isMuted = !isMuted;

      cursor.setText(cursorText());
    })
      .on('mouseenter', () => cursor.setText(cursorText())
      )
      .on('mouseleave', () => cursor.removeText())
  })();

  //
  // Mouse Follower - Cursor
  //
  if (!isTouchDevice()) {
    var cursor = new MouseFollower({
      stateDetection: {
        '-pointer': 'a,button',
        '-hidden': '.social-icon, .nav-item'
      }
    });
  }

  //
  // text mask fill
  //
  (function () {
    const elements = $('.text-mask-fill');

    elements.each((i, container) => {
      let el = $(container).children("span").children("span");

      let tl = gsap.timeline({
        scrollTrigger: container
      });

      tl.to(el, {
        width: "100%",
        duration: 2,
        delay: .4,
        stagger: .2,
      });
    });

  })();

})