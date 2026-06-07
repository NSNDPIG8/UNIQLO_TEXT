
let currentMenu = null;
let closeTimeout = null;


// ==========================================================================
// KHỞI TẠO CHUNG KHI TRANG TẢI XONG
// ==========================================================================
window.onload = function () {
    initMegaMenu();
    initSearchOverlay();
    initProductCardInteractivity();
    initScrollEffect();
    initCustomSelect();
    initViewSwitching();
    initPoloCategoryTabs();
    initSweatCategoryTabs();
    initQuanCategoryTabs();
    initAoKhoacCategoryTabs();
    initDamvayCategoryTabs();
    initDolotCategoryTabs();
    initDomacnhaCategoryTabs();
    initPhukienCategoryTabs();
    initSuwCategoryTabs();
    initHeattechCategoryTabs();
};


// ==========================================================================
// TIỆN ÍCH DÙNG CHUNG
// ==========================================================================

// Tạo SVG dấu tick — dùng cho Sort, Custom Select, và các option
function taoSvgTick() {
    const svg  = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    svg.setAttribute('class', 'check-icon');
    svg.setAttribute('width', '16'); svg.setAttribute('height', '16');
    svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor'); svg.setAttribute('stroke-width', '2');
    poly.setAttribute('points', '20 6 9 17 4 12');
    svg.appendChild(poly);
    return svg;
}

// Chọn 1 option trong nhóm: xóa active + tick cũ, thêm mới
function chonOption(options, selected) {
    options.forEach(function (opt) {
        opt.classList.remove('active');
        const tick = opt.querySelector('.check-icon');
        if (tick) tick.remove();
    });
    selected.classList.add('active');
    selected.appendChild(taoSvgTick());
}

// Đồng bộ active cho nhóm tab theo attr (vd: data-view, href)
function syncActive(selector, attr, value) {
    document.querySelectorAll(selector).forEach(function (el) {
        el.classList.toggle('active', el.getAttribute(attr) === value);
    });
}

// Gắn sự kiện click cho nhiều nhóm tab, gọi chung 1 handler
function attachCategoryTabListeners(selectors, handlerName) {
    selectors.forEach(function (selector) {
        document.querySelectorAll(selector).forEach(function (tab) {
            tab.addEventListener('click', function (e) {
                e.preventDefault();
                if (typeof window[handlerName] === 'function') {
                    window[handlerName](this.getAttribute('href'));
                }
            });
        });
    });
}


// ==========================================================================
// MODULE 1: MEGA MENU (HOVER ĐỂ MỞ)
// ==========================================================================
function initMegaMenu() {
    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('mouseenter', function () { openMegaMenu(this.getAttribute('data-menu')); });
        link.addEventListener('mouseleave', startCloseTimeout);
    });
    document.querySelectorAll('.mega-menu').forEach(function (menu) {
        menu.addEventListener('mouseenter', cancelCloseTimeout);
        menu.addEventListener('mouseleave', startCloseTimeout);
    });
}

function openMegaMenu(menuType) {
    cancelCloseTimeout();
    if (currentMenu && currentMenu !== menuType) closeMegaMenu();
    currentMenu = menuType;
    ['.nav-link', '.mega-menu'].forEach(function (sel) {
        document.querySelectorAll(sel).forEach(function (el) {
            el.classList.toggle('active', el.getAttribute('data-menu') === menuType);
        });
    });
}

function closeMegaMenu() {
    document.querySelectorAll('.mega-menu, .nav-link').forEach(function (el) { el.classList.remove('active'); });
    currentMenu = null;
}

function startCloseTimeout() {
    cancelCloseTimeout();
    closeTimeout = setTimeout(closeMegaMenu, 200);
}

function cancelCloseTimeout() {
    if (closeTimeout) { clearTimeout(closeTimeout); closeTimeout = null; }
}


// ==========================================================================
// MODULE 2: LỚP PHỦ TÌM KIẾM (SEARCH OVERLAY)
// ==========================================================================
function initSearchOverlay() {
    const overlay = document.getElementById('search-overlay');
    if (!overlay) return;
    const input = overlay.querySelector('.search-input-real');

    document.querySelectorAll('a[href="#search-overlay"]').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            closeMegaMenu();
            overlay.classList.add('active');
            setTimeout(function () { if (input) input.focus(); }, 300);
        });
    });

    overlay.querySelectorAll('.search-action-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) { e.preventDefault(); closeSearchOverlay(); });
    });

    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSearchOverlay(); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeSearchOverlay(); });
}

function closeSearchOverlay() {
    const overlay = document.getElementById('search-overlay');
    if (!overlay) return;
    const input = overlay.querySelector('.search-input-real');
    overlay.classList.remove('active');
    if (input) { input.blur(); input.value = ''; }
}


// ==========================================================================
// MODULE 3: TAB CATEGORY BONG BÓNG TRÒN
// ==========================================================================
document.addEventListener('click', function (e) {
    const tab = e.target.closest('.cat-tab');
    if (!tab) return;
    const container = tab.closest('.category-tabs-scroll');
    if (!container) return;
    container.querySelectorAll('.cat-tab').forEach(function (t) { t.classList.remove('active'); });
    tab.classList.add('active');
});


