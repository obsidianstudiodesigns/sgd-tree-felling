/* SGD Professional Tree Felling — site behaviour
   Plain ES5-friendly JS, no dependencies. */

(function () {
    'use strict';

    /* ---------------------------------------------------------------
       Sticky header state
       --------------------------------------------------------------- */
    var header = document.querySelector('.site-header');

    if (header) {
        var onScroll = function () {
            if (window.scrollY > 12) {
                header.classList.add('is-stuck');
            } else {
                header.classList.remove('is-stuck');
            }
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---------------------------------------------------------------
       Mobile navigation
       --------------------------------------------------------------- */
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.primary-nav');
    var backdrop = document.querySelector('.nav-backdrop');

    function closeNav() {
        if (!nav) return;
        nav.classList.remove('is-open');
        if (backdrop) backdrop.classList.remove('is-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
        document.body.style.removeProperty('overflow');
    }

    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            var open = nav.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            if (backdrop) backdrop.classList.toggle('is-open', open);
            document.body.style.overflow = open ? 'hidden' : '';
        });

        nav.addEventListener('click', function (e) {
            if (e.target.tagName === 'A') closeNav();
        });
    }

    if (backdrop) backdrop.addEventListener('click', closeNav);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeNav();
    });

    /* ---------------------------------------------------------------
       Reveal on scroll (skipped when the visitor prefers reduced motion)
       --------------------------------------------------------------- */
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var revealables = document.querySelectorAll('[data-reveal]');

    if (!reduced && 'IntersectionObserver' in window && revealables.length) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                var delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
                window.setTimeout(function () { el.classList.add('is-in'); }, delay);
                observer.unobserve(el);
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

        Array.prototype.forEach.call(revealables, function (el) { observer.observe(el); });
    } else {
        Array.prototype.forEach.call(revealables, function (el) { el.classList.add('is-in'); });
    }

    /* ---------------------------------------------------------------
       Gallery lightbox
       --------------------------------------------------------------- */
    var cards = document.querySelectorAll('[data-lightbox]');
    var box = document.querySelector('.lightbox');

    if (cards.length && box) {
        var boxImg = box.querySelector('img');
        var boxVideo = box.querySelector('.lightbox__video');
        var boxCaption = box.querySelector('.lightbox__caption');
        var index = 0;
        var lastFocused = null;

        var items = Array.prototype.map.call(cards, function (card) {
            var img = card.querySelector('img');
            return {
                src: card.getAttribute('data-full') || img.getAttribute('src'),
                video: card.getAttribute('data-video') || '',
                caption: card.getAttribute('data-caption') || img.getAttribute('alt') || ''
            };
        });

        // A card may hold a clip rather than a photograph. Unloading the source
        // on the way out stops it downloading in the background once closed.
        function unloadVideo() {
            if (!boxVideo) return;
            boxVideo.pause();
            boxVideo.removeAttribute('src');
            boxVideo.load();
            boxVideo.hidden = true;
        }

        function show(i) {
            index = (i + items.length) % items.length;
            var item = items[index];

            unloadVideo();

            if (item.video && boxVideo) {
                boxImg.hidden = true;
                boxVideo.hidden = false;
                boxVideo.setAttribute('poster', item.src);
                boxVideo.setAttribute('src', item.video);
            } else {
                boxImg.hidden = false;
                boxImg.setAttribute('src', item.src);
                boxImg.setAttribute('alt', item.caption);
            }

            boxCaption.textContent = item.caption;
        }

        function openBox(i) {
            lastFocused = document.activeElement;
            show(i);
            box.classList.add('is-open');
            box.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            box.querySelector('.lightbox__close').focus();
        }

        function closeBox() {
            unloadVideo();
            box.classList.remove('is-open');
            box.setAttribute('aria-hidden', 'true');
            document.body.style.removeProperty('overflow');
            if (lastFocused) lastFocused.focus();
        }

        Array.prototype.forEach.call(cards, function (card, i) {
            card.addEventListener('click', function () { openBox(i); });
        });

        box.querySelector('.lightbox__close').addEventListener('click', closeBox);
        box.querySelector('.lightbox__nav--prev').addEventListener('click', function () { show(index - 1); });
        box.querySelector('.lightbox__nav--next').addEventListener('click', function () { show(index + 1); });

        box.addEventListener('click', function (e) {
            if (e.target === box) closeBox();
        });

        document.addEventListener('keydown', function (e) {
            if (!box.classList.contains('is-open')) return;
            if (e.key === 'Escape') closeBox();
            if (e.target === boxVideo) return;
            if (e.key === 'ArrowLeft') show(index - 1);
            if (e.key === 'ArrowRight') show(index + 1);
        });
    }

    /* ---------------------------------------------------------------
       Quote form
       ---------------------------------------------------------------
       No server is required to host this site, so the form hands the
       enquiry to the visitor's own mail client with everything filled
       in. To switch to a hosted form service later, give the <form> a
       real action/method and delete this block.
       --------------------------------------------------------------- */
    var form = document.querySelector('[data-mail-form]');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!form.reportValidity()) return;

            var get = function (name) {
                var el = form.elements[name];
                return el ? String(el.value).trim() : '';
            };

            var address = form.getAttribute('data-mail-to');
            var subject = 'Quote request — ' + (get('service') || 'Tree work') +
                          (get('town') ? ' (' + get('town') + ')' : '');

            var lines = [
                'Name: ' + get('name'),
                'Phone: ' + get('phone'),
                'Email: ' + get('email'),
                'Town / area: ' + get('town'),
                'Service needed: ' + get('service'),
                '',
                'Details:',
                get('message'),
                '',
                '— Sent from the SGD Tree Felling website'
            ];

            window.location.href = 'mailto:' + address +
                '?subject=' + encodeURIComponent(subject) +
                '&body=' + encodeURIComponent(lines.join('\n'));

            var status = form.querySelector('.form-status');
            if (status) status.classList.add('is-visible');
        });
    }

    /* ---------------------------------------------------------------
       Footer year
       --------------------------------------------------------------- */
    var year = document.querySelector('[data-year]');
    if (year) year.textContent = new Date().getFullYear();
}());
