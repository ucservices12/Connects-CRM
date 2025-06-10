import React, { useState } from 'react';
import { Download, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { generateLeadZipPackage, canDownloadZip, getDownloadStatus } from '../../utils/zipDownload';
import { useSelector } from 'react-redux';


const ZipDownloadButton = ({
    lead,
    documents,
    comments,
    callLogs,
    onDownload
}) => {
    const user = useSelector((state) => state.auth.user);
    const [isDownloading, setIsDownloading] = useState(false);

    const canDownload = canDownloadZip(lead, user?.role || 'employee');
    const downloadStatus = getDownloadStatus(lead);

    const handleDownload = async () => {
        if (!canDownload || isDownloading) return;

        setIsDownloading(true);
        try {
            await generateLeadZipPackage({
                lead,
                documents,
                comments,
                callLogs
            });

            // Simulate updating download count
            if (onDownload) {
                onDownload();
            }
        } catch (error) {
            console.error('Error generating zip package:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    const getButtonContent = () => {
        if (isDownloading) {
            return (
                <>
                    <LoadingSpinner size="sm" />
                    <span>Generating Package...</span>
                </>
            );
        }

        if (!canDownload) {
            if (user?.role !== 'admin' && (lead.status !== 'Done' || !lead.isVerified)) {
                return (
                    <>
                        <Lock className="h-4 w-4" />
                        <span>Not Available</span>
                    </>
                );
            }

            if (user?.role !== 'admin' && (lead.downloadCount || 0) >= (lead.maxDownloads || 3)) {
                return (
                    <>
                        <AlertCircle className="h-4 w-4" />
                        <span>Limit Reached</span>
                    </>
                );
            }
        }

        return (
            <>
                <Download className="h-4 w-4" />
                <span>Download Package</span>
            </>
        );
    };

    const getButtonStyle = () => {
        if (!canDownload) {
            return 'bg-gray-400 cursor-not-allowed';
        }
        return 'bg-blue-600 hover:bg-blue-700';
    };

    return (
        <div className="space-y-2">
            <button
                onClick={handleDownload}
                disabled={!canDownload || isDownloading}
                className={`w-full text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${getButtonStyle()}`}
            >
                {getButtonContent()}
            </button>

            <div className="text-xs text-gray-600 text-center">
                {user?.role === 'admin' ? (
                    <div className="flex items-center justify-center space-x-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>Admin: Unlimited downloads</span>
                    </div>
                ) : (
                    <span>{downloadStatus}</span>
                )}
            </div>

            {lead.status === 'Done' && lead.isVerified && (
                <div className="text-xs text-gray-500 text-center">
                    Package includes: Lead data, documents, comments, and call logs
                </div>
            )}
        </div>
    );
};

export default ZipDownloadButton;