// ==========================================================================
// MODULE 4: THANH LỌC SẢN PHẨM (FILTER BAR DROPDOWNS)
// ==========================================================================
const danhSachDropdown = [
    { nutId: 'btn-availability', menuId: 'dropdown-availability' },
    { nutId: 'btn-gender',       menuId: 'dropdown-gender'       },
    { nutId: 'btn-promo',        menuId: 'dropdown-promo'        },
    { nutId: 'btn-size',         menuId: 'dropdown-size'         },
    { nutId: 'btn-color',        menuId: 'dropdown-color'        },
    { nutId: 'btn-price',        menuId: 'dropdown-price'        },
];

function dongTatCaDropdown() {
    danhSachDropdown.forEach(function (item) {
        const nut  = document.getElementById(item.nutId);
        const menu = document.getElementById(item.menuId);
        if (nut)  nut.classList.remove('active');
        if (menu) menu.classList.remove('show');
    });
}

danhSachDropdown.forEach(function (item) {
    const nut  = document.getElementById(item.nutId);
    const menu = document.getElementById(item.menuId);
    if (!nut || !menu) return;

    nut.addEventListener('click', function (e) {
        e.stopPropagation();
        const dangMo = menu.classList.contains('show');
        dongTatCaDropdown();
        if (!dangMo) { nut.classList.add('active'); menu.classList.add('show'); }
    });
    menu.addEventListener('click', function (e) { e.stopPropagation(); });
});

document.querySelectorAll('.dropdown-close').forEach(function (btn) {
    btn.addEventListener('click', function (e) { e.stopPropagation(); dongTatCaDropdown(); });
});
document.addEventListener('click', dongTatCaDropdown);


// ==========================================================================
// MODULE 5: DROPDOWN SẮP XẾP (SORT DROPDOWN)
// ==========================================================================
function initSortDropdown() {
    const sortBtn  = document.getElementById('sort-dropdown-btn');
    const sortMenu = document.getElementById('sort-dropdown-menu');
    const sortText = document.getElementById('sort-text');
    if (!sortBtn || !sortMenu) return;

    sortBtn.addEventListener('click', function (e) { e.stopPropagation(); sortMenu.classList.toggle('show'); });
    sortMenu.addEventListener('click', function (e) { e.stopPropagation(); });

    const options = sortMenu.querySelectorAll('.sort-option');
    options.forEach(function (option) {
        option.addEventListener('click', function () {
            chonOption(options, this);
            if (sortText) sortText.textContent = this.getAttribute('data-text');
            sortMenu.classList.remove('show');
        });
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.sort-dropdown-wrapper')) sortMenu.classList.remove('show');
    });
}
initSortDropdown();


// ==========================================================================
// MODULE 6: THẺ SẢN PHẨM (PRODUCT CARDS)
// ==========================================================================
function initProductCardInteractivity() {

    // Đồng bộ ảnh + swatch theo index
    function activateByIndex(card, index) {
        card.querySelectorAll('.product-color-img').forEach(function (img, i) { img.classList.toggle('active', i === index); });
        card.querySelectorAll('.swatch').forEach(function (sw, i)             { sw.classList.toggle('active',  i === index); });
    }

    // Hover/click swatch chuyển màu
    document.querySelectorAll('.product-card .swatch').forEach(function (swatch) {
        function activate() {
            const card     = swatch.closest('.product-card');
            if (!card) return;
            const swatches = [...card.querySelectorAll('.swatch')];
            activateByIndex(card, swatches.indexOf(swatch));
        }
        swatch.addEventListener('mouseenter', activate);
        swatch.addEventListener('click', function (e) { e.stopPropagation(); activate(); });
    });

    // Nút yêu thích
    document.querySelectorAll('.product-card .wishlist-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation(); e.preventDefault();
            this.classList.toggle('active');
        });
    });

    // Mũi tên trái/phải chuyển ảnh
    function navigateImage(card, direction) {
        const imgs = card.querySelectorAll('.product-color-img');
        if (imgs.length <= 1) return;
        let current = 0;
        imgs.forEach(function (img, i) { if (img.classList.contains('active')) current = i; });
        activateByIndex(card, (current + direction + imgs.length) % imgs.length);
    }

    [{ sel: '.img-nav-prev', dir: -1 }, { sel: '.img-nav-next', dir: 1 }].forEach(function (item) {
        document.querySelectorAll('.product-card ' + item.sel).forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation(); e.preventDefault();
                navigateImage(this.closest('.product-card'), item.dir);
            });
        });
    });

    // Log khi click vào card
    document.querySelectorAll('.product-card').forEach(function (card) {
        card.addEventListener('click', function () {
            console.log('Xem chi tiết sản phẩm ID:', this.getAttribute('data-id'), '-', this.querySelector('.product-title').textContent);
        });
    });
}


