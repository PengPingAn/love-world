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
        clearTimeout((card as any)._hideTimer);
    
        card.style.display = 'block';
        card.classList.remove('fade-out');
        card.classList.add('dropdown');
        card.offsetHeight; // 强制重排
    
        // 清除之前的 class
        card.classList.remove('align-left', 'align-right', 'align-center');
    
        // 获取 card 的定位容器
        const container = card.offsetParent as HTMLElement;
        const containerRect = container.getBoundingClientRect();
        const containerLeft = containerRect.left;
        const containerWidth = container.clientWidth;
    
        const linkRect = link.getBoundingClientRect();
        const cardWidth = card.offsetWidth;
    
        // 把 link 的中心点（相对于视口）转换成相对 container 的 left 值
        const linkCenterInViewport = linkRect.left + linkRect.width / 2;
        const desiredLeft = linkCenterInViewport - containerLeft - cardWidth / 2;
    
        // 缓冲边界
        const buffer = 8;
    
        if (desiredLeft < buffer) {
            // 靠左
            card.classList.add('align-left');
            card.style.left = '0';
            card.style.right = 'auto';
        } else if (desiredLeft + cardWidth > containerWidth - buffer) {
            // 靠右
            card.classList.add('align-right');
            card.style.right = '0';
            card.style.left = 'auto';
        } else {
            // 居中对齐
            card.classList.add('align-center');
            card.style.left = `${desiredLeft}px`;
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
        } else if (target.classList.contains('p-a-span')) {
            clearTimeout((target as any)._hideTimer);
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

