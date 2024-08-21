import { h } from 'preact';
import { FunctionComponent as FC } from 'preact';
import { Button } from '@create-figma-plugin/ui';

interface ControlBarProps {
  onScan: () => void;
  onExport: () => void;
  styles: any[] | null;
}

const ControlBar: FC<ControlBarProps> = ({ onScan, onExport, styles }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3">
    <Button onClick={onScan}>Scan Styles</Button>
    {styles && styles.length > 0 && styles.some(style => style.newColor) && <Button onClick={onExport}>Generate CSS</Button>}
  </div>
);

export default ControlBar;