// ==========================================================================
// MODULE 7: SCROLL STICKY EFFECT
// ==========================================================================
function initScrollEffect() {
    const SCROLL_VIEWS_TALL = ['view-polo', 'view-sweat', 'view-quandai', 'view-quanshort', 'view-aokhoac', 'view-aobp', 'view-damvay', 'view-dam', 'view-vay', 'view-dolot', 'view-airism', 'view-heattech', 'view-ht', 'view-htextra', 'view-htultra', 'view-htdomactrong', 'view-aobra', 'view-quantat', 'view-dolotkhac', 'view-tat', 'view-domacnha', 'view-pajama', 'view-phukien', 'view-suw', 'view-suwaokhoac', 'view-suwao', 'view-suwquan', 'view-domactrong', 'view-suwphukien'];
    let lastScrollTop = 0;

    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const nguong = SCROLL_VIEWS_TALL.some(function (cls) { return document.body.classList.contains(cls); }) ? 680 : 180;

        if (scrollTop < nguong) {
            document.body.classList.remove('scroll-up', 'scroll-down');
        } else {
            document.body.classList.toggle('scroll-down', scrollTop > lastScrollTop);
            document.body.classList.toggle('scroll-up',   scrollTop < lastScrollTop);
        }
        lastScrollTop = scrollTop;
    });
}


// ==========================================================================
// MODULE 8: CUSTOM SELECT BOX
// ==========================================================================
function initCustomSelect() {
    const wrapper = document.querySelector('.gc-select-wrapper');
    if (!wrapper) return;

    const selectBox    = wrapper.querySelector('.gc-select-box');
    const options      = wrapper.querySelectorAll('.gc-option');
    const selectedText = selectBox.querySelector('span');

    selectBox.addEventListener('click', function (e) { e.stopPropagation(); wrapper.classList.toggle('open'); });

    options.forEach(function (opt) {
        opt.addEventListener('click', function (e) {
            e.stopPropagation();
            chonOption(options, this);
            if (selectedText) selectedText.textContent = this.querySelector('span').textContent;
            wrapper.classList.remove('open');
            const view = this.getAttribute('data-view');
            if (view) switchView(view);
        });
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.gc-select-wrapper')) wrapper.classList.remove('open');
    });
}


// ==========================================================================
// MODULE 9: CHUYỂN ĐỔI VIEW (VIEW SWITCHING)
// ==========================================================================
const HASH_TO_VIEW = {
    '#quan-category-tabs-section':    'quan',
    '#quan-section':                  'quan',
    '#quandai-category-section':      'quan',
    '#quan-jeans-section':            'quan',
    '#quan-ni-section':               'quan',
    '#quan-jogger-section':           'quan',
    '#quan-short-section':            'quan',
    '#quanshort-category-section':    'quan',
    '#quan-short-cargo-section':      'quan',
    '#quan-short-denim-section':      'quan',
    '#quan-short-the-thao-section':   'quan',
    '#sweat-category-section':        'sweat',
    '#sweatshirts-section':           'sweat',
    '#hoodies-section':               'sweat',
    '#ut':                            'ut',
    '#polo':                          'polo',
    '#somi':                          'somi',
    '#all':                           'all',
    '#ao-category-tabs-section':      'ao',
    '#aokhoac-category-tabs-section': 'aokhoac',
    '#aobp-category-section':         'aobp',
    '#dotl-category-tabs-section':    'dolot',
    '#dolot-category-section':        'dolot',
    '#dolot':                         'dolot',
    '#airism-category-section':       'airism',
    '#heattech-category-section':     'heattech',
    '#heattechh-category-tabs-section': 'heattechh',
    '#heattechh':                     'heattechh',
    '#ht':                            'ht',
    '#htextra':                       'htextra',
    '#htultra':                       'htultra',
    '#htdomactrong':                  'htdomactrong',
    '#aobra-category-section':        'aobra',
    '#quantat-category-section':      'quantat',
    '#dolotkhac-category-section':    'dolotkhac',
    '#tat-category-section':          'tat',
};


