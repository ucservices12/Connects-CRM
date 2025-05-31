import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, File } from 'lucide-react';

interface FileAttachmentsProps {
    files: File[];
    onAddFiles: (files: File[]) => void;
    onRemoveFile: (file: File) => void;
}

const FileAttachments: React.FC<FileAttachmentsProps> = ({
    files,
    onAddFiles,
    onRemoveFile
}) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        onAddFiles(acceptedFiles);
    }, [onAddFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/zip': ['.zip'],
            'image/*': ['.png', '.jpg', '.jpeg']
        }
    });

    return (
        <div>
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-300 hover:border-primary-500 hover:bg-neutral-50'
                    }`}
            >
                <input {...getInputProps()} />
                <Upload
                    size={24}
                    className={`mx-auto mb-2 ${isDragActive ? 'text-primary-600' : 'text-neutral-400'
                        }`}
                />
                <p className="text-sm text-neutral-600">
                    {isDragActive
                        ? 'Drop the files here...'
                        : 'Drag & drop files here, or click to select files'}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                    Supported formats: PDF, DOC, DOCX, XLS, XLSX, ZIP, PNG, JPG
                </p>
            </div>

            {files.length > 0 && (
                <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                        >
                            <div className="flex items-center">
                                <FileText size={20} className="text-neutral-500 mr-2" />
                                <div>
                                    <p className="text-sm font-medium">{file.name}</p>
                                    <p className="text-xs text-neutral-500">
                                        {(file.size / 1024).toFixed(1)} KB
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => onRemoveFile(file)}
                                className="p-1 text-neutral-500 hover:text-danger-600 rounded-full hover:bg-neutral-100"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileAttachments;