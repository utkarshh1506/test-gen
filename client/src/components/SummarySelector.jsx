import React, { useState } from "react";
import axios from "axios";

const SummarySelector = ({ summaries, owner, repo, filePaths, token }) => {
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!selectedSummary) return;
    setLoading(true);
    try {
      const res = await axios.post(
        "/api/generate-test-code",
        { owner, repo, summary: selectedSummary, filePaths },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGeneratedCode(res.data.code); // Assuming backend returns `{ code: "..." }`
    } catch (err) {
      alert("Failed to generate test code", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Test Case Summaries</h2>
      <ul className="space-y-2">
        {JSON.parse(summaries).map((item, index) => (
          <li key={index} className="border p-2 rounded bg-gray-50">
            <input
              type="radio"
              name="summary"
              value={item.summary}
              onChange={() => setSelectedSummary(item.summary)}
              className="mr-2"
            />
            <strong>{item.file}</strong>: {item.summary}
          </li>
        ))}
      </ul>

      <button
        onClick={handleGenerate}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        disabled={!selectedSummary || loading}
      >
        {loading ? "Generating..." : "Generate Code"}
      </button>

      {generatedCode && (
        <div className="mt-4 p-3 border bg-gray-100 rounded">
          <h3 className="font-semibold">Generated Test Code</h3>
          <pre className="mt-2 whitespace-pre-wrap text-sm">{generatedCode}</pre>
        </div>
      )}
    </div>
  );
};

export default SummarySelector;
