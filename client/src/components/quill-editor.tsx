import "react-quill/dist/quill.snow.css";

import LoadingSpinner from "./loading-spinner";
import { Skeleton } from "./ui/skeleton";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), {
    ssr: false,
    loading: () => (
        <Skeleton className="h-60 w-full flex items-center justify-center">
            <LoadingSpinner />
        </Skeleton>
    ),
});

interface QuillEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    readOnly?: boolean;
    className?: string;
}

export function QuillEditor({
    value,
    onChange,
    placeholder,
    readOnly = false,
    className,
}: QuillEditorProps) {
    const modules = {
        toolbar: [
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            ["clean"],
        ],
    };

    const formats = [
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "link",
    ];

    return (
        <ReactQuill
            theme="snow"
            value={value}
            modules={modules}
            formats={formats}
            placeholder={placeholder}
            readOnly={readOnly}
            onChange={onChange}
            className={className}
        />
    );
}
