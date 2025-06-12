// utils/markdown-it-config.js
import MarkdownIt from 'markdown-it';
import mingcuteIcon from "@/assets/svg/mingcute.svg";
import errorIcon from "@/assets/svg/error.svg";
import warningIcon from "@/assets/svg/warning.svg";
import { createHighlighter } from 'shiki'

// 初始化 markdown-it 实例
const mdit = new MarkdownIt();
// ----------------------------
// 自定义语法插件
// ----------------------------
export const customPlugin = (md) => {
    // 安全边界计数器
    const MAX_ITERATIONS = 1000;
    const TOKEN_PREFIX = 'my_admonition_';
    const TOKEN_PREFIX_BLOCK = 'my_block_';

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

    md.block.ruler.before('fence', 'block', (state, startLine) => {
        if (startLine >= state.lineMax) return false;

        const startPos = state.bMarks[startLine];
        const maxPos = state.eMarks[startLine];
        const lineText = state.src.slice(startPos, maxPos);

        // 匹配 `` 类型 [标题]
        const openMatch = lineText.match(/^~~\s+(\w+)(?:\s+(.*))?$/);
        // console.log('----',lineText)
        if (!openMatch) return false;

        const [_, type, title] = openMatch;
        let endLine = startLine + 1;
        let iteration = 0;
        let foundEnd = false;

        // 查找结束标记
        while (endLine < state.lineMax && iteration < MAX_ITERATIONS) {
            iteration++;
            const endPos = state.bMarks[endLine];
            const endMaxPos = state.eMarks[endLine];
            const endLineText = state.src.slice(endPos, endMaxPos);

            // 允许缩进和空格
            if (endLineText.trim() === '~~') {
                foundEnd = true;
                break;
            }

            endLine++;
        }

        if (!foundEnd) return false;

        // 2. 创建 token - 关键修复：确保 token 类型正确
        const tokenOpen = state.push(`${TOKEN_PREFIX_BLOCK}open`, 'div', 1);
        tokenOpen.attrSet('class', `m-code-block`);

        // 标题 token
        if (title) {
            const tokenTitle = state.push(`${TOKEN_PREFIX_BLOCK}title`, '', 0);
            // tokenTitle.content = title.trim();
            tokenTitle.content = getHtml();
        }

        // 内容解析
        state.line = startLine + 1;
        state.md.block.tokenize(state, startLine + 1, endLine);

        // 关闭 token
        state.push(`${TOKEN_PREFIX_BLOCK}close`, 'div', -1);

        state.line = endLine + 1;
        return true;
    });

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
            <div class="md-collapse-title">${title}</div>
            <div class="md-collapse-body">
              <div class="md-collapse-inner open">${renderedContent}</div>
            </div>
          </div>
        `;
    
        return true;
      });

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

    // 将规则提升到最高优先级（在 text 规则之前）
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

    //块级代码渲染
    md.renderer.rules[`${TOKEN_PREFIX_BLOCK}open`] = function (tokens, idx) {
        const token = tokens[idx];
        // console.log('强制触发规则!--', token.attrGet('class').split(' '));
        return `<div class="${token.attrGet('class')}">
                        <div class="block-content">`;
    };
    //块级代码结尾渲染
    md.renderer.rules[`${TOKEN_PREFIX_BLOCK}close`] = () => '</div></div>';

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

    md.renderer.rules.highlight = (tokens, idx) => {
        const token = tokens[idx];
        return `<mark class="${token.attrs[0][1]}">
                  <span class="mark-span">${token.content}</span>
                </mark>`;
      };
    // console.log('Updated inline rulers:', md.block.ruler.__rules__.map(r => r.name));
};

const getHtml = async () => {
    const highlighter = await createHighlighter({
        langs: ['javascript', 'css', 'csharp'],
        themes: [
            {
                name: 'my-theme',
                settings: [
                    {
                        scope: ['comment'],
                        settings: {
                            // 使用 `rgb`、`hsl`、`hsla`，//
                            // 或者任何你的渲染器支持的颜色。
                            foreground: 'rgb(128, 128, 128)'
                        }
                    },
                    {
                        scope: ['string'],
                        settings: {
                            foreground: '#79b8ff' // CSS 变量
                        }
                    }
                    // 更多
                ],
                // 背景和前景颜色
                bg: '#ff66661a',
                fg: '#005CC5'
            }
        ],
        lineOptions: [
            { line: 2, classes: ['highlighted-line'] }, // 高亮特定行
            { line: 3, color: '#FF000033' } // 直接指定行背景色
        ],
        meta: { inline: true } // 内联样式（无额外包裹标签）
    })

    let html = highlighter.codeToHtml(
        ` import { createHighlighter } from 'shiki'
      
        // createHighlighter 是异步的，它会初始化高亮器
        // 并加载指定的语言和主题。
        const highlighter = await createHighlighter({
          themes: ['nord'],
          langs: ['javascript'],
        })
      
        // 然后你就可以同步地使用 highlighter.codeToHtml
        // 并使用你指定的其中一个主题和语言。
        const code = highlighter.codeToHtml('const a = 1', {
          lang: 'javascript',
          theme: 'nord'
        })
          `,
        {
            lang: 'javascript',
            theme: 'my-theme'
        }
    )
    return html;
}
