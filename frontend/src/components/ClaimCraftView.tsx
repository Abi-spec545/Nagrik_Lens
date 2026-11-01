import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Download,
  AlertCircle,
  FileText,
  ShieldCheck,
  Check,
  RefreshCw,
} from 'lucide-react';
import {
  fetchChecklist,
  verifyDocument,
  downloadChecklistPdf,
  fetchSchemes,
} from '../api/client';
import {
  ChecklistResponse,
  DocumentVerifyResponse,
  SchemeListItem,
} from '../types/api';

interface ClaimCraftViewProps {
  initialSchemeId?: string;
}

export const ClaimCraftView: React.FC<ClaimCraftViewProps> = ({ initialSchemeId }) => {
  const [activeTab, setActiveTab] = useState<'verify' | 'checklist'>('verify');

  // Verification state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifyResult, setVerifyResult] = useState<DocumentVerifyResponse | null>(null);
  const [humanConfirmed, setHumanConfirmed] = useState(false);
  const [correctionSaved, setCorrectionSaved] = useState(false);

  // Checklist state
  const [schemes, setSchemes] = useState<SchemeListItem[]>([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(initialSchemeId || 'PM-SVANIDHI-01');
  const [context, setContext] = useState<Record<string, boolean>>({
    has_aadhaar: true,
    has_bank_account: true,
    vendor_id_card: false,
    has_land_documents: false,
    has_business_proof: false,
  });
  const [checklist, setChecklist] = useState<ChecklistResponse | null>(null);
  const [loadingChecklist, setLoadingChecklist] = useState(false);
  const [checklistError, setChecklistError] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    // Load available schemes for checklist selector
    fetchSchemes()
      .then((data) => {
        setSchemes(data);
        if (initialSchemeId && data.some((s) => s.scheme_id === initialSchemeId)) {
          setSelectedSchemeId(initialSchemeId);
        }
      })
      .catch(() => {});
  }, [initialSchemeId]);

  useEffect(() => {
    loadChecklist();
  }, [selectedSchemeId, context]);

  const loadChecklist = async () => {
    if (!selectedSchemeId) return;
    setLoadingChecklist(true);
    setChecklistError(null);
    try {
      const data = await fetchChecklist(selectedSchemeId, context);
      setChecklist(data);
    } catch (err: any) {
      setChecklistError(err.message || 'Failed to load checklist');
    } finally {
      setLoadingChecklist(false);
    }
  };

  const handleFileUpload = async (fileToUpload?: File) => {
    const file = fileToUpload || selectedFile;
    if (!file) return;
    setUploading(true);
    setVerifyError(null);
    setVerifyResult(null);
    setHumanConfirmed(false);
    setCorrectionSaved(false);

    try {
      const res = await verifyDocument(file);
      setVerifyResult(res);
    } catch (err: any) {
      setVerifyError(err.message || 'Document verification failed');
    } finally {
      setUploading(false);
    }
  };

  const handleLoadDemoText = () => {
    const sampleText =
      'GOVERNMENT OF INDIA • UNIQUE IDENTIFICATION AUTHORITY\n' +
      'Name: Rajesh Kumar Sharma\n' +
      'DOB: 15/08/1985\n' +
      'Gender: Male\n' +
      'Aadhaar: 2345 6789 0123\n' +
      'PAN: ABCDE1234F\n' +
      'Address: Flat 402, Green Meadows, Ward 14, Bengaluru\n' +
      'PIN: 560001\n';

    const blob = new Blob([sampleText], { type: 'text/plain' });
    const file = new File([blob], 'demo_aadhaar_card.txt', { type: 'text/plain' });
    setSelectedFile(file);
    handleFileUpload(file);
  };

  const handleDownloadPdf = async () => {
    if (!checklist) return;
    setDownloadingPdf(true);
    try {
      const blob = await downloadChecklistPdf(checklist.scheme_id, context);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NagrikLens_Checklist_${checklist.scheme_id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      alert(`Download failed: ${err.message}`);
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">ClaimCraft Entitlement Verification</h1>
              <p className="text-xs text-slate-500">
                In-memory document text extraction via PyMuPDF, discrepancy checks, and ReportLab PDF reporting
              </p>
            </div>
          </div>

          {/* Sub-tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('verify')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'verify' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Document Extraction & Review
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'checklist' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Entitlement Checklist & PDF
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Document Upload & Verification */}
      {activeTab === 'verify' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Upload Area (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Upload Identity Proof Document</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload Aadhaar, PAN or municipal credentials (.txt or .pdf). Files are parsed in-memory and never stored.
              </p>
            </div>

            {/* Quick Demo Loader */}
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200/80">
              <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block mb-1">
                Fast Hackathon Demo:
              </span>
              <p className="text-xs text-blue-700 mb-2">
                Don't have a file ready? Click below to load an authentic sample Aadhaar & PAN credential text.
              </p>
              <button
                type="button"
                onClick={handleLoadDemoText}
                className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Load Demo Credential (Sample TXT)</span>
              </button>
            </div>

            {/* Drag & Drop Upload Input */}
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-slate-400 transition-colors">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-700 mb-1">
                Choose a document from your computer
              </p>
              <p className="text-[11px] text-slate-400 mb-4">Supported formats: Plain Text (.txt), PDF (.pdf)</p>

              <label className="inline-block px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors">
                <span>Browse Local Files</span>
                <input
                  type="file"
                  accept=".txt,.pdf,text/plain,application/pdf"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
              </label>

              {selectedFile && (
                <div className="mt-3 text-xs text-slate-700 font-medium bg-slate-50 p-2 rounded-lg border border-slate-200">
                  Selected: <span className="font-bold text-slate-900">{selectedFile.name}</span> ({(selectedFile.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>

            <button
              onClick={() => handleFileUpload()}
              disabled={!selectedFile || uploading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 shadow-sm"
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Extracting Credentials with PyMuPDF...</span>
                </>
              ) : (
                <>
                  <FileCheck2 className="w-4 h-4" />
                  <span>Verify Document Now</span>
                </>
              )}
            </button>
          </div>

          {/* Results & Human Confirmation Area (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {verifyError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Extraction Error: </span>
                  <span>{verifyError}</span>
                </div>
              </div>
            )}

            {!verifyResult && !uploading && (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="text-base font-bold text-slate-800 mb-1">Awaiting Document</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Upload a document or click "Load Demo Credential" to preview extracted fields, review discrepancy
                  diagnostics, and confirm corrections.
                </p>
              </div>
            )}

            {verifyResult && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Extracted Credential Preview</h3>
                    <p className="text-xs text-slate-500 font-mono">Source: {verifyResult.filename}</p>
                  </div>

                  {verifyResult.needs_human_review ? (
                    <span className="inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                      <span>Human Review Required</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>High Confidence Extraction</span>
                    </span>
                  )}
                </div>

                {/* Review Reasons if flagged */}
                {verifyResult.needs_human_review && verifyResult.review_reasons.length > 0 && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                    <span className="text-xs font-bold text-amber-900 block">Flagged Reasons:</span>
                    {verifyResult.review_reasons.map((reason, idx) => (
                      <p key={idx} className="text-xs text-amber-800 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>{reason}</span>
                      </p>
                    ))}
                  </div>
                )}

                {/* Fields Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Field Name</th>
                        <th className="py-2.5 px-3">Extracted Value</th>
                        <th className="py-2.5 px-3">Confidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {verifyResult.extracted_fields.map((f, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 font-semibold text-slate-700 capitalize">
                            {f.field_name.replace(/_/g, ' ')}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-medium text-slate-900">{f.value}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                f.confidence === 'high'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : f.confidence === 'medium'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {f.confidence}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Discrepancies Diagnostic Section */}
                {verifyResult.discrepancies.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Discrepancies Detected ({verifyResult.discrepancies.length})
                    </h4>
                    {verifyResult.discrepancies.map((disc, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-xs space-y-1 ${
                          disc.severity === 'critical'
                            ? 'bg-rose-50 border-rose-200 text-rose-900'
                            : 'bg-amber-50 border-amber-200 text-amber-900'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="capitalize">{disc.field.replace(/_/g, ' ')}</span>
                          <span className="uppercase text-[10px] px-1.5 py-0.5 rounded bg-white/70">
                            {disc.severity}
                          </span>
                        </div>
                        <p className="text-[11px]">{disc.recommendation}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Human Confirmation Checklist Requirement */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-start space-x-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Mandatory Human Oversight Check
                      </span>
                      <p className="text-xs text-slate-600">
                        In accordance with civic governance standards, automated extractions must be visually
                        verified by a human before accepting corrections into a citizen entitlement profile.
                      </p>
                    </div>
                  </div>

                  <label className="flex items-center space-x-2.5 cursor-pointer pt-2 border-t border-slate-200">
                    <input
                      type="checkbox"
                      checked={humanConfirmed}
                      onChange={(e) => setHumanConfirmed(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-bold text-slate-800">
                      I confirm I have visually verified these extracted credentials against the physical document.
                    </span>
                  </label>

                  <button
                    onClick={() => setCorrectionSaved(true)}
                    disabled={!humanConfirmed}
                    className="w-full inline-flex items-center justify-center space-x-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors disabled:opacity-40"
                  >
                    <Check className="w-4 h-4" />
                    <span>{correctionSaved ? 'Credentials Confirmed & Verified!' : 'Confirm & Accept Verified Details'}</span>
                  </button>

                  {correctionSaved && (
                    <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg text-center">
                      ✓ Credentials accepted with human verification signature.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Entitlement Checklist & PDF Export */}
      {activeTab === 'checklist' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls on Left (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Configure Entitlement Scheme</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select your target welfare scheme and toggle your currently available documents to measure claim readiness.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Welfare Scheme</label>
              <select
                value={selectedSchemeId}
                onChange={(e) => setSelectedSchemeId(e.target.value)}
                className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {schemes.map((s) => (
                  <option key={s.scheme_id} value={s.scheme_id}>
                    {s.title} ({s.scheme_id})
                  </option>
                ))}
              </select>
            </div>

            {/* Document Context Checkboxes */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Citizen Document Availability:
              </span>

              <label className="flex items-center space-x-2.5 cursor-pointer p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors">
                <input
                  type="checkbox"
                  checked={context.has_aadhaar}
                  onChange={(e) => setContext({ ...context, has_aadhaar: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-700 font-medium">Aadhaar Card (UIDAI)</span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors">
                <input
                  type="checkbox"
                  checked={context.has_bank_account}
                  onChange={(e) => setContext({ ...context, has_bank_account: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-700 font-medium">Active Bank Account Passbook</span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors">
                <input
                  type="checkbox"
                  checked={context.vendor_id_card}
                  onChange={(e) => setContext({ ...context, vendor_id_card: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-700 font-medium">Certificate of Vending / Vendor ID (ULB)</span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors">
                <input
                  type="checkbox"
                  checked={context.has_land_documents}
                  onChange={(e) => setContext({ ...context, has_land_documents: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-700 font-medium">Land Records / Khasra-Khatauni</span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors">
                <input
                  type="checkbox"
                  checked={context.has_business_proof}
                  onChange={(e) => setContext({ ...context, has_business_proof: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-700 font-medium">Business Activity / Registration Proof</span>
              </label>
            </div>
          </div>

          {/* Checklist Display & PDF on Right (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {checklistError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs">
                {checklistError}
              </div>
            )}

            {loadingChecklist && !checklist && (
              <div className="p-8 text-center text-xs text-slate-500">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-400" />
                <span>Loading Scheme Document Checklist...</span>
              </div>
            )}

            {checklist && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="font-mono text-[10px] text-emerald-700 font-semibold uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {checklist.scheme_id}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{checklist.scheme_title}</h3>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-500 block">Readiness Gauge</span>
                    <span
                      className={`text-xl font-extrabold ${
                        checklist.readiness_percentage === 100
                          ? 'text-emerald-600'
                          : checklist.readiness_percentage >= 50
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {checklist.readiness_percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      checklist.readiness_percentage === 100
                        ? 'bg-emerald-500'
                        : checklist.readiness_percentage >= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${checklist.readiness_percentage}%` }}
                  />
                </div>

                {/* Documents List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Required Documentation ({checklist.required_documents.length})
                  </h4>

                  <div className="space-y-2">
                    {checklist.required_documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900">{doc.name}</span>
                            {doc.mandatory && (
                              <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                                Mandatory
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 block mt-0.5">Category: {doc.document_type}</span>
                          {doc.issuing_authority && (
                            <span className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block mt-1 font-medium">
                              Issuing Authority: {doc.issuing_authority}
                            </span>
                          )}
                        </div>

                        <div>
                          {doc.status === 'ready' ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Ready</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200">
                              <AlertCircle className="w-3 h-3 text-amber-600" />
                              <span>Action Required</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ReportLab PDF Export Button */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-[11px] text-slate-500">
                    Generated via backend ReportLab engine with official readiness stamp.
                  </p>

                  <button
                    onClick={handleDownloadPdf}
                    disabled={downloadingPdf}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50"
                  >
                    {downloadingPdf ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Generating PDF...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Download Checklist PDF (ReportLab)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
