import { useState } from "react";
import { useBulkInviteCSVMutation } from "../emplyeeApi";

export default function CSVUploadModal({ close }) {

  const [uploadCSV] = useBulkInviteCSVMutation();

  const [file, setFile] = useState(null);

  const handleUpload = async () => {

    const formData = new FormData();

    formData.append("file", file);

    await uploadCSV(formData);

    close();
  };

  return (

    <div>

      <h3>Upload CSV</h3>

      <input
        type="file"
        onChange={(e)=>setFile(e.target.files[0])}
      />

      <button onClick={handleUpload}>
        Upload
      </button>

    </div>
  );
}