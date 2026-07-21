import { useCallback, useState } from "react";
import { useExportAttendanceReportMutation } from "../../api/hrAttendance/attendanceReportApi";

export function useAttendanceReportExport() {
  const [triggerExport, { isLoading: isExporting }] = useExportAttendanceReportMutation();
  const [exportError, setExportError] = useState(null);

  const exportReport = useCallback(
    async (params) => {
      setExportError(null);
      try {
        const result = await triggerExport(params).unwrap();
        
        const downloadUrl = window.URL.createObjectURL(result.blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = result.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        
        if (typeof window !== "undefined" && window.__toast) {
          window.__toast.success(`Report downloaded: ${result.filename}`);
        }
      } catch (err) {
        setExportError(err);
        if (typeof window !== "undefined" && window.__toast) {
          window.__toast.error(err.message || "Failed to export report.");
        }
        throw err;
      }
    },
    [triggerExport]
  );

  return { exportReport, isExporting, exportError };
}