const VIEW_TO_TARGET = {
    quan:      { fn: 'filterQuan',    target: '#quan-category-tabs-section'    },
    quandai:   { fn: 'filterQuan',    target: '#quandai-category-section'      },
    quanshort: { fn: 'filterQuan',    target: '#quanshort-category-section'    },
    aokhoac:   { fn: 'filterAokhoac', target: '#aokhoac-category-tabs-section' },
    aobp:      { fn: 'filterAokhoac', target: '#aobp-category-section'         },
    ao:        { fn: 'filterAokhoac', target: '#ao-category-section'           },
    damvay:    { fn: 'filterDamvay',  target: '#damvay-category-tabs-section'  },
    dam:       { fn: 'filterDamvay',  target: '#dam-category-section'          },
    vay:       { fn: 'filterDamvay',  target: '#vay-category-section'          },
    dolot:     { fn: 'filterDolot',   target: '#dotl-category-tabs-section'    },
    airism:    { fn: 'filterDolot',   target: '#airism-category-section'       },
    heattech:  { fn: 'filterDolot',   target: '#heattech-category-section'     },
    heattechh: { fn: 'filterHeattechh', target: '#heattechh-category-tabs-section' },
    ht:        { fn: 'filterHeattechh', target: '#ht'                            },
    htextra:   { fn: 'filterHeattechh', target: '#htextra'                       },
    htultra:   { fn: 'filterHeattechh', target: '#htultra'                       },
    htdomactrong: { fn: 'filterHeattechh', target: '#htdomactrong'               },
    aobra:     { fn: 'filterDolot',   target: '#aobra-category-section'        },
    quantat:   { fn: 'filterDolot',   target: '#quantat-category-section'      },
    dolotkhac: { fn: 'filterDolot',   target: '#dolotkhac-category-section'    },
    tat:       { fn: 'filterDolot',   target: '#tat-category-section'          },
    domacnha:  { fn: 'filterDomacnha', target: '#domacnha-category-tabs-section' },
    pajama:    { fn: 'filterDomacnha', target: '#pajama-category-section'        },
    phukien:   { fn: 'filterPhukien',  target: '#phukien-category-tabs-section'  },
    suw:       { fn: 'filterSuw',      target: '#suw-category-tabs-section'      },
    suwaokhoac:{ fn: 'filterSuw',      target: '#suwaokhoac-category-section'    },
    suwao:     { fn: 'filterSuw',      target: '#suwao-category-section'         },
    suwquan:   { fn: 'filterSuw',      target: '#suwquan-category-section'       },
    domactrong:{ fn: 'filterSuw',      target: '#domactrong-category-section'    },
    suwphukien:{ fn: 'filterSuw',      target: '#suwphukien-category-section'    },
};

function initViewSwitching() {
    [
        { sel: '.sub-nav-tab',       attr: 'data-view', fromCat: false },
        { sel: '.only-all .cat-tab', attr: 'data-view', fromCat: false },
        { sel: '.category-item',     attr: 'data-view', fromCat: true  },
    ].forEach(function (group) {
        document.querySelectorAll(group.sel).forEach(function (el) {
            el.addEventListener('click', function (e) {
                const view = this.getAttribute(group.attr);
                if (!view) return;
                e.preventDefault();
                // Nếu click từ category-item thì truyền true để sub-nav KHÔNG bị active
                switchView(view, group.fromCat);
                if (group.fromCat) closeMegaMenu();
            });
        });
    });

    function handleHash(hash) {
        const view = HASH_TO_VIEW[hash];
        if (view) {
            switchView(view);
            if (view === 'quan' && typeof window.filterQuan === 'function') window.filterQuan(hash);
            if (['heattechh', 'ht', 'htextra', 'htultra', 'htdomactrong'].includes(view) && typeof window.filterHeattechh === 'function') window.filterHeattechh(hash);
        }
    }

    handleHash(window.location.hash);
    window.addEventListener('hashchange', function () { handleHash(window.location.hash); });
}

function switchView(view, fromCategoryItem) {
    // Hiện lại tất cả sections trước
    document.querySelectorAll('.products-section').forEach(function (sec) { sec.style.display = ''; });

    // Thay class view- trên body
    document.body.className = document.body.className.split(' ').filter(function (c) { return !c.startsWith('view-'); }).join(' ');
    document.body.classList.add('view-' + view);

    const row = document.querySelector('.filter-results-row');
    if (row) row.style.justifyContent = 'space-between';

    // Đồng bộ active tab
    // Nếu click từ category-item (phần danh mục bên dưới) thì KHÔNG đánh dấu active sub-nav-tab
    // để 2 phần hoạt động tách biệt nhau
    if (!fromCategoryItem) {
        syncActive('.sub-nav-tab', 'data-view', view);
    } else {
        // Xóa active khỏi tất cả sub-nav-tab để không bị in đậm
        document.querySelectorAll('.sub-nav-tab').forEach(function (t) { t.classList.remove('active'); });
    }
    syncActive('.only-all .cat-tab', 'data-view', view);

    // Đồng bộ Custom Select
    const wrapper = document.querySelector('.gc-select-wrapper');
    if (wrapper) {
        const options      = wrapper.querySelectorAll('.gc-option');
        const selectedText = wrapper.querySelector('.gc-select-box span');
        options.forEach(function (opt) {
            const tick     = opt.querySelector('.check-icon');
            const isActive = opt.getAttribute('data-view') === view;
            opt.classList.toggle('active', isActive);
            if (isActive) {
                if (selectedText) selectedText.textContent = opt.querySelector('span').textContent;
                if (!tick) opt.appendChild(taoSvgTick());
            } else {
                if (tick) tick.remove();
            }
        });
    }

    // Giữ nhãn nút lọc giới tính
    const filterGenderBtn = document.getElementById('btn-gender');
    if (filterGenderBtn) {
        filterGenderBtn.innerHTML = 'Giới tính > Danh mục <svg class="dropdown-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>';
    }

    // Nếu view thuộc nhóm có hàm filter riêng → gọi hàm đó rồi thoát sớm
    // VIEW_TO_TARGET tra cứu xem view này cần gọi hàm nào, với targetId nào
    const mapping = VIEW_TO_TARGET[view];
    if (mapping && typeof window[mapping.fn] === 'function') {
        window[mapping.fn](mapping.target);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}


// ==========================================================================
// MODULE 10: BỘ LỌC DANH MỤC (POLO, SWEAT, QUẦN, ÁO KHOÁC, ĐẦM VÁY, ĐỒ LÓT)
// ==========================================================================

// Hàm tổng quát cho Polo & Sweat
function setupCategoryFilter(tabsSelector, sectionsSelector, defaultTabId) {
    const tabs     = document.querySelectorAll(tabsSelector);
    const sections = document.querySelectorAll(sectionsSelector);

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            tabs.forEach(function (t) { t.classList.remove('active'); });
            tabs.forEach(function (t) { if (t.getAttribute('href') === targetId) t.classList.add('active'); });

            if (targetId === defaultTabId) {
                sections.forEach(function (sec) { sec.style.display = 'block'; });
            } else {
                sections.forEach(function (sec) { sec.style.display = 'none'; });
                const active = document.querySelector(targetId);
                if (active) active.style.display = 'block';
            }
        });
    });
}

