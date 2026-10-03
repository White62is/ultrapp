import AOS from 'aos';
import 'aos/dist/aos.css';

(() => {
  'use strict';

  // Inicialização refinada do AOS com pequeno delay para prevenir "flash" visual (FOUC)
  const initAOS = () => {
    // Configurar elementos .reveal com atributos do AOS para animações elegantes
    document.querySelectorAll('.reveal').forEach(el => {
      if (!el.hasAttribute('data-aos')) {
        el.setAttribute('data-aos', 'fade-up');
      }
    });

    // Escalonamento em cascata nos grids de benefícios, categorias, passos e planos
    document.querySelectorAll('.benefits-grid, .category-grid, .steps-grid, .plans-grid').forEach(grid => {
      grid.querySelectorAll('.reveal').forEach((item, idx) => {
        if (!item.hasAttribute('data-aos-delay')) {
          item.setAttribute('data-aos-delay', String(Math.min((idx % 4) * 90, 360)));
        }
      });
    });

    // Pequeno delay na inicialização (requestAnimationFrame + 60ms) para que os elementos
    // já visíveis ao carregar a página não sofram "flash" visual ou saltos de layout
    requestAnimationFrame(() => {
      setTimeout(() => {
        AOS.init({
          duration: 800,
          easing: 'ease-out-cubic',
          once: true,
          offset: 40,
          delay: 0,
          startEvent: 'DOMContentLoaded',
          disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
        });
        AOS.refresh();
      }, 60);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAOS);
  } else {
    initAOS();
  }

  // Gerenciamento do Skeleton Loading e Spinner Centralizado no Catálogo
  const setupCatalogLoading = () => {
    const posterImages = document.querySelectorAll('.poster-image');
    const catalogLoader = document.getElementById('catalog-loader');

    if (!posterImages.length) return;

    let loadedCount = 0;
    const requiredBatch = Math.min(6, posterImages.length);

    posterImages.forEach(container => {
      const img = container.querySelector('img');
      if (!img) return;

      const markAsLoaded = () => {
        container.classList.add('is-loaded');
        img.classList.add('is-loaded');
        loadedCount++;
        if (loadedCount >= requiredBatch && catalogLoader) {
          catalogLoader.classList.add('is-hidden');
        }
      };

      if (img.complete && img.naturalWidth !== 0) {
        markAsLoaded();
      } else {
        img.addEventListener('load', markAsLoaded, { once: true });
        img.addEventListener('error', markAsLoaded, { once: true });
      }
    });

    // Timeout de segurança para ocultar o spinner caso a conexão esteja lenta
    setTimeout(() => {
      if (catalogLoader) catalogLoader.classList.add('is-hidden');
      posterImages.forEach(c => c.classList.add('is-loaded'));
    }, 1800);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupCatalogLoading);
  } else {
    setupCatalogLoading();
  }

  // Gerenciamento do Menu Lateral Mobile (Drawer)
  const menuToggle = document.querySelector('#menu-toggle');
  const mobileDrawer = document.querySelector('#mobile-drawer');
  const drawerOverlay = document.querySelector('#drawer-overlay');
  const drawerClose = document.querySelector('#drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-btn, .drawer-wa-btn');

  const openDrawer = () => {
    if (!mobileDrawer || !drawerOverlay) return;
    menuToggle?.classList.add('is-active');
    menuToggle?.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    drawerOverlay.classList.add('is-open');
    drawerOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open');
  };

  const closeDrawer = () => {
    if (!mobileDrawer || !drawerOverlay) return;
    menuToggle?.classList.remove('is-active');
    menuToggle?.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    drawerOverlay.classList.remove('is-open');
    drawerOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');
  };

  menuToggle?.addEventListener('click', () => {
    if (mobileDrawer?.classList.contains('is-open')) closeDrawer();
    else openDrawer();
  });

  drawerClose?.addEventListener('click', closeDrawer);
  drawerOverlay?.addEventListener('click', closeDrawer);
  drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

  // Configuração dos 6 dispositivos suportados com orientações personalizadas
  const deviceData = [
    {
      name: 'Smart TV',
      file: 'assets/devices-0.jpg',
      description: 'Sua sala pode ser o melhor lugar para dar play. Informe o modelo da sua Smart TV e receba as orientações para configurar o aplicativo.',
      waMessage: 'Olá! Gostaria de testar a UltraPlay na minha Smart TV.'
    },
    {
      name: 'TV Box',
      file: 'assets/devices-1.jpeg',
      description: 'Conecte sua TV Box à internet e leve a experiência UltraPlay para a televisão. Nossa equipe orienta a configuração para o seu modelo.',
      waMessage: 'Olá! Gostaria de testar a UltraPlay na minha TV Box.'
    },
    {
      name: 'Fire TV Stick',
      file: 'assets/devices-2.jpeg',
      description: 'Use seu Fire TV Stick para explorar a UltraPlay com máxima performance. Fale com a equipe para receber as orientações de instalação e acesso.',
      waMessage: 'Olá! Gostaria de testar a UltraPlay no meu Fire TV Stick.'
    },
    {
      name: 'Xiaomi Mi Stick',
      file: 'assets/devices-3.jpeg',
      description: 'Seu Mi Stick também pode fazer parte da experiência. Informe o modelo no WhatsApp para receber as instruções do aplicativo.',
      waMessage: 'Olá! Gostaria de testar a UltraPlay no meu Xiaomi Mi Stick.'
    },
    {
      name: 'Notebook',
      file: 'assets/devices-4.jpeg',
      description: 'Aproveite todo o conteúdo na tela do seu computador ou notebook. Peça à equipe as orientações de acesso direto no navegador ou app.',
      waMessage: 'Olá! Gostaria de testar a UltraPlay no meu Notebook.'
    },
    {
      name: 'Celular',
      file: 'assets/devices-5.jpeg',
      description: 'Leve seu próximo play no bolso. Informe se seu celular é Android ou iPhone para receber as orientações de acesso.',
      waMessage: 'Olá! Gostaria de testar a UltraPlay no meu Celular.'
    }
  ];

  // Gerenciamento do Modal de Informações Específicas do Dispositivo
  const deviceDialog = document.querySelector('#device-dialog');
  const deviceDialogClose = document.querySelector('#device-dialog-close');
  const deviceDialogCancel = document.querySelector('#device-dialog-cancel');
  const deviceDialogImg = document.querySelector('#device-dialog-img');
  const deviceDialogTitle = document.querySelector('#device-dialog-title');
  const deviceDialogDesc = document.querySelector('#device-dialog-desc');
  const deviceDialogBtn = document.querySelector('#device-dialog-btn');

  function openDeviceModal(index) {
    if (!deviceDialog || !deviceData[index]) return;
    const item = deviceData[index];
    if (deviceDialogImg) {
      deviceDialogImg.src = item.file;
      deviceDialogImg.alt = item.name;
    }
    if (deviceDialogTitle) deviceDialogTitle.textContent = item.name;
    if (deviceDialogDesc) deviceDialogDesc.textContent = item.description;
    if (deviceDialogBtn) {
      deviceDialogBtn.href = `https://wa.me/558781584372?text=${encodeURIComponent(item.waMessage)}`;
    }
    deviceDialog.showModal();
    document.body.classList.add('modal-open');
  }

  document.querySelectorAll('[data-open-device]').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = Number(btn.dataset.openDevice) || 0;
      openDeviceModal(index);
    });
  });

  deviceDialogClose?.addEventListener('click', () => deviceDialog?.close());
  deviceDialogCancel?.addEventListener('click', () => deviceDialog?.close());
  if (deviceDialog) {
    deviceDialog.addEventListener('click', event => {
      if (event.target === deviceDialog) deviceDialog.close();
    });
    deviceDialog.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
    });
  }

  // Gerenciamento do Modal de Teste Grátis
  const dialog = document.querySelector('#trial-dialog');
  let returnFocus = null;

  function openTrial(trigger) {
    if (!dialog || dialog.open) return;
    returnFocus = trigger || document.activeElement;
    dialog.showModal();
    document.body.classList.add('modal-open');
  }

  document.querySelectorAll('[data-open-trial]').forEach(btn => {
    btn.addEventListener('click', () => openTrial(btn));
  });

  document.querySelectorAll('.dialog-close, .dialog-later').forEach(btn => {
    btn.addEventListener('click', () => dialog?.close());
  });

  if (dialog) {
    dialog.addEventListener('click', event => {
      if (event.target === dialog) {
        const box = dialog.getBoundingClientRect();
        if (
          event.clientX < box.left ||
          event.clientX > box.right ||
          event.clientY < box.top ||
          event.clientY > box.bottom
        ) {
          dialog.close();
        }
      }
    });

    dialog.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
      if (returnFocus instanceof HTMLElement && returnFocus !== document.body) {
        returnFocus.focus({ preventScroll: true });
      }
    });

    dialog.querySelector('a')?.addEventListener('click', () => dialog.close());
  }

  // Animação de entrada suave no Scroll (Intersection Observer)
  document.body.classList.add('motion-enabled');
  if ('IntersectionObserver' in window) {
    document.body.classList.add('js-motion');

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible', 'is-revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Contador animado de catálogo (+230 mil)
    const countEl = document.querySelector('[data-count]');
    if (countEl) {
      const counterObs = new IntersectionObserver(entries => {
        if (!entries.some(e => e.isIntersecting)) return;
        counterObs.disconnect();

        const target = Number(countEl.dataset.count) || 230;
        const duration = 1600;
        const start = performance.now();

        const tick = now => {
          const progress = Math.min((now - start) / duration, 1);
          const current = Math.floor(progress * target);
          countEl.textContent = current.toString();
          if (progress < 1) requestAnimationFrame(tick);
          else countEl.textContent = target.toString();
        };

        requestAnimationFrame(tick);
      });

      counterObs.observe(countEl);
    }
  }

  // Barra de progresso de leitura e cabeçalho fixo
  let scrollScheduled = false;
  const progress = document.querySelector('#reading-progress');
  const header = document.querySelector('.site-header');

  const updateScroll = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) {
      const ratio = totalHeight > 0 ? window.scrollY / totalHeight : 0;
      progress.style.transform = `scaleX(${ratio})`;
    }
    if (header) {
      header.classList.toggle('header-scrolled', window.scrollY > 40);
    }
    scrollScheduled = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!scrollScheduled) {
        scrollScheduled = true;
        requestAnimationFrame(updateScroll);
      }
    },
    { passive: true }
  );
  updateScroll();

  // Acordeão de Perguntas Frequentes (FAQ)
  document.querySelectorAll('[data-faq-group] details').forEach(detail => {
    detail.addEventListener('toggle', () => {
      if (detail.open) {
        document.querySelectorAll('[data-faq-group] details').forEach(other => {
          if (other !== detail && other.open) {
            other.removeAttribute('open');
          }
        });
      }
      setTimeout(() => AOS.refresh(), 300);
    });
  });

  // =========================================================================
  // INDICADOR VISUAL DE PROGRESSO DE ATIVAÇÃO NOS BOTÕES DO WHATSAPP
  // =========================================================================
  const setupWhatsAppProgress = () => {
    const waButtons = document.querySelectorAll('a[href*="wa.me"]');

    waButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Evitar sobreposição de cliques repetidos durante ativação em andamento
        if (btn.classList.contains('wa-activating')) return;

        const originalContent = btn.innerHTML;
        btn.classList.add('wa-activating');

        // Fase 1: Feedback imediato com spinner e texto de ativação
        btn.innerHTML = `
          <span class="wa-activating-spinner" aria-hidden="true"></span>
          <span>Iniciando ativação...</span>
        `;

        // Fase 2: Confirmação de redirecionamento para o WhatsApp
        setTimeout(() => {
          if (btn.classList.contains('wa-activating')) {
            btn.innerHTML = `
              <span class="wa-activating-check" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
              <span>Abrindo WhatsApp...</span>
            `;
          }
        }, 650);

        // Fase 3: Restauração suave do estado original
        setTimeout(() => {
          btn.classList.remove('wa-activating');
          btn.innerHTML = originalContent;
        }, 2600);
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupWhatsAppProgress);
  } else {
    setupWhatsAppProgress();
  }

  // =========================================================================
  // CARREGAMENTO PREGUIÇOSO AGRESSIVO E OTIMIZAÇÃO DE PERFORMANCE MOBILE
  // =========================================================================
  const setupAggressiveLazyLoading = () => {
    // 1. Pausar animações pesadas de Marquee quando fora da tela no mobile para poupar GPU/CPU e bateria
    if ('IntersectionObserver' in window) {
      const marqueeObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            const track = entry.target.querySelector('.marquee-track');
            if (track) {
              track.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
            }
          });
        },
        { rootMargin: '160px 0px' }
      );

      document.querySelectorAll('.marquee').forEach(el => marqueeObserver.observe(el));

      // 2. Observer de carregamento progressivo para imagens abaixo da dobra
      const heavyMediaObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
              }
              if (img.decode) {
                img.decode().catch(() => {});
              }
              observer.unobserve(img);
            }
          });
        },
        { rootMargin: '240px 0px' }
      );

      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        heavyMediaObserver.observe(img);
      });
    }
  };

  // =========================================================================
  // GERENCIAMENTO DE TEMA (ESCURO / CLARO)
  // =========================================================================
  const setupTheme = () => {
    const THEME_KEY = 'ultraplay_theme';
    const htmlEl = document.documentElement;
    const themeToggleBtn = document.querySelector('#theme-toggle');
    const drawerThemeToggleBtn = document.querySelector('#drawer-theme-toggle');
    const dockThemeToggleBtn = document.querySelector('#dock-theme-toggle');
    const drawerThemeText = document.querySelector('.drawer-theme-box .theme-toggle-text');

    const getPreferredTheme = () => {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    };

    const applyTheme = (theme, persist = false) => {
      htmlEl.setAttribute('data-theme', theme);
      if (persist) localStorage.setItem(THEME_KEY, theme);

      const isLight = theme === 'light';

      document.querySelectorAll('#theme-toggle, #drawer-theme-toggle').forEach(btn => {
        btn.classList.toggle('is-light', isLight);
      });

      if (dockThemeToggleBtn) {
        const moon = dockThemeToggleBtn.querySelector('.dock-icon-moon');
        const sun = dockThemeToggleBtn.querySelector('.dock-icon-sun');
        if (moon && sun) {
          moon.style.display = isLight ? 'none' : 'block';
          sun.style.display = isLight ? 'block' : 'none';
        }
      }

      if (drawerThemeText) {
        drawerThemeText.textContent = isLight ? 'Modo Claro' : 'Modo Escuro';
      }
    };

    const initialTheme = getPreferredTheme();
    applyTheme(initialTheme, false);

    const toggleTheme = () => {
      const current = htmlEl.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next, true);
    };

    themeToggleBtn?.addEventListener('click', toggleTheme);
    drawerThemeToggleBtn?.addEventListener('click', toggleTheme);
    dockThemeToggleBtn?.addEventListener('click', toggleTheme);

    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? 'light' : 'dark', false);
      }
    });
  };

  // =========================================================================
  // SCROLLSPY DE NAVEGAÇÃO ATIVA
  // =========================================================================
  const setupScrollSpy = () => {
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    const sections = Array.from(navLinks)
      .map(link => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    if (!sections.length) return;

    const onScroll = () => {
      const scrollPos = window.scrollY + 140;
      let currentSectionId = '';

      sections.forEach(sec => {
        if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
          currentSectionId = '#' + sec.id;
        }
      });

      if (!currentSectionId && window.scrollY < 200) {
        currentSectionId = '#inicio';
      }

      navLinks.forEach(link => {
        if (link.getAttribute('href') === currentSectionId) {
          link.classList.add('is-active');
        } else {
          link.classList.remove('is-active');
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  };

  // =========================================================================
  // FILTRAGEM E BUSCA INTERATIVA DO CATÁLOGO
  // =========================================================================
  const setupCatalogFilterAndSearch = () => {
    const filterPills = document.querySelectorAll('.catalog-pill');
    const posterRows = document.querySelectorAll('.poster-row');
    const searchInput = document.querySelector('#catalog-search');
    const searchClear = document.querySelector('#catalog-search-clear');
    const emptyNotice = document.querySelector('#catalog-empty');
    const emptyQuery = document.querySelector('#catalog-empty-query');

    let activeFilter = 'all';

    const filterCatalog = () => {
      const query = (searchInput?.value || '').trim().toLowerCase();
      if (searchClear) searchClear.style.display = query ? 'inline-flex' : 'none';

      let visibleCount = 0;

      posterRows.forEach(row => {
        const rowCategory = row.dataset.category;
        const matchesCategory = activeFilter === 'all' || rowCategory === activeFilter;

        let hasMatchingPosterInRow = false;
        const posters = row.querySelectorAll('.poster');

        posters.forEach(poster => {
          const title = (poster.dataset.previewTitle || '').toLowerCase();
          const desc = (poster.dataset.previewDesc || '').toLowerCase();
          const matchesSearch = !query || title.includes(query) || desc.includes(query);

          if (matchesCategory && matchesSearch) {
            poster.classList.remove('is-hidden');
            hasMatchingPosterInRow = true;
            visibleCount++;
          } else {
            poster.classList.add('is-hidden');
          }
        });

        if (matchesCategory && (!query || hasMatchingPosterInRow)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });

      if (emptyNotice) {
        if (visibleCount === 0 && query) {
          emptyNotice.style.display = 'block';
          if (emptyQuery) emptyQuery.textContent = query;
        } else {
          emptyNotice.style.display = 'none';
        }
      }
    };

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => {
          p.classList.remove('is-active');
          p.setAttribute('aria-selected', 'false');
        });
        pill.classList.add('is-active');
        pill.setAttribute('aria-selected', 'true');
        activeFilter = pill.dataset.catalogFilter || 'all';
        filterCatalog();
      });
    });

    searchInput?.addEventListener('input', filterCatalog);
    searchClear?.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      filterCatalog();
      searchInput?.focus();
    });
  };

  // =========================================================================
  // MODAL DE DETALHES DE CONTEÚDO (STREAMING PREVIEW MODAL)
  // =========================================================================
  const setupPreviewModal = () => {
    const previewDialog = document.querySelector('#preview-dialog');
    const previewClose = document.querySelector('#preview-dialog-close');
    const previewImg = document.querySelector('#preview-img');
    const previewBadge = document.querySelector('#preview-badge');
    const previewType = document.querySelector('#preview-type');
    const previewRating = document.querySelector('#preview-rating');
    const previewTitle = document.querySelector('#preview-title');
    const previewDesc = document.querySelector('#preview-desc');
    const previewActionBtn = document.querySelector('#preview-action-btn');

    if (!previewDialog) return;

    const openPreview = (poster) => {
      const title = poster.dataset.previewTitle || 'Título';
      const type = poster.dataset.previewType || 'Filme / Série';
      const badge = poster.dataset.previewBadge || '4K ULTRA HD';
      const rating = poster.dataset.previewRating || '9.0';
      const desc = poster.dataset.previewDesc || 'Conteúdo disponível na UltraPlay em alta resolução.';
      const img = poster.dataset.previewImg || '';

      if (previewTitle) previewTitle.textContent = title;
      if (previewType) previewType.textContent = type;
      if (previewBadge) previewBadge.textContent = badge;
      if (previewRating) previewRating.textContent = rating;
      if (previewDesc) previewDesc.textContent = desc;
      if (previewImg && img) {
        previewImg.src = img;
        previewImg.alt = 'Cartaz de ' + title;
      }
      if (previewActionBtn) {
        previewActionBtn.href = `https://wa.me/558781584372?text=${encodeURIComponent(`Olá! Gostaria de assistir ao título "${title}" no teste grátis de 3h da UltraPlay.`)}`;
      }

      previewDialog.showModal();
      document.body.classList.add('modal-open');
    };

    document.querySelectorAll('.poster').forEach(poster => {
      poster.addEventListener('click', () => openPreview(poster));
      poster.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openPreview(poster);
        }
      });
    });

    previewClose?.addEventListener('click', () => previewDialog.close());

    previewDialog.addEventListener('click', e => {
      if (e.target === previewDialog) previewDialog.close();
    });

    previewDialog.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
    });
  };

  // =========================================================================
  // SIMULADOR DE VELOCIDADE DE CONEXÃO
  // =========================================================================
  const setupSpeedSimulator = () => {
    const speedButtons = document.querySelectorAll('.speed-btn');
    const speedBadge = document.querySelector('#speed-badge');
    const speedStatus = document.querySelector('#speed-status');
    const speedFeatures = document.querySelector('#speed-features');
    const speedTestBtn = document.querySelector('#speed-test-btn');

    if (!speedButtons.length) return;

    const speedData = {
      10: {
        badge: 'SD & HD 720p',
        status: '🟢 Conexão Suficiente para Canais e Filmes HD',
        features: [
          'Transmissão estável em qualidade SD e HD 720p',
          'Recomendado para 1 tela simultânea',
          'Baixo consumo de dados móveis ou Wi-Fi básico'
        ],
        msg: 'Olá! Minha internet tem cerca de 10 Mega e gostaria de testar o plano UltraPlay.'
      },
      30: {
        badge: 'FULL HD 1080p',
        status: '🟢 Excelente para Full HD com Som Digital',
        features: [
          'Canais abertos e fechados em Full HD sem engasgos',
          'Suporte a 2 telas em uso simultâneo',
          'Troca instantânea de canais em Smart TV ou TV Box'
        ],
        msg: 'Olá! Minha internet tem 30 Mega e gostaria de fazer o teste grátis da UltraPlay em Full HD.'
      },
      50: {
        badge: '4K ULTRA HD',
        status: '🟢 Conexão Ideal para Máxima Resolução',
        features: [
          'Canais e Filmes em 4K HDR e Full HD com som cristalino',
          'Suporte a múltiplos aparelhos simultâneos na mesma rede',
          'Carregamento instantâneo de canais esportivos ao vivo'
        ],
        msg: 'Olá! Minha internet tem 50 Mega e gostaria de fazer o teste grátis da UltraPlay em 4K.'
      },
      100: {
        badge: '4K HDR & DOLBY',
        status: '⚡ Ultra Velocidade com Carregamento Instantâneo',
        features: [
          'Qualidade de estúdio 4K HDR10+ com som espacial imersivo',
          'Grade de esportes e eventos ao vivo com latência ultrabaixa',
          'Liberdade total para toda a família assistir ao mesmo tempo'
        ],
        msg: 'Olá! Tenho conexão acima de 100 Mega e quero testar a UltraPlay na máxima performance.'
      }
    };

    speedButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        speedButtons.forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-checked', 'true');

        const speed = btn.dataset.speed || '50';
        const data = speedData[speed] || speedData[50];

        if (speedBadge) speedBadge.textContent = data.badge;
        if (speedStatus) speedStatus.textContent = data.status;
        if (speedFeatures) {
          speedFeatures.innerHTML = data.features
            .map(feat => `<div class="speed-feat"><svg class="icon-chk" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4L19 6"/></svg><span>${feat}</span></div>`)
            .join('');
        }
        if (speedTestBtn) {
          speedTestBtn.href = `https://wa.me/558781584372?text=${encodeURIComponent(data.msg)}`;
        }
      });
    });
  };

  // =========================================================================
  // ALTERNADOR DE PLANOS (TODOS VS MAIOR ECONOMIA)
  // =========================================================================
  const setupPlanSwitcher = () => {
    const planButtons = document.querySelectorAll('.plan-filter-btn');
    const planCards = document.querySelectorAll('.plan-card');

    if (!planButtons.length) return;

    planButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        planButtons.forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        const filter = btn.dataset.planFilter || 'all';

        planCards.forEach(card => {
          if (filter === 'savings') {
            if (card.dataset.planTier === 'regular') {
              card.classList.add('is-dimmed');
            } else {
              card.classList.remove('is-dimmed');
              card.classList.add('is-highlighted');
            }
          } else {
            card.classList.remove('is-dimmed', 'is-highlighted');
          }
        });
      });
    });
  };

  // =========================================================================
  // BALÃO DE ATENDIMENTO DO WHATSAPP (CONVERSÃO)
  // =========================================================================
  const setupWhatsAppToast = () => {
    const bubble = document.querySelector('#wa-speech-bubble');
    const bubbleClose = document.querySelector('#wa-bubble-close');

    if (!bubble) return;

    if (!sessionStorage.getItem('wa_bubble_closed')) {
      setTimeout(() => {
        bubble.classList.add('is-visible');
      }, 4500);
    }

    bubbleClose?.addEventListener('click', e => {
      e.stopPropagation();
      bubble.classList.remove('is-visible');
      sessionStorage.setItem('wa_bubble_closed', 'true');
    });
  };

  // Iniciar novos recursos
  const initNewFeatures = () => {
    setupTheme();
    setupScrollSpy();
    setupCatalogFilterAndSearch();
    setupPlanSwitcher();
    setupWhatsAppToast();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNewFeatures);
  } else {
    initNewFeatures();
  }
})();
