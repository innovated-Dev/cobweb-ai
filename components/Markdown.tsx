'use client';

interface MarkdownProps {
  content: string;
}

export function Markdown({ content }: MarkdownProps) {
  const html = parseMarkdown(content);
  return (
    <div
      className="prose-cobweb"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function parseMarkdown(text: string): string {
  let html = text;

  // Escape HTML
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>');

  // Unordered lists
  html = html.replace(/^([\s\S]*?)(?=\n\n|$)/gm, (block) => {
    if (/^[-*] /m.test(block)) {
      const items = block
        .split('\n')
        .filter(line => /^[-*] /.test(line))
        .map(line => `<li>${line.replace(/^[-*] /, '')}</li>`)
        .join('');
      return `<ul>${items}</ul>`;
    }
    return block;
  });

  // Ordered lists  
  html = html.replace(/^([\s\S]*?)(?=\n\n|$)/gm, (block) => {
    if (/^\d+\. /m.test(block)) {
      const items = block
        .split('\n')
        .filter(line => /^\d+\. /.test(line))
        .map(line => `<li>${line.replace(/^\d+\. /, '')}</li>`)
        .join('');
      return `<ol>${items}</ol>`;
    }
    return block;
  });

  // Paragraphs (lines not already wrapped in tags)
  const lines = html.split('\n');
  const processed: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (
      line &&
      !line.startsWith('<h') &&
      !line.startsWith('<ul') &&
      !line.startsWith('<ol') &&
      !line.startsWith('<li') &&
      !line.startsWith('<hr') &&
      !line.startsWith('</') &&
      !line.startsWith('<p')
    ) {
      processed.push(`<p>${line}</p>`);
    } else if (line) {
      processed.push(line);
    }
    i++;
  }

  return processed.join('\n');
}
