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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAggressiveLazyLoading);
  } else {
    setupAggressiveLazyLoading();
  }
})();