function initPoloCategoryTabs() {
    setupCategoryFilter('#product-category-section .cat-tab', '.products-section.only-polo', '#product-category-section');
}

function initSweatCategoryTabs() {
    setupCategoryFilter('#sweat-category-section .cat-tab', '.products-section.only-sweat', '#sweat-category-section');
}


// --- QUẦN ---
const QUAN_VIEW_MAP = {
    '#quandai-category-section':    'view-quandai',
    '#quan-jeans-section':          'view-quandai',
    '#quan-ni-section':             'view-quandai',
    '#quan-jogger-section':         'view-quandai',
    '#quanshort-category-section':  'view-quanshort',
    '#quan-short-section':          'view-quanshort',
    '#quan-short-cargo-section':    'view-quanshort',
    '#quan-short-denim-section':    'view-quanshort',
    '#quan-short-the-thao-section': 'view-quanshort',
};
const QUANDAI_CHILDREN   = ['#quan-jeans-section', '#quan-ni-section', '#quan-jogger-section'];
const QUANSHORT_CHILDREN = ['#quan-short-section', '#quan-short-cargo-section', '#quan-short-denim-section', '#quan-short-the-thao-section'];

window.filterQuan = function (targetId) {
    const sections = document.querySelectorAll('.products-section.only-quan');
    if (!targetId || targetId === '#quan-section' || targetId === '#quan') targetId = '#quan-category-tabs-section';

    // Cập nhật class view- trên body
    const targetView = QUAN_VIEW_MAP[targetId];
    ['view-quan', 'view-quandai', 'view-quanshort'].forEach(function (cls) { document.body.classList.remove(cls); });
    document.body.classList.add(targetView || 'view-quan');

    // Ẩn/hiện thanh subnav phụ
    const subnav = document.querySelector('.subcategory-nav-wrapper-quan');
    if (subnav) subnav.classList.toggle('first-page', targetId === '#quan-category-tabs-section');

    // Đồng bộ tab
    syncActive('#quan-category-tabs-section .cat-tab', 'href', targetId);
    document.querySelectorAll('.subcategory-nav-wrapper-quan .sub-nav-tab-quan').forEach(function (t) {
        const href     = t.getAttribute('href');
        const isActive = href === targetId
            || (href === '#quandai-category-section'   && QUANDAI_CHILDREN.includes(targetId))
            || (href === '#quanshort-category-section' && QUANSHORT_CHILDREN.includes(targetId));
        t.classList.toggle('active', isActive);
    });
    syncActive('#quandai-category-section .cat-tab', 'href', targetId);
    document.querySelectorAll('#quanshort-category-section .cat-tab').forEach(function (t) {
        const isAll = t.id === 'short-tab-all' && targetId === '#quanshort-category-section';
        t.classList.toggle('active', t.getAttribute('href') === targetId || isAll);
    });

    // Ẩn/hiện sections sản phẩm
    if (targetId === '#quan-category-tabs-section') {
        sections.forEach(function (sec) { sec.style.display = (!sec.classList.contains('only-quandai') && !sec.classList.contains('only-quanshort')) ? 'block' : 'none'; });
    } else if (targetId === '#quandai-category-section') {
        sections.forEach(function (sec) { sec.style.display = sec.classList.contains('only-quandai') ? 'block' : 'none'; });
    } else if (targetId === '#quanshort-category-section') {
        sections.forEach(function (sec) { sec.style.display = sec.classList.contains('only-quanshort') ? 'block' : 'none'; });
    } else {
        sections.forEach(function (sec) { sec.style.display = 'none'; });
        const active = document.querySelector(targetId);
        if (active) active.style.display = 'block';
    }
};

