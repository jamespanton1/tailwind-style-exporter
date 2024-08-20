import { showUI } from '@create-figma-plugin/utilities'

export default function () {
  showUI({
    height: 300,
    width: 240
  })

  const toggledStyleIds: string[] = []

  figma.ui.onmessage = async (msg) => {
    if (msg.type === 'scan-styles') {
      const paintStyles = await figma.getLocalPaintStylesAsync()
      const colourStyles = paintStyles.map((style) => ({
        name: style.name,
        id: style.id,
        color: style.paints[0]
      }))
      figma.ui.postMessage(colourStyles)
    }

    if (msg.type === 'toggled-styles') {
      toggledStyleIds.length = 0
      toggledStyleIds.push(...msg.styleIds)
    }

    if (msg.type === 'export-styles') {
      const { generateCssFromStyles } = require('./export');
      const cssContent = generateCssFromStyles(msg.styles);
      figma.ui.postMessage({ type: 'css-content', content: cssContent });
    }
  }

  function onSelectionChange() {
    for (const node of figma.currentPage.selection) {
      if (node.type === 'RECTANGLE') {
        console.log(node)
        const fills = node.fills as Paint[]
        const selectedPaint = fills.length > 0 ? fills[0] : null
        if (selectedPaint && selectedPaint.type === 'SOLID') {
          const selectedColor = selectedPaint.color
          figma.ui.postMessage({
            type: 'selected-color',
            color: selectedColor,
            styleIds: toggledStyleIds
          })
        }
      }
    }
  }

  figma.on('selectionchange', onSelectionChange)

  onSelectionChange()
}