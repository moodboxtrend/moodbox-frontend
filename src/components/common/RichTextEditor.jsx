import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ color: [] }, { background: [] }],
    ['link', 'blockquote'],
    ['clean'],
  ],
};

export function RichTextEditor({ value, onChange, placeholder }) {
  return (
    <div className="rounded-xl overflow-hidden border border-input bg-background [&_.ql-toolbar]:rounded-t-xl [&_.ql-toolbar]:border-input [&_.ql-container]:rounded-b-xl [&_.ql-container]:border-input [&_.ql-container]:font-body [&_.ql-editor]:min-h-[220px]">
      <ReactQuill theme="snow" value={value || ''} onChange={onChange} modules={modules} placeholder={placeholder} />
    </div>
  );
}
