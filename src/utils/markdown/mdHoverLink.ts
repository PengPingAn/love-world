export function initHoverCard(container: HTMLElement | Document = document) {
    const showCard = (link: HTMLElement, card: HTMLElement) => {
        // clearTimeout((card as any)._hideTimer);
        // card.style.display = 'block';
        // card.classList.remove('fade-out');
        // card.classList.add('dropdown');
        clearTimeout((card as any)._hideTimer);

        card.style.display = 'block';
        card.classList.remove('fade-out');
        card.classList.add('dropdown');

        // 让浏览器重新计算布局
        card.offsetHeight;

        // 位置判断
        const linkRect = link.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        const cardLeft = linkRect.left + linkRect.width / 2 - card.offsetWidth / 2;

        if (cardLeft < 10) {
            card.classList.add('align-left');
            card.style.left = '0';
            card.style.right = 'auto';
        } else if (cardLeft + card.offsetWidth > viewportWidth - 200) {
            card.classList.add('align-right');
            card.style.right = '0';
            card.style.left = 'auto';
        } else {
            const offset = link.offsetLeft + link.offsetWidth / 2 - card.offsetWidth / 2;
            card.classList.add('align-center');
            card.style.left = `${offset}px`;
            card.style.right = 'auto';
        }
    };

    const hideCard = (card: HTMLElement) => {
        card.classList.remove('dropdown');
        card.classList.add('fade-out');
        (card as any)._hideTimer = setTimeout(() => {
            card.style.display = 'none';
        }, 300); // 和动画时长一致
    };

    const mouseEnter = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!isElement(target)) return;
        if (target.classList.contains('hover-link')) {
            const card = target.nextElementSibling as HTMLElement;
            if (card && card.classList.contains('p-a-span')) {
                showCard(target, card);
            }
        }
    };

    const mouseLeave = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!isElement(target)) return;
        if (target.classList.contains('hover-link')) {
            const card = target.nextElementSibling as HTMLElement;
            if (card && card.classList.contains('p-a-span')) {
                (card as any)._hideTimer = setTimeout(() => hideCard(card), 100);
            }
        } else if (target.classList.contains('p-a-span')) {
            (target as any)._hideTimer = setTimeout(() => hideCard(target), 100);
        }
    };

    const isElement = (node: EventTarget | null): node is HTMLElement => {
        return node instanceof HTMLElement;
    }


    const cancelHide = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!isElement(target)) return;
        if (target.classList.contains('p-a-span')) {
            clearTimeout((target as any)._hideTimer);
        }
    };

    container.addEventListener('mouseenter', mouseEnter, true);
    container.addEventListener('mouseleave', mouseLeave, true);
    container.addEventListener('mouseenter', cancelHide, true);

    // 卸载函数
    return () => {
        container.removeEventListener('mouseenter', mouseEnter, true);
        container.removeEventListener('mouseleave', mouseLeave, true);
        container.removeEventListener('mouseenter', cancelHide, true);
    };
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

