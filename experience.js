import AOS from 'aos';
import 'aos/dist/aos.css';

(() => {
  'use strict';

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

  // Inicialização global da biblioteca AOS com foco em performance e impacto visual
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 50,
    delay: 0,
    disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  });

  // Configuração dos dispositivos suportados
  const devices = [
    { name: 'Smart TV', file: 'assets/devices-0.jpg' },
    { name: 'TV Box', file: 'assets/devices-1.jpeg' },
    { name: 'Fire Stick', file: 'assets/devices-2.jpeg' },
    { name: 'Mi Stick', file: 'assets/devices-3.jpeg' },
    { name: 'Notebook', file: 'assets/devices-4.jpeg' },
    { name: 'Celular', file: 'assets/devices-5.jpeg' }
  ];

  const descriptions = [
    'Sua sala pode ser o melhor lugar para dar play. Informe o modelo da sua Smart TV e receba as orientações para configurar o aplicativo.',
    'Conecte sua TV Box à internet e leve a experiência UltraPlay para a televisão. Nossa equipe orienta a configuração para o seu modelo.',
    'Use seu Fire TV Stick para explorar a UltraPlay na TV. Fale com a equipe para receber as orientações de instalação e acesso.',
    'Seu Mi Stick também pode fazer parte da experiência. Informe o modelo no WhatsApp para receber as instruções do aplicativo.',
    'Aproveite todo o conteúdo na tela do seu computador ou notebook. Peça à equipe as orientações de acesso direto no navegador ou app.',
    'Leve seu próximo play no bolso. Informe se seu celular é Android ou iPhone para receber as orientações de acesso.'
  ];

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

  // Alternador Interativo de Dispositivos
  const tabs = document.querySelectorAll('.device-tabs button');
  const panel = document.querySelector('#device-panel');
  let currentDevice = 0;
  let deviceAuto = true;

  function selectDevice(index, focus = false) {
    if (!panel || !tabs.length) return;
    currentDevice = index;

    tabs.forEach((tab, i) => {
      const isSelected = i === index;
      tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      tab.tabIndex = isSelected ? 0 : -1;
    });

    const device = devices[index];
    const photo = document.querySelector('#device-image');
    const nameEl = document.querySelector('#device-name');
    const descEl = document.querySelector('#device-description');
    const linkEl = document.querySelector('#device-link');

    if (photo && device) {
      photo.src = device.file;
      photo.alt = device.name;
    }
    if (nameEl && device) nameEl.textContent = device.name;
    if (descEl) descEl.textContent = descriptions[index];
    if (linkEl && device) {
      linkEl.href = `https://wa.me/558781584372?text=ol%C3%A1%20tenho%20interesse%20no%20teste%20gr%C3%A1tis%20para%20${encodeURIComponent(device.name)}`;
    }

    panel.classList.remove('changed');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => panel.classList.add('changed'));
    });

    if (focus && tabs[index]) tabs[index].focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      deviceAuto = false;
      selectDevice(index);
    });

    tab.addEventListener('keydown', event => {
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;

      event.preventDefault();
      deviceAuto = false;
      selectDevice(next, true);
    });
  });

  // Ciclo automático suave de dispositivos caso visível na tela
  const isElementInView = el => {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  };

  setInterval(() => {
    if (
      deviceAuto &&
      document.visibilityState === 'visible' &&
      panel &&
      isElementInView(panel) &&
      !panel.parentElement?.contains(document.activeElement)
    ) {
      selectDevice((currentDevice + 1) % devices.length);
    }
  }, 6500);

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
})();
