import { h } from 'preact';
import { FunctionComponent as FC } from 'preact';
import { Button } from '@create-figma-plugin/ui';

interface ControlBarProps {
  onScan: () => void;
  onClear: () => void;
  styles: any[] | null;
}

const ControlBar: FC<ControlBarProps> = ({ onScan, onClear, styles }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3 z-10">
    <Button onClick={onScan}>Rescan Styles</Button>
    {styles && styles.length > 0 && styles.some(style => style.newColor) && <Button onClick={onClear}>Clear</Button>}
  </div>
);

export default ControlBar;