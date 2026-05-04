(function () {
  'use strict';

  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPage === '') currentPage = 'index.html';

  function renderNav() {
    var el = document.getElementById('site-nav');
    if (!el) return;

    var links = [
      { href: 'index.html', text: 'Home' },
      { href: 'about.html', text: 'About' },
      { href: 'research.html', text: 'Research' },
      { href: 'people.html', text: 'People' },
      { href: 'publications.html', text: 'Publications' },
      { href: 'laboratory.html', text: 'Laboratory' },
      { href: 'news.html', text: 'News' },
      { href: 'contact.html', text: 'Contact' }
    ];

    var linksHtml = links.map(function (link) {
      var isActive = currentPage === link.href;
      return '<li><a href="' + link.href + '"' + (isActive ? ' class="active"' : '') + '>' + link.text + '</a></li>';
    }).join('');

    el.innerHTML =
      '<nav class="navbar" id="navbar">' +
        '<div class="container nav-container">' +
          '<a href="index.html" class="nav-logo">' +
            '<img src="images/logo.png" alt="Carmody Lab – Nutritional and Microbial Ecology" class="nav-logo-img">' +
          '</a>' +
          '<button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
          '<ul class="nav-links" id="nav-links">' + linksHtml + '</ul>' +
        '</div>' +
      '</nav>';

    var toggle = document.getElementById('nav-toggle');
    var navLinks = document.getElementById('nav-links');

    toggle.addEventListener('click', function () {
      var expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      this.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    window.addEventListener('scroll', function () {
      var navbar = document.getElementById('navbar');
      if (!navbar) return;
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  function renderFooter() {
    var el = document.getElementById('site-footer');
    if (!el) return;

    el.innerHTML =
      '<footer class="footer">' +
        '<div class="container">' +
          '<div class="footer-grid">' +
            '<div class="footer-col">' +
              '<h4>Carmody Lab</h4>' +
              '<p>Nutritional &amp; Microbial Ecology Lab</p>' +
              '<p><a href="https://heb.fas.harvard.edu" target="_blank" rel="noopener">Department of Human Evolutionary Biology</a></p>' +
              '<p>Harvard University</p>' +
            '</div>' +
            '<div class="footer-col">' +
              '<h4>Location</h4>' +
              '<p>Peabody Museum</p>' +
              '<p>11 Divinity Avenue, 5th Floor</p>' +
              '<p>Cambridge, MA 02138</p>' +
            '</div>' +
            '<div class="footer-col">' +
              '<h4>Contact</h4>' +
              '<p><a href="mailto:carmody@fas.harvard.edu">carmody@fas.harvard.edu</a></p>' +
              '<p>617-495-0846</p>' +
            '</div>' +
          '</div>' +
          '<div class="footer-bottom">' +
            '<p>&copy; ' + new Date().getFullYear() + ' Carmody Lab, Harvard University. All rights reserved.</p>' +
          '</div>' +
        '</div>' +
      '</footer>';
  }

  function initLoadMore() {
    var btn = document.getElementById('load-more-btn');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var hidden = document.querySelectorAll('.news-item.hidden');
      var toShow = Array.prototype.slice.call(hidden, 0, 20);
      toShow.forEach(function (item) { item.classList.remove('hidden'); });

      if (document.querySelectorAll('.news-item.hidden').length === 0) {
        btn.style.display = 'none';
      }
    });
  }

  function initSlideshow() {
    var slides = document.querySelectorAll('.hero-slide');
    var dots = document.querySelectorAll('.hero-dot');
    var prevBtn = document.querySelector('.hero-arrow-prev');
    var nextBtn = document.querySelector('.hero-arrow-next');
    var findingEl = document.getElementById('slide-finding');
    var citationEl = document.getElementById('slide-citation');
    if (slides.length === 0) return;

    var slideData = [
      { finding: 'Diet dominates host genotype in shaping the gut microbiota', citation: 'Carmody et al. 2015 Cell Host & Microbe', color: '#7ecde6' },
      { finding: 'Gut microbes help metabolize drugs and diet-derived xenobiotics', citation: 'Carmody & Turnbaugh 2014 J Clin Invest', color: '#e89090' },
      { finding: 'Cooking and non-thermal food processing increase calories gained from food', citation: 'Carmody et al. 2011 PNAS; Groopman et al. 2015 Am J Phys Anthropol', color: '#aed581' },
      { finding: 'Cooking shapes the structure and function of the gut microbiome, affecting energy balance', citation: 'Carmody et al. 2019 Nat Microbiol', color: '#ffd54f' },
      { finding: 'The gut microbiota matures differently in humans and wild chimpanzees', citation: 'Reese et al. 2021 Current Biology', color: '#d7ccc8' },
      { finding: 'Effects of domestication on the gut microbiota parallel those of human industrialization', citation: 'Reese et al. 2021 eLife', color: '#b39ddb' }
    ];

    var current = 0;
    var interval;
    var paused = false;

    function updateCaption(index) {
      if (!findingEl || !citationEl) return;
      findingEl.textContent = slideData[index].finding;
      findingEl.style.color = slideData[index].color;
      citationEl.textContent = slideData[index].citation;
    }

    updateCaption(0);

    function goTo(index) {
      slides[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');
      current = index;
      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
      updateCaption(current);
    }

    function next() {
      goTo((current + 1) % slides.length);
    }

    function prev() {
      goTo((current - 1 + slides.length) % slides.length);
    }

    function stopAutoplay() {
      paused = true;
      clearInterval(interval);
    }

    interval = setInterval(next, 10000);

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        stopAutoplay();
        goTo(i);
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        stopAutoplay();
        prev();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        stopAutoplay();
        next();
      });
    }
  }

  function initResearchTabs() {
    var tabs = document.querySelectorAll('.research-tab');
    var panels = document.querySelectorAll('.research-panel');
    if (tabs.length === 0) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = this.getAttribute('data-tab');
        tabs.forEach(function (t) { t.classList.remove('active'); });
        panels.forEach(function (p) { p.classList.remove('active'); });
        this.classList.add('active');
        document.querySelector('.research-panel[data-panel="' + target + '"]').classList.add('active');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderNav();
    renderFooter();
    initLoadMore();
    initSlideshow();
    initResearchTabs();
  });
})();
