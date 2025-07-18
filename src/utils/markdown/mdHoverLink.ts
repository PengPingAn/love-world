export function initHoverCard(container: HTMLElement | Document = document) {
  // const showCard = (link: HTMLElement, card: HTMLElement) => {
  //     // clearTimeout((card as any)._hideTimer);
  //     // card.style.display = 'block';
  //     // card.classList.remove('fade-out');
  //     // card.classList.add('dropdown');
  //     clearTimeout((card as any)._hideTimer);

  //     card.style.display = 'block';
  //     card.classList.remove('fade-out');
  //     card.classList.add('dropdown');

  //     // 让浏览器重新计算布局
  //     card.offsetHeight;

  //     // 位置判断
  //     const linkRect = link.getBoundingClientRect();
  //     const cardRect = card.getBoundingClientRect();
  //     const viewportWidth = window.innerWidth;
  //     console.log(cardRect)
  //     const cardLeft = linkRect.left + linkRect.width / 2 - card.offsetWidth / 2;

  //     console.log(cardLeft)
  //     if (cardLeft < 10) {
  //         card.classList.add('align-left');
  //         card.style.left = '0';
  //         card.style.right = 'auto';
  //     } else if (cardLeft + card.offsetWidth > viewportWidth - 200) {
  //         card.classList.add('align-right');
  //         card.style.right = '0';
  //         card.style.left = 'auto';
  //     } else {
  //         const offset = link.offsetLeft + link.offsetWidth / 2 - card.offsetWidth / 2;
  //         card.classList.add('align-center');
  //         card.style.left = `${offset}px`;
  //         card.style.right = 'auto';
  //     }
  // };

  const showCard = (link: HTMLElement, card: HTMLElement) => {
    clearTimeout((card as any)._hideTimer)

    card.style.display = 'block'
    card.classList.remove('fade-out')
    card.classList.add('dropdown')
    card.offsetHeight // 强制重排

    // 清除之前的 class
    card.classList.remove('align-left', 'align-right', 'align-center')

    // 获取 card 的定位容器
    const container = card.offsetParent as HTMLElement
    const containerRect = container.getBoundingClientRect()
    const containerLeft = containerRect.left
    const containerWidth = container.clientWidth

    const linkRect = link.getBoundingClientRect()
    const cardWidth = card.offsetWidth

    // 把 link 的中心点（相对于视口）转换成相对 container 的 left 值
    const linkCenterInViewport = linkRect.left + linkRect.width / 2
    const desiredLeft = linkCenterInViewport - containerLeft - cardWidth / 2

    // 缓冲边界
    const buffer = 28

    if (desiredLeft < buffer) {
      // 靠左
      card.classList.add('align-left')
      card.style.left = '0'
      card.style.right = 'auto'
    } else if (desiredLeft + cardWidth > containerWidth - buffer) {
      // 靠右
      card.classList.add('align-right')
      card.style.right = '0'
      card.style.left = 'auto'
    } else {
      // 居中对齐
      card.classList.add('align-center')
      card.style.left = `${desiredLeft}px`
      card.style.right = 'auto'
    }
  }

  const hideCard = (card: HTMLElement) => {
    card.classList.remove('dropdown')
    card.classList.add('fade-out')
    ;(card as any)._hideTimer = setTimeout(() => {
      card.style.display = 'none'
    }, 300) // 和动画时长一致
  }

  const mouseEnter = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!isElement(target)) return

    if (target.classList.contains('hover-link')) {
      const card = target.nextElementSibling as HTMLElement
      if (card && card.classList.contains('p-a-span')) {
        showCard(target, card)
      }
    } else if (target.classList.contains('p-a-span')) {
      clearTimeout((target as any)._hideTimer)
    }
  }

  const mouseLeave = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!isElement(target)) return
    if (target.classList.contains('hover-link')) {
      const card = target.nextElementSibling as HTMLElement
      if (card && card.classList.contains('p-a-span')) {
        ;(card as any)._hideTimer = setTimeout(() => hideCard(card), 100)
      }
    } else if (target.classList.contains('p-a-span')) {
      ;(target as any)._hideTimer = setTimeout(() => hideCard(target), 100)
    }
  }

  const isElement = (node: EventTarget | null): node is HTMLElement => {
    return node instanceof HTMLElement
  }

  const cancelHide = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!isElement(target)) return
    if (target.classList.contains('p-a-span')) {
      clearTimeout((target as any)._hideTimer)
    }
  }

  container.addEventListener('mouseenter', mouseEnter, true)
  container.addEventListener('mouseleave', mouseLeave, true)
  container.addEventListener('mouseenter', cancelHide, true)

  // 卸载函数
  return () => {
    container.removeEventListener('mouseenter', mouseEnter, true)
    container.removeEventListener('mouseleave', mouseLeave, true)
    container.removeEventListener('mouseenter', cancelHide, true)
  }
}

