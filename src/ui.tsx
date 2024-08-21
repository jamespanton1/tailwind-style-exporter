import { render, SegmentedControl, SegmentedControlOption} from '@create-figma-plugin/ui'
import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import '!./output.css'
import ControlBar from './components/ControlBar'
import StyleTable from './components/StyleTable'
import CssDisplay from './components/CssDisplay'

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
}

function Plugin() {
  const [styleData, setStyleData] = useState<any[] | null>(null)
  const [toggledStyleIds, setToggledStyleIds] = useState<string[]>([])
  const [cssContent, setCssContent] = useState<string>('')
  const [primaryStyleId, setPrimaryStyleId] = useState<string | null>(null)
  const [view, SetView] = useState<string>("Styles")

  useEffect(() => {
    console.log('Updated styleData:', styleData)
    if (styleData && styleData.some(style => style.newColor)) {
      handleExport()
    }
  }, [styleData])

  const handleMessage = (event: MessageEvent) => {
    let response = event.data.pluginMessage
    if (response.type === 'selected-color') {
      const selectedColor = rgbToHex(response.color.r, response.color.g, response.color.b)
      setToggledStyleIds(response.styleIds)
      setStyleData(prevStyleData => {
        if (prevStyleData) {
          return prevStyleData.map(style => {
            if (primaryStyleId === style.id) {
              return { ...style, newColor: selectedColor, isPrimary: true }
            }
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
    } else if (response.type === 'styles-scanned') {
      const styles = handleStyles(response.styles)
      setStyleData(styles)
      console.log('Updated style data:', styles)
    }
  }

  useEffect(() => {
    // Scan styles when the component mounts
    scanStyles();

    // Set up event listener for messages
    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

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

  const handleMakePrimary = (style: any) => {
    setStyleData(prevStyleData => {
      return prevStyleData?.map(s => {
        if (s.id === style.id) {
          return { ...s, isPrimary: true };
        }
        return { ...s, isPrimary: false };
      }) ?? [];
    });
    setPrimaryStyleId(style.id);
  }

  const handleClear = () => {
    // remove newColor from StyleData
    setStyleData(prevStyleData => {
      return prevStyleData?.map(s => {
        return { ...s, newColor: null }
      }) ?? []
    })
    setCssContent('')
  }


  const handleExport = () => {
    const stylesToExport = styleData?.filter(style => style.newColor) || [];
    const primaryStyle = styleData?.find(style => style.isPrimary);
    if (primaryStyle) {
      stylesToExport.push({
        ...primaryStyle,
        name: 'primary',
        isPrimary: true
      });
    }
    parent.postMessage({ pluginMessage: { type: 'export-styles', styles: stylesToExport } }, '*');
  };

  useEffect(() => {
    const handleCssContent = (event: MessageEvent) => {
      if (event.data.pluginMessage.type === 'css-content') {
        setCssContent(event.data.pluginMessage.content);
        // Automatically switch to the CSS view when content is received
      }
    };

    window.addEventListener('message', handleCssContent);
    return () => window.removeEventListener('message', handleCssContent);
  }, []);

  const handleViewChange = (event: any) => {
    const newVale = event.target.value
    SetView(newVale)
  }

  const options: Array<SegmentedControlOption> = [{
    value: 'Styles'
  }, {
    value: 'Css',
    disabled: !cssContent
  }];

  return (
    <div class='p-4'>
      <div class='mb-3'>
        <SegmentedControl onChange={handleViewChange} options={options} value={view} />
      </div>
      {styleData ? (
        <div>
          {view === 'Styles' && (
            <StyleTable 
              styles={styleData} 
              onMakePrimary={handleMakePrimary}
              toggledStyleIds={toggledStyleIds}
              onToggleStyle={handleToggledStyles}
              onUnlinkStyle={handleUnlinkStyle}
            />
          )}
          {view === 'Css' && cssContent && (
            <CssDisplay cssContent={cssContent} />
          )}
        </div>
      ) : (
        <div>
          <p>Start by scanning styles</p>
        </div>
      )}
      <ControlBar onScan={scanStyles} onClear={handleClear} styles={styleData} />
    </div>
  )
}

export default render(Plugin)