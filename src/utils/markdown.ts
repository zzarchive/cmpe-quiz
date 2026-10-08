function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatInline(str: string): string {
  return str
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

export function renderMarkdown(md: string): string {
  // 1. Preserve Math blocks: display math $$...$$ and inline math $...$
  const mathBlocks: string[] = [];
  let text = md.replace(/\$\$([\s\S]*?)\$\$/g, (_, eq) => {
    mathBlocks.push(`$$${eq}$$`);
    return `%%MATH_${mathBlocks.length - 1}%%`;
  });
  text = text.replace(/\$([^\$\n]+?)\$/g, (_, eq) => {
    mathBlocks.push(`$${eq}$`);
    return `%%MATH_${mathBlocks.length - 1}%%`;
  });

  // 2. Preserve Code blocks
  const codeBlocks: string[] = [];
  text = text.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gi, (_, lang, code) => {
    codeBlocks.push(`<pre><code class="language-${lang}">${escapeHtml(code.trim())}</code></pre>`);
    return `%%CODE_${codeBlocks.length - 1}%%`;
  });

  // 3. Markdown Tables
  text = text.replace(
    /((?:^|\n)\|[^\n]+\|\r?\n\|[-:\s|]+\|\r?\n(?:\|[^\n]+\|\r?\n?)+)/g,
    (tableMatch) => {
      const lines = tableMatch.trim().split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      if (lines.length < 2) return tableMatch;

      const headerCells = lines[0].split('|').slice(1, -1).map((c) => c.trim());
      const alignCells = lines[1].split('|').slice(1, -1).map((c) => c.trim());

      const aligns = alignCells.map((c) => {
        if (c.startsWith(':') && c.endsWith(':')) return 'center';
        if (c.endsWith(':')) return 'right';
        return 'left';
      });

      let tableHtml = '<div class="table-wrap"><table class="markdown-table"><thead><tr>';
      headerCells.forEach((h, i) => {
        const align = aligns[i] ? ` style="text-align: ${aligns[i]};"` : '';
        tableHtml += `<th${align}>${formatInline(h)}</th>`;
      });
      tableHtml += '</tr></thead><tbody>';

      for (let r = 2; r < lines.length; r++) {
        const rowCells = lines[r].split('|').slice(1, -1).map((c) => c.trim());
        tableHtml += '<tr>';
        rowCells.forEach((c, i) => {
          const align = aligns[i] ? ` style="text-align: ${aligns[i]};"` : '';
          tableHtml += `<td${align}>${formatInline(c)}</td>`;
        });
        tableHtml += '</tr>';
      }

      tableHtml += '</tbody></table></div>';
      return '\n\n' + tableHtml + '\n\n';
    }
  );

  // 4. Headers: convert line-by-line first so adjacent headers work
  text = text.replace(/^#### (.*)$/gm, '<h5>$1</h5>');
  text = text.replace(/^### (.*)$/gm, '<h4>$1</h4>');
  text = text.replace(/^## (.*)$/gm, '<h3>$1</h3>');
  text = text.replace(/^# (.*)$/gm, '<h2>$1</h2>');

  // Horizontal rules
  text = text.replace(/^(---|___|\*\*\*)$/gm, '<hr class="markdown-hr" />');

  // Split into blocks
  const blocks = text.split(/\n\n+/);
  const parsedBlocks = blocks.map((block) => {
    const trimmed = block.trim();
    if (!trimmed) return '';

    // If it's already an HTML block or placeholder
    if (
      trimmed.startsWith('<div class="table-wrap">') ||
      trimmed.startsWith('%%CODE_') ||
      trimmed.startsWith('<hr ') ||
      trimmed.startsWith('<h2') ||
      trimmed.startsWith('<h3') ||
      trimmed.startsWith('<h4') ||
      trimmed.startsWith('<h5')
    ) {
      return trimmed.split('\n').map((line) => {
        if (/^<h[2-5]>/.test(line)) {
          return line.replace(/^(<h[2-5]>)(.*?)(<\/h[2-5]>)$/, (_, open, content, close) => {
            return `${open}${formatInline(content)}${close}`;
          });
        }
        return line;
      }).join('\n');
    }

    // Blockquote
    if (/^> /.test(trimmed)) {
      const quoteText = trimmed.split('\n').map((l) => l.replace(/^> ?/, '')).join(' ');
      return `<blockquote>${formatInline(quoteText)}</blockquote>`;
    }

    // Unordered List
    if (/^[-*] /.test(trimmed)) {
      const items = trimmed.split(/\n(?=[-*] )/).map((item) => {
        const line = item.replace(/^[-*] /, '').trim();
        return `<li>${formatInline(line)}</li>`;
      });
      return `<ul>${items.join('')}</ul>`;
    }

    // Ordered List
    if (/^\d+\. /.test(trimmed)) {
      const items = trimmed.split(/\n(?=\d+\. )/).map((item) => {
        const line = item.replace(/^\d+\. /, '').trim();
        return `<li>${formatInline(line)}</li>`;
      });
      return `<ol>${items.join('')}</ol>`;
    }

    // Paragraph
    const lines = trimmed.split('\n').map((l) => formatInline(l)).join('<br />');
    return `<p>${lines}</p>`;
  });

  let html = parsedBlocks.filter(Boolean).join('\n');
  html = html.replace(/%%CODE_(\d+)%%/g, (_, idx) => codeBlocks[parseInt(idx, 10)]);
  html = html.replace(/%%MATH_(\d+)%%/g, (_, idx) => mathBlocks[parseInt(idx, 10)]);

  return html;
}
