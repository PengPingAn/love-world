export function initMarkdownCollapse(container: HTMLElement | Document = document) {
  const handler = (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('md-collapse-title')) {
      const body = target.nextElementSibling as HTMLElement;
      if (!body) return;

      const isOpen = body.classList.contains('open');

      const icon = target.querySelector('.md-collapse-icon');
      if (icon) {
        icon.classList.toggle('rotate');
      }

      if (isOpen) {
        body.style.height = body.scrollHeight + 'px';
        body.offsetHeight;
        body.style.height = '0';
        body.classList.remove('open');
      } else {
        body.classList.add('open');
        const height = body.scrollHeight;
        body.style.height = '0';
        body.offsetHeight;
        body.style.height = height + 'px';
      }

      body.addEventListener(
        'transitionend',
        () => {
          if (body.classList.contains('open')) {
            body.style.height = 'auto';
          }
        },
        { once: true }
      );
    }
  };

  container.addEventListener('click', handler);

  // 返回一个卸载函数，防止重复绑定或内存泄漏
  return () => container.removeEventListener('click', handler);
}
