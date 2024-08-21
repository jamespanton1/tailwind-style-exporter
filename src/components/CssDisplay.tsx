import { h } from 'preact';
import { FunctionComponent as FC } from 'preact';
import { TextboxMultiline, Text, Bold } from '@create-figma-plugin/ui';

interface CssDisplayProps {
  cssContent: string;
}

const CssDisplay: FC<CssDisplayProps> = ({ cssContent }) => {
  return (
    <div className="mt-4">
      <Text className="mb-2">
        <Bold> Generated CSS: </Bold>
      </Text>
      <TextboxMultiline
        value={cssContent}
        readOnly
        rows={10}
        variant="border"
        className="w-full"
      />
    </div>
  );
};

export default CssDisplay;
