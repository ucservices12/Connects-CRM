import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const generateLeadZipPackage = async (data) => {
    const zip = new JSZip();

    // Create lead information JSON
    const leadInfo = {
        customerInfo: {
            name: data.lead.customerName,
            phone: data.lead.phone,
            email: data.lead.email,
            address: data.lead.address,
            city: data.lead.city,
            state: data.lead.state
        },
        loanDetails: {
            productType: data.lead.productType,
            loanAmount: data.lead.loanAmount,
            monthlyIncome: data.lead.monthlyIncome,
            employmentType: data.lead.employmentType,
            creditScore: data.lead.creditScore
        },
        leadStatus: {
            status: data.lead.status,
            priority: data.lead.priority,
            source: data.lead.source,
            assignedTo: data.lead.assignedToName,
            createdAt: data.lead.createdAt,
            updatedAt: data.lead.updatedAt,
            notes: data.lead.notes
        }
    };

    // Add lead information as JSON
    zip.file('lead_information.json', JSON.stringify(leadInfo, null, 2));

    // Create documents folder
    const documentsFolder = zip.folder('documents');
    if (documentsFolder) {
        data.documents.forEach((doc, index) => {
            // Create a mock file content for demonstration
            const fileContent = `Document: ${doc.name}\nType: ${doc.type}\nStatus: ${doc.status}\nUploaded by: ${doc.uploadedByName}\nUploaded at: ${doc.uploadedAt}\nSize: ${doc.size} bytes`;
            documentsFolder.file(`${index + 1}_${doc.name}`, fileContent);
        });
    }

    // Create comments file
    const commentsData = data.comments.map(comment => ({
        author: comment.userName,
        role: comment.userRole,
        content: comment.content,
        timestamp: comment.createdAt,
        isInternal: comment.isInternal
    }));
    zip.file('comments.json', JSON.stringify(commentsData, null, 2));

    // Create call logs file
    const callLogsData = data.callLogs.map(call => ({
        calledBy: call.calledByName,
        duration: `${Math.floor(call.duration / 60)}:${(call.duration % 60).toString().padStart(2, '0')}`,
        type: call.callType,
        status: call.status,
        notes: call.notes,
        timestamp: call.createdAt,
        hasRecording: call.hasRecording
    }));
    zip.file('call_logs.json', JSON.stringify(callLogsData, null, 2));

    // Create summary file
    const summary = {
        leadId: data.lead.id,
        customerName: data.lead.customerName,
        totalDocuments: data.documents.length,
        verifiedDocuments: data.documents.filter(d => d.status === 'Verified').length,
        totalComments: data.comments.length,
        totalCalls: data.callLogs.length,
        completedCalls: data.callLogs.filter(c => c.status === 'Completed').length,
        packageGeneratedAt: new Date().toISOString()
    };
    zip.file('package_summary.json', JSON.stringify(summary, null, 2));

    // Generate and download the zip file
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `lead_${data.lead.id}_${data.lead.customerName.replace(/\s+/g, '_')}_package.zip`);
};

export const canDownloadZip = (lead: Lead, userRole: string): boolean => {
    if (userRole === 'admin') return true;
    if (lead.status !== 'Done' || !lead.isVerified) return false;
    return (lead.downloadCount || 0) < (lead.maxDownloads || 3);
};

export const getDownloadStatus = (lead: Lead): string => {
    if (lead.status !== 'Done' || !lead.isVerified) {
        return 'Lead must be completed and verified';
    }
    const remaining = (lead.maxDownloads || 3) - (lead.downloadCount || 0);
    return `${remaining} downloads remaining`;
};