import { h, Fragment } from 'preact';
import { FunctionComponent as FC } from 'preact';
import { IconToggleButton, Button, Checkbox, Text, Divider, Bold, IconLinkLinked32, IconButton, IconMinus32, IconArrowRight16 } from '@create-figma-plugin/ui';

interface Style {
  id: string;
  name: string;
  color: string;
  newColor?: string;
  isPrimary?: boolean;
}

interface StyleTableProps {
  styles: Style[];
  toggledStyleIds: string[];
  onToggleStyle: (style: Style) => void;
  onUnlinkStyle: (style: Style) => void;
  onMakePrimary: (style: Style) => void;
}

const StyleTable: FC<StyleTableProps> = ({
  styles,
  toggledStyleIds,
  onToggleStyle,
  onUnlinkStyle,
  onMakePrimary
}) => {
  return (
    <div className="style-list">
      <div className="grid grid-cols-9 gap-4 mb-2">
        <Text className="col-span-3"><Bold>Style</Bold></Text>
        <Text className="col-span-3"><Bold>New Color</Bold></Text>
        <Text className="col-span-2"><Bold>Is Primary</Bold></Text>
        <Text className="col-span-1">{""}</Text>
      </div>
      <Divider />
      {styles.map((style, index) => (
        <div key={style.id}>
          <div className="grid grid-cols-9 gap-4 my-2 items-center">
            <div className="col-span-3 flex items-center">
              <div
                style={{
                  backgroundColor: style.color,
                  width: '16px',
                  height: '16px',
                  marginRight: '8px'
                }}
              />
              <Text className="mr-2">{style.name}</Text>
              {style.newColor && <IconArrowRight16 />}
            </div>
            <div className="col-span-3 flex items-center">
              {style.newColor ? (
                <Fragment>
                  <div
                    style={{
                      backgroundColor: style.newColor,
                      width: '16px',
                      height: '16px',
                      marginRight: '8px'
                    }}
                  />
                  <Text>{style.newColor}</Text>
                </Fragment>
              ) : (
                <Text>-</Text>
              )}
            </div>
            <div className="col-span-2 flex items-center justify-center">
              {style.newColor && (
                <Checkbox
                  value={style.isPrimary || false}
                  onChange={() => onMakePrimary(style)}
                >
                  {' '}
                </Checkbox>
              )}
            </div>
            <div className="col-span-1 flex items-center justify-end">
              {!style.newColor ? (
                <IconToggleButton
                  value={toggledStyleIds.includes(style.id)}
                  onChange={() => onToggleStyle(style)}
                >
                  <IconLinkLinked32 />
                </IconToggleButton>
              ) : (
                <IconButton onClick={() => onUnlinkStyle(style)}>
                  <IconMinus32 />
                </IconButton>
              )}
            </div>
          </div>
          {index < styles.length - 1 && <Divider />}
        </div>
      ))}
    </div>
  );
};

export default StyleTable;