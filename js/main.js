(function () {
  'use strict';

  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPage === '') currentPage = 'index.html';

  function renderNav() {
    var el = document.getElementById('site-nav');
    if (!el) return;

    var links = [
      { href: 'index.html', text: 'Home' },
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
          '<div class="nav-right">' +
            '<ul class="nav-links" id="nav-links">' + linksHtml + '</ul>' +
            '<div class="nav-search-wrap" id="nav-search-wrap">' +
              '<div class="nav-search-bar">' +
                '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
                '<input type="text" class="nav-search-input" id="nav-search-input" placeholder="Search..." autocomplete="off">' +
              '</div>' +
              '<div class="nav-search-dropdown" id="nav-search-dropdown"></div>' +
            '</div>' +
          '</div>' +
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
      { finding: 'Effects of domestication on the gut microbiota parallel those of human industrialization', citation: 'Reese et al. 2021 eLife', color: '#b39ddb' },
      { finding: 'Early-life antibiotic exposure can set the course of metabolic trajectories into adulthood', citation: 'Schell & Carmody 2025 Cell Host & Microbe', color: '#ef9a9a' },
      { finding: 'Non-caloric dietary preservatives alter the microbiome and affect host energetic status', citation: 'Schell et al. 2025 Am J Clin Nutr', color: '#80cbc4' },
      { finding: 'Socially transmissible gut microbes may modulate host disease risk and resilience', citation: 'Sarkar et al. 2024 Cell', color: '#90caf9' },
      { finding: 'Metabolites from diet-microbe interactions may alter host eating behavior', citation: 'Liow et al. 2025 Trends Endocrinol Metab', color: '#f48fb1' }
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
    var boxes = document.querySelectorAll('.research-box[data-rbox]');
    if (boxes.length === 0) return;

    boxes.forEach(function (box) {
      box.addEventListener('click', function () {
        var id = this.getAttribute('data-rbox');

        document.querySelectorAll('.research-box').forEach(function (b) {
          b.classList.remove('active');
        });
        document.querySelectorAll('.research-detail').forEach(function (d) {
          d.classList.remove('active');
        });

        this.classList.add('active');
        var detail = document.getElementById('rdetail-' + id);
        if (detail) detail.classList.add('active');
      });
    });
  }

  var searchIndex = [
    // People - Current
    { page: 'People', url: 'people.html', title: 'Rachel Carmody', text: 'Thomas D. Cabot Associate Professor of Human Evolutionary Biology. Principal Investigator, Nutritional & Microbial Ecology Laboratory. I seek to understand how the human body acquires and utilizes energy, and how past changes in energy budget have shaped human evolution.' },
    { page: 'People', url: 'people.html', title: 'Cary Allen-Blevins', text: 'Lecturer, Former Graduate Student. Interested in how nutrition can affect behavior via the microbiota-gut-brain axis. Studying co-evolution between mother\'s milk and microbes of the infant gut.' },
    { page: 'People', url: 'people.html', title: 'Alex Cooper-Hohn', text: 'Post-Baccalaureate Researcher.' },
    { page: 'People', url: 'people.html', title: 'Neil Ibata', text: 'Postdoctoral Fellow.' },
    { page: 'People', url: 'people.html', title: 'John Kahumbu', text: 'Graduate Student.' },
    { page: 'People', url: 'people.html', title: 'Yi Jia (Claire) Liow', text: 'Visiting Fellow, Graduate Student at University of Tokyo. Research explores the intersection of nutritional neuroscience, the gut microbiome, and eating behavior.' },
    { page: 'People', url: 'people.html', title: 'Cameron McInroy', text: 'Post-Baccalaureate Researcher.' },
    { page: 'People', url: 'people.html', title: 'Chris Ruaño', text: 'Undergraduate Researcher.' },
    { page: 'People', url: 'people.html', title: 'Grace Rubin', text: 'Graduate Student.' },
    { page: 'People', url: 'people.html', title: 'Amar Sarkar', text: 'Graduate Student. Completed master\'s degrees at Oxford and Cambridge. Interested in human health, development, and evolution. Studies host-microbe interactions using an evolutionary framework.' },
    { page: 'People', url: 'people.html', title: 'Laura Schell', text: 'Postdoctoral Fellow, Former Graduate Student & NSF Graduate Research Fellow. Interested in the co-evolution of humans with gut microbiota and how plasticity in the gut microbiome contributes to variations in host phenotype.' },
    { page: 'People', url: 'people.html', title: 'Emily Venable', text: 'Graduate Student, NSF Graduate Research Fellow. Studies how variations in the human diet affect the composition and function of the gut microbiome.' },
    { page: 'People', url: 'people.html', title: 'Ludovico Rollo', text: 'Former Undergraduate Researcher and Hoopes Prize Awardee, Current Collaborator.' },

    // People - Former
    { page: 'People', url: 'people.html', title: 'Andrew Bolze', text: 'Former Undergraduate Researcher and AHA Fellow. Interested in the interplay between gut microbial community and host energetics, focusing on effects of energy expenditure on the gut microbiome.' },
    { page: 'People', url: 'people.html', title: 'Katia Chadaideh', text: 'Former Graduate Student, now Assistant Director of Student Services, Harvard Kenneth C. Griffin Graduate School. Studied how variations in the human diet shape gut microbial diversity.' },
    { page: 'People', url: 'people.html', title: 'Eric Chan', text: 'Former Undergraduate Researcher.' },
    { page: 'People', url: 'people.html', title: 'Molly Chiang', text: 'Former Undergraduate Researcher and Hoopes Prize Awardee. Studied diet and the microbiome using DNA metabarcoding to catalogue chimpanzee diets.' },
    { page: 'People', url: 'people.html', title: 'Jessica Diaz', text: 'Former Undergraduate Researcher and Herchel Smith Research Fellow. Explored how animal morphology, physiology, and life history have been shaped through co-evolution with the gut microbiota.' },
    { page: 'People', url: 'people.html', title: 'Caroline Diggins', text: 'Former Undergraduate Researcher and Hoopes Prize Awardee. Studied the relationship between human nutrition, the microbiome, and metabolic health.' },
    { page: 'People', url: 'people.html', title: 'Kevin Eappen', text: 'Former Undergraduate Researcher. Interested in how diet shapes the human microbiome, particularly the role of Akkermansia muciniphila and polyphenols.' },
    { page: 'People', url: 'people.html', title: 'Mira-Rose Kingsbury Lee', text: 'Former Undergraduate Researcher, Herchel Smith Research Fellow, 2024 Rhodes Scholar.' },
    { page: 'People', url: 'people.html', title: 'Andrew Li', text: 'Former Undergraduate Researcher. Studied effects of fermentative food processing on host energy balance and the gut microbiome. Also a pianist in the Harvard-NEC Dual Degree Program.' },
    { page: 'People', url: 'people.html', title: 'Jinhui Liu', text: 'Visiting Undergraduate Student, Current Collaborator.' },
    { page: 'People', url: 'people.html', title: 'Brandi Moore', text: 'Former Undergraduate Researcher. Explored how ancestral and modern sources of dietary polyphenols affect different microbes.' },
    { page: 'People', url: 'people.html', title: 'Aspen Reese', text: 'Former Junior Fellow (Harvard Society of Fellows), Former Asst. Prof. UCSD, Current AAAS Fellow NIH/FIC. Combines ecology, evolution, microbiology, and physiology to study domestication and the microbiota.' },
    { page: 'People', url: 'people.html', title: 'Dina Zeldin', text: 'Former Undergraduate Researcher.' },

    // Publications
    { page: 'Publications', url: 'publications.html', title: 'Schell, Liow & Carmody (2026)', text: 'Fasting and re-feeding independently alter mouse gut microbiota during intermittent fasting. bioRxiv preprint.' },
    { page: 'Publications', url: 'publications.html', title: 'Schell, Rubin, Chan & Carmody (2025)', text: 'Early-life microbiota disruption by antibiotics elicits fitness trade-offs that differ by sex. bioRxiv preprint.' },
    { page: 'Publications', url: 'publications.html', title: 'Liow et al. (2025)', text: 'Polyunsaturated fatty acids promote appetite via the microbiome-gut-brain axis. bioRxiv preprint.' },
    { page: 'Publications', url: 'publications.html', title: 'Sarkar et al. (2026)', text: 'The island biology of the host microbiome. Trends in Microbiology.' },
    { page: 'Publications', url: 'publications.html', title: 'Liow, Sarkar & Carmody (2025)', text: 'Industrialized diets modulate host eating behavior via the microbiome-gut-brain axis. Trends in Endocrinology & Metabolism.' },
    { page: 'Publications', url: 'publications.html', title: 'Schell et al. (2025)', text: 'Dietary preservatives alter the gut microbiota in vitro and in vivo with sex-specific consequences for host metabolic development. American Journal of Clinical Nutrition.' },
    { page: 'Publications', url: 'publications.html', title: 'Schell & Carmody (2025)', text: 'An energetic framework for gut microbiome-mediated obesity induced by early-life exposure to antibiotics. Cell Host & Microbe.' },
    { page: 'Publications', url: 'publications.html', title: 'Venable & Carmody (2024)', text: 'Decoupled Nutrient Status: a framework to disentangle host from microbial responses to diets of varying digestibility. Frontiers in Food Science and Technology.' },
    { page: 'Publications', url: 'publications.html', title: 'Carmody, Varady & Turnbaugh (2024)', text: 'Digesting the complex metabolic effects of diet on the host and microbiome. Cell.' },
    { page: 'Publications', url: 'publications.html', title: 'Sarkar, McInroy et al. (2024)', text: 'Microbial transmission in the social microbiome and host health and disease. Cell.' },
    { page: 'Publications', url: 'publications.html', title: 'Lieberman et al. (2023)', text: 'Comparing measured dietary variation within and between tropical hunter-gatherer groups to the Paleo diet. American Journal of Clinical Nutrition.' },
    { page: 'Publications', url: 'publications.html', title: 'Amato & Carmody (2023)', text: 'Gut microbial intersections with human ecology and evolution. Annual Review of Anthropology.' },
    { page: 'Publications', url: 'publications.html', title: 'Wang et al. (2023)', text: 'The gut microbiome modifies the associations of short- and long-term physical activity with body weight changes. Microbiome.' },
    { page: 'Publications', url: 'publications.html', title: 'Carmody & Bisanz (2023)', text: 'The role of the gut microbiome in weight management. Nature Reviews Microbiology.' },
    { page: 'Publications', url: 'publications.html', title: 'McNamara et al. (2023)', text: 'Juvenile microbiome composition of a mouse model selectively bred for high voluntary wheel-running behavior. Journal of Experimental Biology.' },
    { page: 'Publications', url: 'publications.html', title: 'MacArthur et al. (2022)', text: 'Multi-omics assessment of dietary protein titration reveals altered hepatic glucose utilization. Cell Reports.' },
    { page: 'Publications', url: 'publications.html', title: 'Sarkar et al. (2021)', text: 'The gut microbiome as a biomarker of differential susceptibility to SARS-CoV-2. Trends in Molecular Medicine.' },
    { page: 'Publications', url: 'publications.html', title: 'Chadaideh & Carmody (2021)', text: 'Host-microbial interactions in the metabolism of different dietary fats. Cell Metabolism.' },
    { page: 'Publications', url: 'publications.html', title: 'Carmody, Sarkar & Reese (2021)', text: 'Gut microbiota through an evolutionary lens. Science.' },
    { page: 'Publications', url: 'publications.html', title: 'Reese et al. (2021)', text: 'Effects of domestication on the gut microbiota parallel those of human industrialization. eLife.' },
    { page: 'Publications', url: 'publications.html', title: 'Reese et al. (2020)', text: 'Age patterning in the wild chimpanzee gut microbiota reveals differences from humans in early life. Current Biology.' },
    { page: 'Publications', url: 'publications.html', title: 'Sarkar et al. (2020)', text: 'Microbial transmission in animal social networks and the social microbiome. Nature Ecology & Evolution.' },
    { page: 'Publications', url: 'publications.html', title: 'Carmody et al. (2019)', text: 'Cooking shapes the structure and function of the gut microbiome. Nature Microbiology.' },
    { page: 'Publications', url: 'publications.html', title: 'Carmody & Baggish (2019)', text: 'Working out the bugs: microbial modulation of athletic performance. Nature Metabolism.' },
    { page: 'Publications', url: 'publications.html', title: 'Carmody et al. (2016)', text: 'Genetic evidence of human adaptation to a cooked diet. Genome Biology and Evolution.' },
    { page: 'Publications', url: 'publications.html', title: 'Carmody et al. (2015)', text: 'Diet dominates host genotype in shaping the murine gut microbiota. Cell Host & Microbe.' },
    { page: 'Publications', url: 'publications.html', title: 'Roopchand et al. (2015)', text: 'Dietary polyphenols promote growth of the gut bacterium Akkermansia muciniphila and attenuate high fat diet-induced metabolic syndrome. Diabetes.' },
    { page: 'Publications', url: 'publications.html', title: 'Carmody et al. (2011)', text: 'Energetic consequences of thermal and nonthermal food processing. PNAS.' },
    { page: 'Publications', url: 'publications.html', title: 'Carmody & Wrangham (2009)', text: 'The energetic significance of cooking. Journal of Human Evolution.' },
    { page: 'Publications', url: 'publications.html', title: 'David, Maurice, Carmody et al. (2014)', text: 'Diet rapidly and reproducibly alters the human gut microbiome. Nature.' },
    { page: 'Publications', url: 'publications.html', title: 'Carmody & Turnbaugh (2014)', text: 'Host-microbial interactions in the metabolism of therapeutic and diet-derived xenobiotics. Journal of Clinical Investigation.' },

    // Research
    { page: 'Research', url: 'research.html', title: 'Dietary niche and host-microbiome interactions', text: 'How does the human dietary niche modulate host-microbiome interactions in energy metabolism? Dietary changes reshape the composition and metabolic activities of the gut microbiome within hours. Cooking, meat consumption, fasting, fats, polyphenols, preservatives.' },
    { page: 'Research', url: 'research.html', title: 'Microbiome evolution and metabolic adaptability', text: 'How does the gut microbiome\'s ability to evolve quickly shape human metabolic adaptability? Microbial metagenomes can change within hours. The plasticity of the gut microbiome is an evolutionary double-edged sword.' },
    { page: 'Research', url: 'research.html', title: 'Comparative gut microbiomes', text: 'How and why are human gut microbiomes different from those of other species? Humans have a unique ecological history driven by calorie-rich, highly omnivorous and processed diets, changes in life history, and cooperation.' },

    // Laboratory
    { page: 'Laboratory', url: 'laboratory.html', title: 'Lab Facilities', text: 'Constructed in 2016, the Nutritional & Microbial Ecology Laboratory. 1,627 square feet ADA-compliant facilities. 10 dedicated bench workstations, chemical hoods, anaerobic culturing, PCR, cold room. Peabody Museum, 11 Divinity Avenue, 5th Floor.' },
    { page: 'Laboratory', url: 'laboratory.html', title: 'Nutritional Biochemistry', text: 'Dietary protein, lipid, carbohydrate (sugar, starch, insoluble and soluble fiber), ash, moisture analysis.' },
    { page: 'Laboratory', url: 'laboratory.html', title: 'Physiology', text: 'Metabolic rate by open-flow and closed-system respirometry. Nutrient intake by perfusion. Body composition by magnetic resonance imaging. Physiological cell staining.' },
    { page: 'Laboratory', url: 'laboratory.html', title: 'Microbial Ecology', text: 'Anaerobic and aerobic culturing. Assessment of point-in-time and kinetic growth. Quantitative PCR. DNA and RNA sequencing.' },

    // Contact
    { page: 'Contact', url: 'contact.html', title: 'Rachel Carmody', text: 'Research, Teaching & Position Inquiries. carmody@fas.harvard.edu. 617-495-0846.' },
    { page: 'Contact', url: 'contact.html', title: 'Natalie McKenna', text: 'General Inquiries. nmckenna@fas.harvard.edu. 617-496-1132.' },
    { page: 'Contact', url: 'contact.html', title: 'Location', text: 'Department of Human Evolutionary Biology. Peabody Museum, 11 Divinity Avenue, 5th Floor. Cambridge, Massachusetts 02138.' },

    // News (selected highlights)
    { page: 'News', url: 'news.html', title: 'Amar Sarkar - Bok Award (2025)', text: 'Congratulations to Amar Sarkar on winning a 2025 Derek C. Bok Award for Excellence in Graduate Student Teaching of Undergraduates.' },
    { page: 'News', url: 'news.html', title: 'Ludovico Rollo - Hoopes Prize (2025)', text: 'Congratulations to undergraduate researcher Ludovico Rollo for winning a 2025 Hoopes Prize for his senior thesis, The Influence of Social Dominance on the Gut Microbiome.' },
    { page: 'News', url: 'news.html', title: 'Neil Ibata - London Marathon (2025)', text: 'Congratulations to postdoc Neil Ibata on running a blistering 2:19:01 in the London Marathon!' },
    { page: 'News', url: 'news.html', title: 'Early-life antibiotics paper (2025)', text: 'Laura and Rachel\'s paper on the mechanisms underpinning the connection between early-life antibiotics and adult adiposity is out in Cell Host & Microbe.' },
    { page: 'News', url: 'news.html', title: 'Harvard Magazine feature (2023)', text: 'Our lab is featured in the November-December 2023 edition of Harvard Magazine.' },
    { page: 'News', url: 'news.html', title: 'Rachel promoted (2023)', text: 'Congratulations to Rachel on her promotion to Associate Professor!' },
    { page: 'News', url: 'news.html', title: 'Mira-Rose Kingsbury Lee - Rhodes Scholar (2023)', text: 'Congratulations to undergraduate researcher Mira-Rose Kingsbury Lee for being named a 2024 Rhodes Scholar!' },
    { page: 'News', url: 'news.html', title: 'Social microbiome paper (2024)', text: 'Our paper on Microbial transmission in the social microbiome and host health and disease is out in Cell. Congratulations to Amar Sarkar and Cameron McInroy.' },
    { page: 'News', url: 'news.html', title: 'Cooking and the microbiome (2019)', text: 'Cooking shapes the structure and function of the gut microbiome. Nature Microbiology. Featured in the New York Times.' },
    { page: 'News', url: 'news.html', title: 'Roslyn Abramson Award (2022)', text: 'Rachel has won the 2022 Roslyn Abramson Award for excellence and sensitivity in the teaching of undergraduates.' },

    // Home
    { page: 'Home', url: 'index.html', title: 'Carmody Lab', text: 'Nutritional & Microbial Ecology Lab. Harvard University. Department of Human Evolutionary Biology. We study how the gut microbiome shapes human health and evolution, probing the energetic consequences of interactions between humans and the trillions of microbes in the gastrointestinal tract.' }
  ];

  function initSearch() {
    var input = document.getElementById('nav-search-input');
    var dropdown = document.getElementById('nav-search-dropdown');
    if (!input || !dropdown) return;

    function showDropdown() { dropdown.classList.add('open'); }
    function hideDropdown() { dropdown.classList.remove('open'); }

    input.addEventListener('focus', function () {
      if (this.value.trim().length >= 2) showDropdown();
    });

    input.addEventListener('input', function () {
      var query = this.value.trim().toLowerCase();
      if (query.length < 2) {
        hideDropdown();
        return;
      }

      var terms = query.split(/\s+/);
      var matches = searchIndex.filter(function (item) {
        var haystack = (item.title + ' ' + item.text + ' ' + item.page).toLowerCase();
        return terms.every(function (term) { return haystack.indexOf(term) !== -1; });
      });

      if (matches.length === 0) {
        dropdown.innerHTML = '<div class=”search-empty”>No results for “' + escapeHtml(this.value) + '”</div>';
        showDropdown();
        return;
      }

      var grouped = {};
      matches.forEach(function (m) {
        if (!grouped[m.page]) grouped[m.page] = [];
        grouped[m.page].push(m);
      });

      var html = '';
      Object.keys(grouped).forEach(function (page) {
        html += '<div class="search-group"><div class="search-group-label">' + escapeHtml(page) + '</div>';
        grouped[page].forEach(function (item) {
          var snippet = getSnippet(item.text, terms);
          html += '<a href="' + item.url + '" class="search-result-item">' +
            '<div class="search-result-title">' + highlightTerms(escapeHtml(item.title), terms) + '</div>' +
            '<div class="search-result-snippet">' + highlightTerms(escapeHtml(snippet), terms) + '</div>' +
          '</a>';
        });
        html += '</div>';
      });

      dropdown.innerHTML = html;
      showDropdown();
    });

    document.addEventListener('click', function (e) {
      var wrap = document.getElementById('nav-search-wrap');
      if (wrap && !wrap.contains(e.target)) hideDropdown();
    });

    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        input.focus();
        input.select();
      }
      if (e.key === 'Escape' && dropdown.classList.contains('open')) {
        hideDropdown();
        input.blur();
      }
    });

    function escapeHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function getSnippet(text, terms) {
      var lower = text.toLowerCase();
      var idx = -1;
      for (var i = 0; i < terms.length; i++) {
        idx = lower.indexOf(terms[i]);
        if (idx !== -1) break;
      }
      if (idx === -1) return text.substring(0, 100);
      var start = Math.max(0, idx - 30);
      var end = Math.min(text.length, idx + 70);
      var snippet = text.substring(start, end);
      if (start > 0) snippet = '...' + snippet;
      if (end < text.length) snippet = snippet + '...';
      return snippet;
    }

    function highlightTerms(html, terms) {
      terms.forEach(function (term) {
        if (term.length < 2) return;
        var escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        html = html.replace(new RegExp('(' + escaped + ')', 'gi'), '<mark>$1</mark>');
      });
      return html;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderNav();
    renderFooter();
    initLoadMore();
    initSlideshow();
    initResearchTabs();
    initSearch();
  });
})();
