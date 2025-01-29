declare module 'react-text-editor-kit' {
    import { ComponentType } from 'react';

    // Updated interface to accept `string | undefined`
    interface ReactEditorProps {
        value: string | undefined; // Allow undefined here
        onChange: (value: string) => void;
        
        // Optional props
        placeholder?: string;
        mainProps?: React.HTMLProps<HTMLElement>;
        className?: string;
    }

    const ReactEditor: ComponentType<ReactEditorProps>;
    export default ReactEditor;
}
