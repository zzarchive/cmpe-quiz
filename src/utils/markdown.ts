export function renderMarkdown(md: string): string {
  const latexBlocks: string[] = [];
  let text = md.replace(/\$\$([\s\S]*?)\$\$/g, (_, code) => {
    latexBlocks.push(`$$${code}$$`);
    return `%%LATEX_BLOCK_${latexBlocks.length - 1}%%`;
  });
  text = text.replace(/\$([^\$\n]+?)\$/g, (_, code) => {
    latexBlocks.push(`$${code}$`);
    return `%%LATEX_BLOCK_${latexBlocks.length - 1}%%`;
  });
  let html = text
    .replace(/^### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^## (.+)$/gm, '<h3>$1</h3>')
    .replace(/^# (.+)$/gm, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, (m) => m.startsWith('<') ? m : `<p>${m}</p>`)
    .replace(/<p><\/p>/g, '')
    .replace(/%%LATEX_BLOCK_(\d+)%%/g, (_, idx) => latexBlocks[parseInt(idx)]);
  return html;
}
