/**
 * Convert simple markdown to HTML for display in chat
 * Supports: **bold**, *italic*, - list items, numbered lists, line breaks, headers
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown) return "";

  let html = markdown.trim();

  // First, handle code blocks to protect them from other transformations
  const codeBlocks: string[] = [];
  html = html.replace(/`([^`]+)`/g, (match, code) => {
    const index = codeBlocks.length;
    codeBlocks.push(code);
    return `__CODE_BLOCK_${index}__`;
  });

  // Convert headers (must be at start of line, after line breaks)
  html = html.replace(/^###\s+(.*)$/gm, '<h3 class="markdown-h3">$1</h3>');
  html = html.replace(/^##\s+(.*)$/gm, '<h2 class="markdown-h2">$1</h2>');
  html = html.replace(/^#\s+(.*)$/gm, '<h1 class="markdown-h1">$1</h1>');

  // Convert **bold** text (avoid overlapping with headers)
  html = html.replace(/\*\*((?:(?!\*\*).)+)\*\*/g, "<strong>$1</strong>");

  // Convert *italic* text (make sure it's not part of list markers)
  html = html.replace(/(?<![\*-]\s)\*([^*\n]+)\*/g, "<em>$1</em>");

  // Convert numbered lists (1. item) - must be at start of line
  html = html.replace(
    /^(\d+\.)\s+(.*)$/gm,
    '<div class="list-item numbered"><span class="list-number">$1</span> $2</div>'
  );

  // Convert bullet lists (- item or * item) - must be at start of line
  html = html.replace(
    /^[-*]\s+(.*)$/gm,
    '<div class="list-item bullet">• $1</div>'
  );

  // Convert links [text](url)
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="markdown-link">$1</a>'
  );

  // Restore code blocks with proper styling
  codeBlocks.forEach((code, index) => {
    html = html.replace(
      `__CODE_BLOCK_${index}__`,
      `<code class="markdown-code">${code}</code>`
    );
  });

  // Convert line breaks to <br> tags (but not for headers and lists that already have divs)
  html = html.replace(/\n(?!<[hd])/g, "<br>");

  // Clean up multiple line breaks
  html = html.replace(/(<br>\s*){3,}/g, "<br><br>");

  return html;
}

/**
 * CSS styles for markdown elements (to be used with Tailwind classes)
 */
export const markdownStyles = {
  "markdown-h1": "text-lg font-bold text-gray-900 mb-2 mt-2",
  "markdown-h2": "text-base font-bold text-gray-800 mb-1 mt-2",
  "markdown-h3": "text-sm font-semibold text-gray-700 mb-1 mt-1",
  "markdown-code":
    "bg-gray-100 text-red-600 px-1 py-0.5 rounded text-xs font-mono",
  "markdown-link": "text-red-600 hover:text-red-800 underline",
  "list-item": "mb-1 flex items-start",
  "list-number": "text-red-600 font-semibold mr-2 flex-shrink-0",
  numbered: "text-sm",
  bullet: "text-sm",
};