function initQuanCategoryTabs() {
    attachCategoryTabListeners([
        '#quan-category-tabs-section .cat-tab',
        '.subcategory-nav-wrapper-quan .sub-nav-tab-quan',
        '#quandai-category-section .cat-tab',
        '#quanshort-category-section .cat-tab',
    ], 'filterQuan');
}


// ==========================================================================
// HÀM CHUNG CHO CÁC DANH MỤC CÓ CẤU TRÚC TƯƠNG TỰ
// ==========================================================================
function filterCategory(config, targetId) {
    // 1. Chuẩn hoá targetId nếu không hợp lệ
    if (!targetId || config.resetIds.includes(targetId)) targetId = config.defaultId;

    // 2. Cập nhật class view- trên body
    const targetView = config.viewMap[targetId];
    config.allViewClasses.forEach(function (cls) { document.body.classList.remove(cls); });
    document.body.classList.add(targetView || config.defaultView);

    // 3. Ẩn/hiện thanh subnav phụ
    const subnav = document.querySelector(config.subnavSelector);
    if (subnav) {
        if (targetId === config.defaultId) { subnav.classList.add('first-page'); }
        else { subnav.classList.remove('first-page'); }
    }

    // 4. Đồng bộ tab active
    config.tabSync.forEach(function (item) { syncActive(item.selector, item.attr, targetId); });

    // 5. Ẩn/hiện sections sản phẩm
    const sections = document.querySelectorAll(config.sectionsSelector);
    const showClass = config.sectionRules[targetId];

    if (showClass === 'all') {
        // Hiện tất cả sections
        sections.forEach(function (sec) { sec.style.display = 'block'; });
    } else if (showClass) {
        // Hiện section có class khớp, ẩn phần còn lại
        sections.forEach(function (sec) { sec.style.display = sec.classList.contains(showClass) ? 'block' : 'none'; });
    } else {
        // Không khớp rule nào → ẩn tất cả, hiện đúng 1 section theo id
        sections.forEach(function (sec) { sec.style.display = 'none'; });
        const active = document.querySelector(targetId);
        if (active) active.style.display = 'block';
    }
}

// Danh sách tất cả class view- cần xoá khi chuyển view
// (dùng chung cho Áo Khoác / Đầm Váy / Đồ Lót)
const ALL_VIEW_CLASSES = ['view-all', 'view-polo', 'view-ut', 'view-somi', 'view-sweat', 'view-quan', 'view-quandai', 'view-quanshort', 'view-aokhoac', 'view-aobp', 'view-ao', 'view-damvay', 'view-dam', 'view-vay', 'view-dolot', 'view-airism', 'view-heattech', 'view-ht', 'view-htextra', 'view-htultra', 'view-htdomactrong', 'view-aobra', 'view-quantat', 'view-dolotkhac', 'view-tat', 'view-domacnha', 'view-pajama', 'view-phukien', 'view-suw', 'view-suwaokhoac', 'view-suwao', 'view-suwquan', 'view-domactrong', 'view-suwphukien'];


// --- ÁO KHOÁC ---
const AOKHOAC_CONFIG = {
    viewMap:           { '#aokhoac-category-tabs-section': 'view-aokhoac', '#aokhoac-category-section': 'view-aokhoac', '#aobp-category-section': 'view-aobp', '#ao-category-section': 'view-ao' },
    defaultId:         '#aokhoac-category-tabs-section',
    defaultView:       'view-aokhoac',
    resetIds:          ['#aokhoac', '#aokhoac-category-tabs-section', '#aokhoac-category-section'],
    sectionsSelector:  '.products-section.only-aokhoac, .products-section.only-aobp, .products-section.only-ao',
    subnavSelector:    '.subcategory-nav-wrapper-aokhoac',
    allViewClasses:    ALL_VIEW_CLASSES,
    tabSync:           [
        { selector: '#aokhoac-category-tabs-section .cat-tab',              attr: 'href' },
        { selector: '.subcategory-nav-wrapper-aokhoac .sub-nav-tab-aokhoac', attr: 'href' },
    ],
    sectionRules: {
        '#aokhoac-category-tabs-section': 'only-aokhoac',
        '#aobp-category-section':         'only-aobp',
        '#ao-category-section':           'only-ao',
    },
};
window.filterAokhoac = function (targetId) { filterCategory(AOKHOAC_CONFIG, targetId); };

function initAoKhoacCategoryTabs() {
    attachCategoryTabListeners([
        '#aokhoac-category-tabs-section .cat-tab',
        '.subcategory-nav-wrapper-aokhoac .sub-nav-tab-aokhoac',
    ], 'filterAokhoac');
}


