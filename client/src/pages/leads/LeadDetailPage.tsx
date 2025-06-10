import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import {
    Phone,
    Mail,
    MapPin,
    DollarSign,
    User,
    MessageSquare,
    PhoneCall,
    Upload,
    Download,
    FileText,
    Calendar,
    Clock,
    CheckCircle,
    Package
} from 'lucide-react';
import { mockLeads, mockComments, mockCallLogs, mockDocuments } from '../../data/mockData';
import StatusBadge from '../../components/ui/StatusBadge';
import PriorityBadge from '../../components/ui/PriorityBadge';
import CallRecording from '../../components/ui/CallRecording';
import ZipDownloadButton from '../../components/ui/ZipDownloadButton';
import { useSelector } from 'react-redux';

const LeadDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const user = useSelector((state) => state.auth.user);
    const [activeTab, setActiveTab] = useState('overview');
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [isCallInProgress, setIsCallInProgress] = useState(false);

    const lead = mockLeads.find(l => l.id === id);
    const leadComments = mockComments.filter(c => c.leadId === id);
    const leadCallLogs = mockCallLogs.filter(c => c.leadId === id);
    const leadDocuments = mockDocuments.filter(d => d.leadId === id);

    if (!lead) {
        return <Navigate to="/employee/leads\" replace />;
    }

    // Check if user has access to this lead
    if (user?.role === 'employee' && lead.assignedTo !== "2") {
        return <Navigate to="/employee/leads" replace />;
    }

    const handleStatusChange = async (status: string) => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        setNewStatus('');
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setNewComment('');
        setIsLoading(false);
    };

    const handleCallNow = async () => {
        setIsCallInProgress(true);
        // Simulate call initiation and recording
        await new Promise(resolve => setTimeout(resolve, 3000));
        setIsCallInProgress(false);
    };

    const handleVerifyLead = async () => {
        setIsLoading(true);
        // Simulate verification process
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
    };

    const allDocumentsVerified = leadDocuments.length > 0 && leadDocuments.every(doc => doc.status === 'Verified');
    const canVerifyLead = lead.status === 'Approved' && allDocumentsVerified && !lead.isVerified;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'comments', label: 'Comments', icon: MessageSquare },
        { id: 'calls', label: 'Call Logs', icon: PhoneCall },
        { id: 'documents', label: 'Documents', icon: FileText },
        { id: 'package', label: 'Download Package', icon: Package },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                    {lead.customerName.split(' ').map(n => n[0]).join('')}
                                </span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{lead.customerName}</h1>
                                <p className="text-gray-600">
                                    {lead.productType} - ${lead.loanAmount.toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <StatusBadge status={lead.status} />
                            <PriorityBadge priority={lead.priority} />
                            {lead.isVerified && (
                                <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Verified</span>
                                </div>
                            )}
                            <button
                                onClick={handleCallNow}
                                disabled={isCallInProgress}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 disabled:opacity-50"
                            >
                                {isCallInProgress ? (
                                    <LoadingSpinner size="sm" />
                                ) : (
                                    <Phone className="h-4 w-4" />
                                )}
                                <span>{isCallInProgress ? 'Calling...' : 'Call Now'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <tab.icon className="h-5 w-5" />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Customer Information */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-3">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600">Phone</p>
                                            <p className="font-medium">{lead.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="font-medium">{lead.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600">Address</p>
                                            <p className="font-medium">{lead.address}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <DollarSign className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-600">Monthly Income</p>
                                            <p className="font-medium">${lead.monthlyIncome.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Lead Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Product Type</p>
                                        <p className="font-medium">{lead.productType}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Loan Amount</p>
                                        <p className="font-medium">${lead.loanAmount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Employment Type</p>
                                        <p className="font-medium">{lead.employmentType}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Credit Score</p>
                                        <p className="font-medium">{lead.creditScore || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Source</p>
                                        <p className="font-medium">{lead.source}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Assigned To</p>
                                        <p className="font-medium">{lead.assignedToName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Created Date</p>
                                        <p className="font-medium">{new Date(lead.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Last Updated</p>
                                        <p className="font-medium">{new Date(lead.updatedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                {lead.notes && (
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-600">Notes</p>
                                        <p className="font-medium">{lead.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status Update & Actions */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Update Status</h2>
                                <form onSubmit={(e) => { e.preventDefault(); handleStatusChange(newStatus); }}>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Current Status
                                        </label>
                                        <StatusBadge status={lead.status} />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Change Status
                                        </label>
                                        <select
                                            value={newStatus}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select new status</option>
                                            <option value="New">New</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Done">Done</option>
                                            <option value="Rejected">Rejected</option>
                                            <option value="On Hold">On Hold</option>
                                        </select>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!newStatus || isLoading}
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? <LoadingSpinner size="sm" /> : 'Update Status'}
                                    </button>
                                </form>
                            </div>

                            {/* Lead Verification */}
                            {canVerifyLead && (
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Lead Verification</h2>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                            <span className="text-sm text-gray-700">All documents verified</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                            <span className="text-sm text-gray-700">Lead approved</span>
                                        </div>
                                        <button
                                            onClick={handleVerifyLead}
                                            disabled={isLoading}
                                            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                                        >
                                            {isLoading ? (
                                                <LoadingSpinner size="sm" />
                                            ) : (
                                                <>
                                                    <CheckCircle className="h-4 w-4" />
                                                    <span>Verify Lead</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'comments' && (
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">Comments</h2>
                        </div>
                        <div className="p-6">
                            {/* Add Comment Form */}
                            <form onSubmit={handleCommentSubmit} className="mb-6">
                                <div className="mb-4">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Add a comment..."
                                        rows={3}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!newComment.trim() || isLoading}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {isLoading ? <LoadingSpinner size="sm" /> : 'Add Comment'}
                                </button>
                            </form>

                            {/* Comments List */}
                            <div className="space-y-4">
                                {leadComments.map((comment) => (
                                    <div key={comment.id} className="flex space-x-3">
                                        <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                                            <span className="text-white font-medium">
                                                {comment.userName.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-medium text-gray-900">{comment.userName}</span>
                                                        {comment.isInternal && (
                                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                                                Internal
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(comment.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                                <p className="text-gray-700">{comment.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {leadComments.length === 0 && (
                                    <p className="text-gray-500 text-center py-8">No comments yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'calls' && (
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">Call Logs</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {leadCallLogs.map((call) => (
                                    <div key={call.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                                                <div className={`p-2 rounded-full ${call.callType === 'Outgoing' ? 'bg-green-100' : 'bg-blue-100'}`}>
                                                    <PhoneCall className={`h-4 w-4 ${call.callType === 'Outgoing' ? 'text-green-600' : 'text-blue-600'}`} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{call.callType} Call</p>
                                                    <p className="text-sm text-gray-600">by {call.calledByName}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-gray-900">{Math.floor(call.duration / 60)}:{(call.duration % 60).toString().padStart(2, '0')}</p>
                                                <p className="text-sm text-gray-600">{new Date(call.createdAt).toLocaleString()}</p>
                                            </div>
                                        </div>

                                        {call.hasRecording && call.recordingUrl && (
                                            <div className="mb-3">
                                                <CallRecording
                                                    recordingUrl={call.recordingUrl}
                                                    duration={call.duration}
                                                    callId={call.id}
                                                />
                                            </div>
                                        )}

                                        <div className="mb-3">
                                            <p className="text-sm text-gray-700">{call.notes}</p>
                                        </div>
                                        <div>
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${call.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                call.status === 'No Answer' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {call.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {leadCallLogs.length === 0 && (
                                    <p className="text-gray-500 text-center py-8">No call logs yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900">Documents</h2>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                                    <Upload className="h-4 w-4" />
                                    <span>Upload Document</span>
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {leadDocuments.map((doc) => (
                                    <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-2">
                                                <FileText className="h-5 w-5 text-blue-600" />
                                                <span className="font-medium text-gray-900">{doc.type}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${doc.status === 'Verified' ? 'bg-green-100 text-green-800' :
                                                    doc.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {doc.status}
                                                </span>
                                                <button className="text-blue-600 hover:text-blue-800">
                                                    <Download className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{doc.name}</p>
                                        <div className="text-xs text-gray-500">
                                            <p>Uploaded by {doc.uploadedByName}</p>
                                            <p>{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                                            <p>{(doc.size / 1024).toFixed(0)} KB</p>
                                        </div>
                                    </div>
                                ))}
                                {leadDocuments.length === 0 && (
                                    <div className="col-span-full text-center py-8">
                                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">No documents uploaded yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'package' && (
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">Download Complete Package</h2>
                        </div>
                        <div className="p-6">
                            <div className="max-w-md mx-auto">
                                <div className="text-center mb-6">
                                    <Package className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Lead Package</h3>
                                    <p className="text-gray-600">
                                        Download a complete ZIP package containing all lead data, documents, comments, and call logs.
                                    </p>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Lead Information</span>
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Documents ({leadDocuments.length})</span>
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Comments ({leadComments.length})</span>
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Call Logs ({leadCallLogs.length})</span>
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    </div>
                                </div>

                                <ZipDownloadButton
                                    lead={lead}
                                    documents={leadDocuments}
                                    comments={leadComments}
                                    callLogs={leadCallLogs}
                                    onDownload={() => {
                                        // Handle download count update
                                        console.log('Package downloaded');
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeadDetailPage;