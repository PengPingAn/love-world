// utils/markdown-it-config.js
import mingcuteIcon from "@/assets/svg/mingcute.svg";
import errorIcon from "@/assets/svg/error.svg";
import warningIcon from "@/assets/svg/warning.svg";
import svgLeft from '@/assets/svg/carousel-left.svg?raw'
import svgRight from '@/assets/svg/carousel-right.svg?raw'

// ----------------------------
// 自定义语法插件
// ----------------------------
export const customPlugin = (md) => {
    // 安全边界计数器
    const MAX_ITERATIONS = 1000;
    const TOKEN_PREFIX = 'my_admonition_';

    // 1. 注册块级规则
    md.block.ruler.before('fence', 'admonition', (state, startLine) => {
        if (startLine >= state.lineMax) return false;

        const startPos = state.bMarks[startLine];
        const maxPos = state.eMarks[startLine];
        const lineText = state.src.slice(startPos, maxPos);

        // 匹配 ::: 类型 [标题]
        const openMatch = lineText.match(/^:::\s+(\w+)(?:\s+(.*))?$/);
        // console.log('----',lineText)
        if (!openMatch) return false;

        const [_, type, title] = openMatch;
        let endLine = startLine + 1;
        let iteration = 0;
        let foundEnd = false;

        // 查找结束标记 :::
        while (endLine < state.lineMax && iteration < MAX_ITERATIONS) {
            iteration++;
            const endPos = state.bMarks[endLine];
            const endMaxPos = state.eMarks[endLine];
            const endLineText = state.src.slice(endPos, endMaxPos);

            // 允许缩进和空格
            if (endLineText.trim() === ':::') {
                foundEnd = true;
                break;
            }

            endLine++;
        }

        if (!foundEnd) return false;

        // 2. 创建 token - 关键修复：确保 token 类型正确
        const tokenOpen = state.push(`${TOKEN_PREFIX}open`, 'div', 1);
        tokenOpen.attrSet('class', `${type} m-block`);

        // 标题 token
        if (title) {
            const tokenTitle = state.push(`${TOKEN_PREFIX}title`, '', 0);
            tokenTitle.content = title.trim();
        }

        // 内容解析
        state.line = startLine + 1;
        state.md.block.tokenize(state, startLine + 1, endLine);

        // 关闭 token
        state.push(`${TOKEN_PREFIX}close`, 'div', -1);

        state.line = endLine + 1;
        return true;
    });

    //列表展开
    md.block.ruler.before('fence', 'collapse', (state, startLine, endLine, silent) => {
        const start = state.bMarks[startLine] + state.tShift[startLine];
        const max = state.eMarks[startLine];
        const line = state.src.slice(start, max);

        if (!line.startsWith(':::collapse')) return false;

        const titleMatch = line.match(/title=(.*)/);
        const title = titleMatch ? titleMatch[1].trim() : '展开内容';

        let nextLine = startLine + 1;
        let content = '';

        while (nextLine < endLine) {
            const pos = state.bMarks[nextLine] + state.tShift[nextLine];
            const maxPos = state.eMarks[nextLine];
            const lineText = state.src.slice(pos, maxPos);

            if (lineText.startsWith(':::')) break;

            content += lineText + '\n';
            nextLine++;
        }

        if (silent) return true;

        state.line = nextLine + 1;

        const renderedContent = md.render(content);

        const token = state.push('html_block', '', 0);
        token.content = `
          <div class="md-collapse">
            <div class="md-collapse-title"><div class='md-collapse-icon'></div>${title}</div>
            <div class="md-collapse-body">
              <div class="md-collapse-inner open">${renderedContent}</div>
            </div>
          </div>
        `;

        return true;
    });

    //视频插件
    md.block.ruler.before('fence', 'video', (state, startLine, endLine, silent) => {
        const start = state.bMarks[startLine] + state.tShift[startLine];
        const max = state.eMarks[startLine];
        const line = state.src.slice(start, max).trim();

        if (!line.startsWith(':::video')) return false;

        // 解析参数
        const attrRegex = /(\w+)=([^\s]+)/g;
        const attrs = {};
        let match;
        while ((match = attrRegex.exec(line)) !== null) {
            attrs[match[1]] = match[2];
        }

        if (!attrs.src) return false;

        let nextLine = startLine + 1;
        const lines = [];
        while (nextLine < endLine) {
            const pos = state.bMarks[nextLine] + state.tShift[nextLine];
            const maxPos = state.eMarks[nextLine];
            const text = state.src.slice(pos, maxPos).trim();

            if (text === ':::') break;

            lines.push(text);
            nextLine++;
        }

        if (silent) return true;

        state.line = nextLine + 1;

        const description = lines.join('\n').trim();

        const isExternal = /^https?:\/\//.test(attrs.src) &&
            /(youtube\.com|bilibili\.com|vimeo\.com)/.test(attrs.src);

        const player = isExternal
            ? `<iframe
               src="${attrs.src}"
               class="md-video-iframe"
               frameborder="0"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
               allowfullscreen
             ></iframe>`
            : `<video
               src="${attrs.src}"
               ${attrs.poster ? `poster="${attrs.poster}"` : ''}
               controls
               preload="metadata"
               class="md-video"
             ></video>`;

        const html = `
          <div class="md-video-wrapper">
            ${player}
            ${description ? `<div class="md-video-description">—— ${md.utils.escapeHtml(description)} ——</div>` : ''}
          </div>
        `;

        const token = state.push('html_block', '', 0);
        token.content = html;

        return true;
    });

    //语法高亮
    md.inline.ruler.before('text', 'highlight', (state) => {
        const start = state.pos;
        const match = state.src.slice(start).match(/^==([^=]+?)==/);
        if (!match) return false;

        const token = state.push('highlight', '', 0);
        token.content = match[1];
        token.attrs = [['class', 'mark']];

        state.pos += match[0].length;
        return true;
    });

    //悬浮链接
    md.inline.ruler.before('link', 'polaris_link', (state) => {
        const start = state.pos;
        const srcSlice = state.src.slice(start);

        // 优化后的正则表达式
        const match = srcSlice.match(/@Pingan\[([^\]]+)\]\(([^)]+)\)/);
        // console.log('---', srcSlice)
        if (!match) return false;

        // 提取文本和链接
        const text = match[1];
        const url = match[2];

        // 创建 Token
        const token = state.push('polaris_link', '', 0);
        token.attrs = [
            ['href', url],
            ['class', 'hover-link'],
            ['target', '_blank']
        ];
        token.content = text;
        token.meta = {
            icon: mingcuteIcon,
            url: url
        };
        token.hidden = true;
        // 更新解析位置
        state.pos += match[0].length;
        return true;
    });

    //卡片链接
    md.inline.ruler.before('link', 'link_card', (state) => {
        const start = state.pos;
        const srcSlice = state.src.slice(start);

        // 优化正则：匹配 @linkCard[标题][头像](链接)
        const match = srcSlice.match(/@linkCard\s*\[([^\]]+)\]\[([^\]]+)\]\[([^\]]+)\]\(([^)]+)\)/);
        if (!match) return false;

        const title = match[1];    // 提取标题
        const avatar = match[2];   // 提取头像URL
        const label = match[3];   // 提取描述
        const url = match[4];      // 提取目标链接

        // 创建自定义 token
        const token = state.push('link_card', '', 0);
        token.meta = { title, avatar, label, url };  // 存储元数据
        token.hidden = true;       // 隐藏原始 token

        // 更新解析位置
        state.pos += match[0].length;
        return true;
    });

    // 隐藏语法 将规则提升到最高优先级（在 text 规则之前）
    md.core.ruler.push('tooltip_parser', (state) => {
        const Token = state.Token;

        state.tokens.forEach((blockToken) => {
            if (blockToken.type !== 'inline') return;

            const children = <any>[];
            blockToken.children.forEach((token) => {
                if (token.type !== 'text') {
                    children.push(token);
                    return;
                }

                const text = token.content;
                const regex = /\|\|([^|]+?)\|\|/g;
                let lastIndex = 0;
                let match;

                while ((match = regex.exec(text)) !== null) {
                    if (match.index > lastIndex) {
                        const t = new Token('text', '', 0);
                        t.content = text.slice(lastIndex, match.index);
                        children.push(t);
                    }

                    const tooltipToken = new Token('tooltip', '', 0);
                    tooltipToken.content = match[1];
                    tooltipToken.attrs = [
                        ['title', '你知道得太多了'],
                        ['class', 'p-span-tag']
                    ];
                    children.push(tooltipToken);

                    lastIndex = regex.lastIndex;
                }

                if (lastIndex < text.length) {
                    const t = new Token('text', '', 0);
                    t.content = text.slice(lastIndex);
                    children.push(t);
                }
            });

            blockToken.children = children;
        });
    });

    //轮播图
    md.block.ruler.before('fence', 'carousel', (state, startLine, endLine, silent) => {
        const startPos = state.bMarks[startLine] + state.tShift[startLine];
        const maxPos = state.eMarks[startLine];

        if (!state.src.slice(startPos, maxPos).trim().startsWith(':::carousel')) return false;
        if (silent) return true;

        let nextLine = startLine + 1;
        const content: string[] = [];

        while (nextLine < endLine) {
            const lineStart = state.bMarks[nextLine] + state.tShift[nextLine];
            const lineEnd = state.eMarks[nextLine];
            const lineText = state.src.slice(lineStart, lineEnd).trim();

            if (lineText === ':::') break;

            content.push(lineText);
            nextLine++;
        }

        // ✅ 在这里记录图片数量
        state.env.carouselImageCount = content.length;

        const tokenOpen = state.push('carousel_open', 'div', 1);
        tokenOpen.attrs = [['class', 'container']];
        tokenOpen.map = [startLine, nextLine];

        content.forEach(src => {
            const itemOpen = state.push('container_item_open', 'div', 1);
            itemOpen.attrs = [['class', 'container-item']];

            const imgToken = state.push('html_inline', '', 0);
            imgToken.content = `<img src="${src}" alt="" />`;

            const itemClose = state.push('container_item_close', 'div', -1);
        });

        const tokenClose = state.push('carousel_close', 'div', -1);

        state.line = nextLine + 1;
        return true;
    });

    // 隐藏渲染
    md.renderer.rules.tooltip = (tokens, idx) => {
        const token = tokens[idx];
        // console.log('渲染 tooltip:', token);
        return `<span title="${token.attrs[0][1]}" class="${token.attrs[1][1]}">${token.content}</span>`;
    };

    //高亮渲染
    md.renderer.rules.highlight = (tokens, idx) => {
        const token = tokens[idx];
        return `<mark class="${token.attrs[0][1]}">
                  <span class="mark-span">${token.content}</span>
                </mark>
                `;
    };

    //链接渲染
    md.renderer.rules.polaris_link = (tokens, idx) => {
        const token = tokens[idx];
        return `<span style="display: inline-block;text-indent: 0em;">
                    <a href="${token.attrs[0][1]}" target="_blank" class='hover-link' style='text-decoration: none;display: flex;'>
                        ${token.content}
                        <img src="${token.meta.icon}" style='width:17px;vertical-align: sub;pointer-events: none;background: transparent;' />
                    </a>
                    <span class='p-a-span slide-top'>${token.meta.url}</span>
                </span>`;
    };

    //警告/错误渲染
    md.renderer.rules[`${TOKEN_PREFIX}open`] = function (tokens, idx) {
        const token = tokens[idx];
        const type = token.attrGet('class').split(' ')[0];
        const icon = type.includes('error') ?
            errorIcon :
            warningIcon;
        // console.log('强制触发规则!--', token.attrGet('class').split(' '));
        return `<div class="${token.attrGet('class')}">
                    <iframe src="${icon}"></iframe>
                    <div class="admonition-content">`;
    };
    //警告/错误结尾渲染
    md.renderer.rules[`${TOKEN_PREFIX}close`] = () => '</div></div>';

    // link card渲染
    md.renderer.rules.link_card = (tokens, idx) => {
        const { title, avatar, label, url } = tokens[idx].meta;

        // 安全转义防止 XSS
        const escapeHtml = (str) => String(str).replace(/[&<>"']/g,
            m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

        const safeTitle = escapeHtml(title);
        const safeAvatar = escapeHtml(avatar);
        const safeLabel = escapeHtml(label);
        const safeUrl = escapeHtml(url);
        const displayUrl = safeUrl//.replace(/^https?:\/\//, ''); // 简化URL显示

        return `
            <div class="link-card-container">
                <div class="link-card">
                    <a href="${safeUrl}" target="_blank" class="link-content">
                        <p class="link-title">${safeTitle}</p>
                        <p class="link-url">${safeLabel}</p>
                    </a>
                    <div class="link-avatar" 
                            style="background-image: url('${safeAvatar}')"
                            onerror="this.style.backgroundImage='none'">
                    </div>
                </div>
            </div>`;
    };
    // console.log('Updated inline rulers:', md.block.ruler.__rules__.map(r => r.name));

    //轮播图渲染
    md.renderer.rules.carousel_open = (tokens, idx) => {
        const token = tokens[idx];
        const classAttr = token.attrs?.find(attr => attr[0] === 'class');
        return `<div class="carousel-wrapper"> <div class="container-btn prev">${svgLeft}</div><div class="${classAttr ? classAttr[1] : ''}">\n
        `;
    };
    // md.renderer.rules.carousel_close = () => `</div><div class="container-btn next">${svgRight}</div></div>\n`;
    md.renderer.rules.carousel_close = (tokens, idx, options, env, self) => {
        // 你可以从 token 或 env 中记录图片数量（比如 5 张），这里假设为 5：
        const dotCount = env.carouselImageCount;

        const dotsHtml = `<div class="container-indicators">` +
            Array(dotCount).fill(0).map((_, i) => `<span class="dot${i === 0 ? ' active' : ''}"></span>`).join('') +
            `</div>`;

        return `</div>${dotsHtml}<div class="container-btn next">${svgRight}</div></div>\n`;
    };
    md.renderer.rules.container_item_open = (tokens, idx) => {
        const token = tokens[idx];
        const classAttr = token.attrs?.find(attr => attr[0] === 'class');
        return `<div class="${classAttr ? classAttr[1] : ''}">`;
    };
    md.renderer.rules.container_item_close = () => ` </div>`;


};


