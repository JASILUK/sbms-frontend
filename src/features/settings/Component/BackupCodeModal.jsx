// features/settings/security/components/BackupCodesModal.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Download, AlertTriangle, CheckCircle2, Shield, Printer } from "lucide-react";

export default function BackupCodesModal({ isOpen, codes, onClose }) {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(codes.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = `BACKUP RECOVERY CODES
Generated: ${new Date().toLocaleString()}
 
These codes can be used to access your account if you lose your MFA device.
Each code can only be used once.

${codes.map((code, i) => `${String(i + 1).padStart(2, '0')}. ${code}`).join('\n')}

IMPORTANT:
- Store these codes in a secure location (password manager)
- Each code can only be used once
- Generate new codes if you've used most of them
- Never share these codes with anyone
`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup-codes-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Backup Codes</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }
            h1 { color: #111; border-bottom: 2px solid #f59e0b; padding-bottom: 10px; }
            .warning { background: #fffbeb; border: 1px solid #f59e0b; padding: 16px; border-radius: 8px; margin: 20px 0; color: #92400e; }
            .codes { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 24px 0; }
            .code { font-family: monospace; font-size: 18px; padding: 16px; background: #f3f4f6; border-radius: 8px; text-align: center; font-weight: 500; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <h1>🔐 Backup Recovery Codes</h1>
          <p>Generated: ${new Date().toLocaleString()}</p>
          <div class="warning">
            <strong>Important:</strong> Each code can only be used once. Store these in a secure location.
          </div>
          <div class="codes">
            ${codes.map(code => `<div class="code">${code}</div>`).join('')}
          </div>
          <div class="footer">
            Keep these codes safe. If you lose them and your MFA device, you may lose access to your account.
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
              className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-lg">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Backup Recovery Codes</h2>
                      <p className="text-sm text-gray-600 mt-1">Keep these codes safe and secure</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                {/* Warning Banner */}
                <div className="flex items-start gap-4 p-4 sm:p-5 bg-amber-50 border border-amber-200 rounded-xl mb-6 sm:mb-8">
                  <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900 mb-1">
                      Important Security Notice
                    </p>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      Each code can only be used <strong>once</strong>. Save these codes in a secure location 
                      like a password manager. You won't be able to see them again after closing this modal.
                    </p>
                  </div>
                </div>

                {/* Codes Grid - Larger, More Visible */}
                <div className="mb-6 sm:mb-8">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Your {codes.length} backup codes:
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {codes.map((code, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="relative flex items-center justify-center p-4 sm:p-5 bg-gray-50 border-2 border-gray-200 rounded-xl font-mono text-base sm:text-lg text-gray-800 tracking-wider hover:border-amber-300 hover:bg-amber-50/30 transition-all"
                      >
                        <span className="absolute left-3 top-2 text-xs text-gray-400 font-sans">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        {code}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={handleCopy}
                    className={`
                      flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200
                      ${copied 
                        ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-200" 
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-2 border-transparent"
                      }
                    `}
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="hidden sm:inline">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        <span className="hidden sm:inline">Copy</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleDownload}
                    className={`
                      flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200
                      ${downloaded 
                        ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-200" 
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-2 border-transparent"
                      }
                    `}
                  >
                    {downloaded ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="hidden sm:inline">Saved!</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span className="hidden sm:inline">Download</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handlePrint}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200"
                  >
                    <Printer className="w-5 h-5" />
                    <span className="hidden sm:inline">Print</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl transition-all duration-200"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="hidden sm:inline">Done</span>
                  </button>
                </div>
              </div>

              {/* Footer Note */}
              <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-100 flex-shrink-0">
                <p className="text-xs text-gray-500 text-center">
                  Generate new codes immediately if you suspect these have been compromised.
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}