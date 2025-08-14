import React, { useState } from "react";
import FileSelector from "./FileSelector";
import SummarySelector from "./SummarySelector";
import PRForm from "./PRForm";

const TestFlow = () => {
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedSummary, setSelectedSummary] = useState("");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <FileSelector onSelect={setSelectedFile} />
      {selectedFile && (
        <SummarySelector filePath={selectedFile} onSummarySelect={setSelectedSummary} />
      )}
      {selectedSummary && (
        <PRForm filePath={selectedFile} summary={selectedSummary} />
      )}
    </div>
  );
};

export default TestFlow;
