import { render, IconToggleButton, Button, TextboxMultiline } from '@create-figma-plugin/ui'
import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import '!./output.css'

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
}

function Plugin() {
  const [styleData, setStyleData] = useState<any[] | null>(null)
  const [toggledStyleIds, setToggledStyleIds] = useState<string[]>([])
  const [cssContent, setCssContent] = useState<string>('')

  useEffect(() => {
    console.log('Updated styleData:', styleData)
  }, [styleData])

  const handleMessage = (event: MessageEvent) => {
    let response = event.data.pluginMessage
    if (response.type === 'selected-color') {
      const selectedColor = rgbToHex(response.color.r, response.color.g, response.color.b)
      setToggledStyleIds(response.styleIds)
      setStyleData(prevStyleData => {
        if (prevStyleData) {
          return prevStyleData.map(style => {
            if (response.styleIds.includes(style.id)) {
              return { ...style, newColor: selectedColor }
            }
            return style
          })
        }
        return prevStyleData
      })
      // Remove toggles
      setToggledStyleIds([])
    } else {
      const styles = handleStyles(response)
      setStyleData(styles)
      console.log('Updated style data:', styles)
    }
  }

  useEffect(() => {
    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [toggledStyleIds])

  const handleStyles = (response: any) => {
    let styles: any[] = []
  
    for (const key in response) {
      if (response[key] && response[key].color && response[key].color.color) {
        const { r, g, b } = response[key].color.color;
        styles.push({
          name: response[key].name,
          id: response[key].id,
          color: rgbToHex(r, g, b)
        })
      } else {
        console.warn(`Skipping style with key ${key} due to missing color information`);
      }
    }
    return styles
  }

  const scanStyles = () => {
    parent.postMessage({ pluginMessage: { type: 'scan-styles' } }, '*')
  }

  const handleToggledStyles = (style: any) => {
    setToggledStyleIds(prevIds => {
      console.log('prevIds', prevIds)
      const newIds = prevIds.includes(style.id)
        ? prevIds.filter(id => id !== style.id)
        : [...prevIds, style.id]
      
      parent.postMessage({ pluginMessage: { type: 'toggled-styles', styleIds: newIds } }, '*')
      return newIds
    })
    console.log('newIds', toggledStyleIds)
  }

  const handleUnlinkStyle = (style: any) => {
    // remove the selectedColour from StyleData
    setStyleData(prevStyleData => {
      return prevStyleData?.map(s => {
        if (s.id === style.id) {
          return { ...s, newColor: null }
        }
        return s
      }) ?? []
    })
  }

  const handleExport = () => {
    const stylesToExport = styleData?.filter(style => style.newColor) || [];
    parent.postMessage({ pluginMessage: { type: 'export-styles', styles: stylesToExport } }, '*');
  }

  useEffect(() => {
    const handleCssContent = (event: MessageEvent) => {
      if (event.data.pluginMessage.type === 'css-content') {
        setCssContent(event.data.pluginMessage.content);
      }
    };

    window.addEventListener('message', handleCssContent);
    return () => window.removeEventListener('message', handleCssContent);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold underline">
        Color Styles Scanner
      </h1>
      {styleData ? (
        <div>
          <ul>
            {styleData.map((style) => (
              <li key={style.id}>
                {style.name}: {style.color} 
                {style.newColor && ` → ${style.newColor}`}
                {!style.newColor ? (
                  <IconToggleButton
                    value={toggledStyleIds.includes(style.id)}
                    onChange={() => handleToggledStyles(style)}
                  >
                    Tick
                  </IconToggleButton>
                ) : (
                  <Button onClick={() => handleUnlinkStyle(style)}>
                    Unlink
                  </Button>
                )}
              </li>
            ))}
          </ul>
          <Button onClick={handleExport}>
            Export Styles
          </Button>
          {cssContent && (
            <div>
              <h2>Generated CSS:</h2>
              <TextboxMultiline
                value={cssContent}
                readOnly
                rows={10}
                variant="border"
                style={{ width: '100%', marginTop: '10px' }}
              />
            </div>
          )}
        </div>
      ) : (
        <div>
          <p>Start by scanning styles</p>
          <Button onClick={scanStyles}>
            Scan Styles
          </Button>
        </div>
      )}
    </div>
  )
}

export default render(Plugin)