// --- ĐẦM VÁY ---
const DAMVAY_CONFIG = {
    viewMap:           { '#damvay-category-tabs-section': 'view-damvay', '#dam-category-section': 'view-dam', '#vay-category-section': 'view-vay' },
    defaultId:         '#damvay-category-tabs-section',
    defaultView:       'view-damvay',
    resetIds:          ['#damvay', '#damvay-category-tabs-section', '#damvay-category-section'],
    sectionsSelector:  '.products-section.only-damvay, .products-section.only-dam, .products-section.only-vay',
    subnavSelector:    '.subcategory-nav-wrapper-damvay',
    allViewClasses:    ALL_VIEW_CLASSES,
    tabSync:           [
        { selector: '#damvay-category-tabs-section .cat-tab',              attr: 'href' },
        { selector: '.subcategory-nav-wrapper-damvay .sub-nav-tab-damvay', attr: 'href' },
    ],
    sectionRules: {
        '#damvay-category-tabs-section': 'only-damvay',
        '#dam-category-section':         'only-dam',
        '#vay-category-section':         'only-vay',
    },
};
window.filterDamvay = function (targetId) { filterCategory(DAMVAY_CONFIG, targetId); };

function initDamvayCategoryTabs() {
    attachCategoryTabListeners([
        '#damvay-category-tabs-section .cat-tab',
        '.subcategory-nav-wrapper-damvay .sub-nav-tab-damvay',
    ], 'filterDamvay');
}


// --- ĐỒ LÓT ---
const DOLOT_CONFIG = {
    viewMap:           { '#dotl-category-tabs-section': 'view-dolot', '#airism-category-section': 'view-airism', '#heattech-category-section': 'view-heattech', '#aobra-category-section': 'view-aobra', '#quantat-category-section': 'view-quantat', '#dolotkhac-category-section': 'view-dolotkhac', '#tat-category-section': 'view-tat' },
    defaultId:         '#dotl-category-tabs-section',
    defaultView:       'view-dolot',
    resetIds:          ['#dolot', '#dotl-category-tabs-section', '#dotl-category-section'],
    sectionsSelector:  '.products-section.only-dolot, .products-section.only-airism, .products-section.only-heattech, .products-section.only-aobra, .products-section.only-quantat, .products-section.only-dolotkhac, .products-section.only-tat',
    subnavSelector:    '.subcategory-nav-wrapper-dolot',
    allViewClasses:    ALL_VIEW_CLASSES,
    tabSync:           [
        { selector: '#dotl-category-tabs-section .cat-tab',              attr: 'href' },
        { selector: '.subcategory-nav-wrapper-dolot .sub-nav-tab-dolot', attr: 'href' },
    ],
    sectionRules: {
        '#dotl-category-tabs-section':  'only-dolot',
        '#airism-category-section':     'only-airism',
        '#heattech-category-section':   'only-heattech',
        '#aobra-category-section':      'only-aobra',
        '#quantat-category-section':    'only-quantat',
        '#dolotkhac-category-section':  'only-dolotkhac',
        '#tat-category-section':        'only-tat',
    },
};
window.filterDolot = function (targetId) { filterCategory(DOLOT_CONFIG, targetId); };

function initDolotCategoryTabs() {
    attachCategoryTabListeners([
        '#dotl-category-tabs-section .cat-tab',
        '.subcategory-nav-wrapper-dolot .sub-nav-tab-dolot',
    ], 'filterDolot');
}


// ==========================================================================
// MODULE: HEATTECH
// ==========================================================================
const HEATTECHH_CONFIG = {
    viewMap:           { 
        '#heattechh-category-tabs-section': 'view-heattechh',
        '#heattechh': 'view-heattechh',
        '#ht': 'view-ht',
        '#htextra': 'view-htextra',
        '#htultra': 'view-htultra',
        '#htdomactrong': 'view-htdomactrong'
    },
    defaultId:         '#heattechh-category-tabs-section',
    defaultView:       'view-heattechh',
    resetIds:          ['#heattechh', '#heattechh-category-tabs-section'],
    sectionsSelector:  '.products-section.only-heattechh, .products-section.only-ht, .products-section.only-htextra, .products-section.only-htultra, .products-section.only-htdomactrong',
    subnavSelector:    '.subcategory-nav-wrapper-heattechh',
    allViewClasses:    ALL_VIEW_CLASSES,
    tabSync:           [
        { selector: '.only-heattechh .cat-tab',                  attr: 'href' },
        { selector: '.subcategory-nav-wrapper-heattechh .sub-nav-tab-heattech', attr: 'href' },
    ],
    sectionRules: {
        '#heattechh-category-tabs-section': 'only-heattechh',
        '#ht': 'only-ht',
        '#htextra': 'only-htextra',
        '#htultra': 'only-htultra',
        '#htdomactrong': 'only-htdomactrong',
    },
};
window.filterHeattechh = function (targetId) { filterCategory(HEATTECHH_CONFIG, targetId); };

function initHeattechCategoryTabs() {
    attachCategoryTabListeners([
        '.only-heattechh .cat-tab',
        '.subcategory-nav-wrapper-heattechh .sub-nav-tab-heattech',
    ], 'filterHeattechh');
}


