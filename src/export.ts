export function generateCssFromStyles(styleData: any[]): string {
  const exsitingTailwindCss = [
    '.text-neutral-50', '.bg-neutral-50', '.fill-neutral-50', '.border-neutral-50',
    '.text-neutral-100', '.bg-neutral-100', '.fill-neutral-100', '.border-neutral-100',
    '.text-neutral-200', '.bg-neutral-200', '.fill-neutral-200', '.border-neutral-200',
    '.text-neutral-300', '.bg-neutral-300', '.fill-neutral-300', '.border-neutral-300',
    '.text-neutral-400', '.bg-neutral-400', '.fill-neutral-400', '.border-neutral-400',
    '.text-neutral-500', '.bg-neutral-500', '.fill-neutral-500', '.border-neutral-500',
    '.text-neutral-600', '.bg-neutral-600', '.fill-neutral-600', '.border-neutral-600',
    '.text-neutral-700', '.bg-neutral-700', '.fill-neutral-700', '.border-neutral-700',
    '.text-neutral-800', '.bg-neutral-800', '.fill-neutral-800', '.border-neutral-800',
    '.text-neutral-900', '.bg-neutral-900', '.fill-neutral-900', '.border-neutral-900',
    '.text-grey-50', '.bg-grey-50', '.fill-grey-50', '.border-grey-50',
    '.text-grey-100', '.bg-grey-100', '.fill-grey-100', '.border-grey-100',
    '.text-grey-200', '.bg-grey-200', '.fill-grey-200', '.border-grey-200',
    '.text-grey-300', '.bg-grey-300', '.fill-grey-300', '.border-grey-300',
    '.text-grey-400', '.bg-grey-400', '.fill-grey-400', '.border-grey-400',
    '.text-grey-500', '.bg-grey-500', '.fill-grey-500', '.border-grey-500',
    '.text-grey-600', '.bg-grey-600', '.fill-grey-600', '.border-grey-600',
    '.text-grey-700', '.bg-grey-700', '.fill-grey-700', '.border-grey-700',
    '.text-grey-800', '.bg-grey-800', '.fill-grey-800', '.border-grey-800',
    '.text-grey-900', '.bg-grey-900', '.fill-grey-900', '.border-grey-900',
    '.text-warning-50', '.bg-warning-50', '.fill-warning-50', '.border-warning-50',
    '.text-warning-100', '.bg-warning-100', '.fill-warning-100', '.border-warning-100',
    '.text-warning-200', '.bg-warning-200', '.fill-warning-200', '.border-warning-200',
    '.text-warning-300', '.bg-warning-300', '.fill-warning-300', '.border-warning-300',
    '.text-warning-400', '.bg-warning-400', '.fill-warning-400', '.border-warning-400',
    '.text-warning-500', '.bg-warning-500', '.fill-warning-500', '.border-warning-500',
    '.text-warning-600', '.bg-warning-600', '.fill-warning-600', '.border-warning-600',
    '.text-warning-700', '.bg-warning-700', '.fill-warning-700', '.border-warning-700',
    '.text-warning-800', '.bg-warning-800', '.fill-warning-800', '.border-warning-800',
    '.text-warning-900', '.bg-warning-900', '.fill-warning-900', '.border-warning-900',
    '.text-success-50', '.bg-success-50', '.fill-success-50', '.border-success-50',
    '.text-success-100', '.bg-success-100', '.fill-success-100', '.border-success-100',
    '.text-success-200', '.bg-success-200', '.fill-success-200', '.border-success-200',
    '.text-success-300', '.bg-success-300', '.fill-success-300', '.border-success-300',
    '.text-success-400', '.bg-success-400', '.fill-success-400', '.border-success-400',
    '.text-success-500', '.bg-success-500', '.fill-success-500', '.border-success-500',
    '.text-success-600', '.bg-success-600', '.fill-success-600', '.border-success-600',
    '.text-success-700', '.bg-success-700', '.fill-success-700', '.border-success-700',
    '.text-success-800', '.bg-success-800', '.fill-success-800', '.border-success-800',
    '.text-success-900', '.bg-success-900', '.fill-success-900', '.border-success-900',
    '.text-error-50', '.bg-error-50', '.fill-error-50', '.border-error-50',
    '.text-error-100', '.bg-error-100', '.fill-error-100', '.border-error-100',
    '.text-error-200', '.bg-error-200', '.fill-error-200', '.border-error-200',
    '.text-error-300', '.bg-error-300', '.fill-error-300', '.border-error-300',
    '.text-error-400', '.bg-error-400', '.fill-error-400', '.border-error-400',
    '.text-error-500', '.bg-error-500', '.fill-error-500', '.border-error-500',
    '.text-error-600', '.bg-error-600', '.fill-error-600', '.border-error-600',
    '.text-error-700', '.bg-error-700', '.fill-error-700', '.border-error-700',
    '.text-error-800', '.bg-error-800', '.fill-error-800', '.border-error-800',
    '.text-error-900', '.bg-error-900', '.fill-error-900', '.border-error-900',
    '.text-primary-50', '.bg-primary-50', '.fill-primary-50', '.border-primary-50',
    '.text-primary-100', '.bg-primary-100', '.fill-primary-100', '.border-primary-100',
    '.text-primary-200', '.bg-primary-200', '.fill-primary-200', '.border-primary-200',
    '.text-primary-300', '.bg-primary-300', '.fill-primary-300', '.border-primary-300',
    '.text-primary-400', '.bg-primary-400', '.fill-primary-400', '.border-primary-400',
    '.text-primary-500', '.bg-primary-500', '.fill-primary-500', '.border-primary-500',
    '.text-primary-600', '.bg-primary-600', '.fill-primary-600', '.border-primary-600',
    '.text-primary-700', '.bg-primary-700', '.fill-primary-700', '.border-primary-700',
    '.text-primary-800', '.bg-primary-800', '.fill-primary-800', '.border-primary-800',
    '.text-primary-900', '.bg-primary-900', '.fill-primary-900', '.border-primary-900',
  ]
  
  let cssContent = '/* Updated Tailwind Color Styles */\n\n';

  console.log('styleData:', JSON.stringify(styleData, null, 2));

  if (!Array.isArray(styleData) || styleData.length === 0) {
    console.error('styleData is empty or not an array');
    return '';
  }

  const colorMap = new Map(styleData.map(style => {
    if (!style || typeof style !== 'object') {
      console.error('Invalid style object:', style);
      return null;
    }
    const name = style.name?.toLowerCase().replace(/[\s/]+/g, '-');
    const color = style.newColor || style.color;
    return name && color ? [name, color] as const : null;
  }).filter((entry): entry is [string, string] => entry !== null));

  console.log('colorMap:', Object.fromEntries(colorMap));

  exsitingTailwindCss.forEach(className => {
    const [, colorType, colorName, shade] = className.match(/\.(text|bg|fill|border)-(\w+)-(\d+)/) || [];
    if (colorType && colorName && shade) {
      const fullColorName = `${colorName}-${shade}`;
      const newColor = colorMap.get(fullColorName);
      if (newColor) {
        switch (colorType) {
          case 'text':
            cssContent += `${className} { color: ${newColor}; }\n`;
            break;
          case 'bg':
            cssContent += `${className} { background-color: ${newColor}; }\n`;
            break;
          case 'fill':
            cssContent += `${className} { fill: ${newColor}; }\n`;
            break;
          case 'border':
            cssContent += `${className} { border-color: ${newColor}; }\n`;
            break;
        }
      }
    }
  });

  return cssContent;
}