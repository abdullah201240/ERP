declare module 'react-text-editor-kit' {
  interface ReactEditorProps {
    value: string;
    onChange: (value: string) => void;
    mainProps: { className: string };
    placeholder?: string;
    className?: string;
  }

  const ReactEditor: React.FC<ReactEditorProps>;
  export default ReactEditor;
}