// ==========================================================================
// MODULE: ĐỒ MẶC NHÀ (DOMACNHA)
// ==========================================================================
const DOMACNHA_CONFIG = {
    viewMap:           { '#domacnha-category-tabs-section': 'view-domacnha', '#pajama-category-section': 'view-pajama' },
    defaultId:         '#domacnha-category-tabs-section',
    defaultView:       'view-domacnha',
    resetIds:          ['#domacnha', '#domacnha-category-tabs-section', '#domacnha-category-section'],
    sectionsSelector:  '.products-section.only-domacnha, .products-section.only-pajama',
    subnavSelector:    '.subcategory-nav-wrapper-domacnha',
    allViewClasses:    ALL_VIEW_CLASSES,
    tabSync:           [
        { selector: '#domacnha-category-tabs-section .cat-tab',                  attr: 'href' },
        { selector: '.subcategory-nav-wrapper-domacnha .sub-nav-tab-domacnha', attr: 'href' },
    ],
    sectionRules: {
        '#domacnha-category-tabs-section': 'only-domacnha',
        '#pajama-category-section':        'only-pajama',
    },
};
window.filterDomacnha = function (targetId) { filterCategory(DOMACNHA_CONFIG, targetId); };

function initDomacnhaCategoryTabs() {
    attachCategoryTabListeners([
        '#domacnha-category-tabs-section .cat-tab',
        '.subcategory-nav-wrapper-domacnha .sub-nav-tab-domacnha',
    ], 'filterDomacnha');
}

// ==========================================================================
// MODULE: PHỤ KIỆN (PHUKIEN)
// ==========================================================================
window.filterPhukien = function () {
    document.body.classList.add('view-phukien');
    document.querySelectorAll('.products-section').forEach(function (sec) { sec.style.display = sec.classList.contains('only-phukien') ? 'block' : 'none'; });
};

function initPhukienCategoryTabs() {
    attachCategoryTabListeners([
        '#phukien-category-tabs-section .cat-tab',
        '.subcategory-nav-wrapper-phukien .sub-nav-tab-phukien',
    ], 'filterPhukien');
}


// ==========================================================================
// MODULE: PHỤ KIỆN (PHUKIEN)
// ==========================================================================
const PHUKIEN_CONFIG = {
    viewMap:           { '#phukien-category-tabs-section': 'view-phukien' },
    defaultId:         '#phukien-category-tabs-section',
    defaultView:       'view-phukien',
    resetIds:          ['#phukien', '#phukien-category-tabs-section', '#phukien-category-section'],
    sectionsSelector:  '.products-section.only-phukien',
    subnavSelector:    '.subcategory-nav-wrapper-phukien',
    allViewClasses:    ALL_VIEW_CLASSES,
    tabSync:           [
        { selector: '#phukien-category-tabs-section .cat-tab',                  attr: 'href' },
        { selector: '.subcategory-nav-wrapper-phukien .sub-nav-tab-phukien',   attr: 'href' },
    ],
    sectionRules: {
        '#phukien-category-tabs-section': 'only-phukien',
    },
};
window.filterPhukien = function (targetId) { filterCategory(PHUKIEN_CONFIG, targetId); };

function initPhukienCategoryTabs() {
    attachCategoryTabListeners([
        '#phukien-category-tabs-section .cat-tab',
        '.subcategory-nav-wrapper-phukien .sub-nav-tab-phukien',
    ], 'filterPhukien');
}

// ==========================================================================
// MODULE: SPORT UTILITY WEAR (SUW)
// ==========================================================================
const SUW_CONFIG = {
    viewMap: {
        '#suw-category-tabs-section':   'view-suw',
        '#suwaokhoac-category-section': 'view-suwaokhoac',
        '#suwao-category-section':      'view-suwao',
        '#suwquan-category-section':    'view-suwquan',
        '#domactrong-category-section': 'view-domactrong',
        '#suwphukien-category-section': 'view-suwphukien'
    },
    defaultId:         '#suw-category-tabs-section',
    defaultView:       'view-suw',
    resetIds:          ['#suw', '#suw-category-tabs-section'],
    sectionsSelector:  '.products-section.only-suwaokhoac, .products-section.only-suwao, .products-section.only-suwquan, .products-section.only-domactrong, .products-section.only-suwphukien',
    subnavSelector:    '.subcategory-nav-wrapper-suw',
    allViewClasses:    ALL_VIEW_CLASSES,
    tabSync:           [
        { selector: '#suw-category-tabs-section .cat-tab, .cat-tab-suw', attr: 'href' },
        { selector: '.subcategory-nav-wrapper-suw .sub-nav-tab-suw',      attr: 'href' }
    ],
    sectionRules: {
        '#suw-category-tabs-section':   'all',
        '#suwaokhoac-category-section': 'only-suwaokhoac',
        '#suwao-category-section':      'only-suwao',
        '#suwquan-category-section':    'only-suwquan',
        '#domactrong-category-section': 'only-domactrong',
        '#suwphukien-category-section': 'only-suwphukien',
    },
};
window.filterSuw = function (targetId) { filterCategory(SUW_CONFIG, targetId); };

function initSuwCategoryTabs() {
    attachCategoryTabListeners([
        '#suw-category-tabs-section .cat-tab, .cat-tab-suw',
        '.subcategory-nav-wrapper-suw .sub-nav-tab-suw',
    ], 'filterSuw');
}