export function initCardHoverEffect() {
  const bindMCardEffect = (card: HTMLElement) => {
    const overlay = card.querySelector<HTMLElement>('.m-card-overlay')
    if (!overlay) return

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      card.style.setProperty('--mouse-x', `${x}px`)
      card.style.setProperty('--mouse-y', `${y}px`)
    })
  }

  const bindLinkCardEffect = (card: HTMLElement) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      card.style.setProperty('--mouse-x', `${x}px`)
      card.style.setProperty('--mouse-y', `${y}px`)
    })
  }

  // 初始绑定
  document.querySelectorAll<HTMLElement>('.m-card').forEach(bindMCardEffect)
  document.querySelectorAll<HTMLElement>('.link-card').forEach(bindLinkCardEffect)

  // IntersectionObserver 动画
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement
        if (entry.isIntersecting) {
          el.classList.remove('animate')
          void el.offsetWidth
          el.classList.add('animate')
        }
      })
    },
    { threshold: 0.5 }
  )

  document.querySelectorAll('.mark').forEach((el) => observer.observe(el))

  // MutationObserver：对 .mark、.m-card、.link-card 动态注册
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return

        // === mark 动画 ===
        if (node.matches('.mark')) {
          observer.observe(node)
        } else {
          node.querySelectorAll?.('.mark').forEach((el) => observer.observe(el))
        }

        // === m-card 特效绑定 ===
        if (node.matches('.m-card')) {
          bindMCardEffect(node)
        } else {
          node.querySelectorAll?.('.m-card').forEach(bindMCardEffect)
        }

        // === link-card 特效绑定 ===
        if (node.matches('.link-card')) {
          bindLinkCardEffect(node)
        } else {
          node.querySelectorAll?.('.link-card').forEach(bindLinkCardEffect)
        }
      })
    })
  })

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  })
}

export function initFlipCardEffect(): () => void {
  const bindFlipCard = (card: HTMLElement) => {
    if (card.dataset.flipBound === 'true') return

    const tryBind = () => {
      const inner = card.querySelector<HTMLElement>('.md-flip-card-inner')
      if (!inner) {
        setTimeout(tryBind, 50) // 继续等待 DOM 挂载完成
        return
      }

      inner.addEventListener('click', () => {
        const outer = inner.closest('.md-flip-card')
        outer?.classList.toggle('flipped')
      })

      card.dataset.flipBound = 'true'
    }

    tryBind()
  }

  // 绑定已有
  document.querySelectorAll<HTMLElement>('.md-flip-card').forEach(bindFlipCard)

  // MutationObserver：监听后续插入
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return

        if (node.matches('.md-flip-card')) {
          bindFlipCard(node)
        } else {
          node.querySelectorAll?.('.md-flip-card').forEach(bindFlipCard)
        }
      })
    })
  })

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  })

  // 返回卸载函数，便于页面切换后清理
  return () => {
    mutationObserver.disconnect()
    document.querySelectorAll<HTMLElement>('.md-flip-card').forEach((card) => {
      if (card.dataset.flipBound === 'true') {
        card.replaceWith(card.cloneNode(true)) // 解绑所有事件
      }
    })
  }
}

// export function initHoverCard(container: HTMLElement | Document = document) {
//     const showCard = (link: HTMLElement, card: HTMLElement) => {
//         clearTimeout((card as any)._hideTimer);
//         card.style.display = 'block';
//         card.classList.remove('fade-out');
//         card.classList.add('dropdown');
//     };

//     const hideCard = (card: HTMLElement) => {
//         card.classList.remove('dropdown');
//         card.classList.add('fade-out');
//         (card as any)._hideTimer = setTimeout(() => {
//             card.style.display = 'none';
//         }, 300); // 和动画时长一致
//     };

//     const mouseEnter = (e: MouseEvent) => {
//         const target = e.target as HTMLElement;
//         if (!isElement(target)) return;
//         if (target.classList.contains('hover-link')) {
//             const card = target.nextElementSibling as HTMLElement;
//             if (card && card.classList.contains('p-a-span')) {
//                 showCard(target, card);
//             }
//         }
//     };

//     const mouseLeave = (e: MouseEvent) => {
//         const target = e.target as HTMLElement;
//         if (!isElement(target)) return;
//         if (target.classList.contains('hover-link')) {
//             const card = target.nextElementSibling as HTMLElement;
//             if (card && card.classList.contains('p-a-span')) {
//                 (card as any)._hideTimer = setTimeout(() => hideCard(card), 100);
//             }
//         } else if (target.classList.contains('p-a-span')) {
//             (target as any)._hideTimer = setTimeout(() => hideCard(target), 100);
//         }
//     };

//     const isElement = (node: EventTarget | null): node is HTMLElement => {
//         return node instanceof HTMLElement;
//     }

//     const cancelHide = (e: MouseEvent) => {
//         const target = e.target as HTMLElement;
//         if (!isElement(target)) return;
//         if (target.classList.contains('p-a-span')) {
//             clearTimeout((target as any)._hideTimer);
//         }
//     };

//     container.addEventListener('mouseenter', mouseEnter, true);
//     container.addEventListener('mouseleave', mouseLeave, true);
//     container.addEventListener('mouseenter', cancelHide, true);

//     // 卸载函数
//     return () => {
//         container.removeEventListener('mouseenter', mouseEnter, true);
//         container.removeEventListener('mouseleave', mouseLeave, true);
//         container.removeEventListener('mouseenter', cancelHide, true);
//     };
// }
