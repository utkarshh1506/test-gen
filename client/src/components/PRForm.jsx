import React, { useEffect, useState } from "react";
import axios from "axios";

const PRForm = ({ filePath, summary }) => {
  const [code, setCode] = useState("");
  const [branch, setBranch] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [prUrl, setPrUrl] = useState("");

  useEffect(() => {
    if (!summary || !filePath) return;

    const generateCode = async () => {
      try {
        const res = await axios.post("/api/generate-test-code", {
          filePath,
          summary,
        });
        setCode(res.data.code || "");
      } catch (err) {
        console.error("Error generating test code:", err);
      }
    };

    generateCode();
  }, [summary, filePath]);

  const handleCreatePR = async () => {
    try {
      const response = await axios.post(
        "/api/create-pr",
        {
          owner: "utkarshh1506",
          repo: "Test-Repo",
          branch,
          filePath: `__tests__/${filePath}.test.js`,
          code,
          commitMessage,
        },
        {
          headers: {
            Authorization: `Bearer <your_github_token_here>`,
          },
        }
      );

      setPrUrl(response.data.prUrl);
    } catch (err) {
      console.error("Error creating PR:", err);
    }
  };

  return (
    <div className="p-4">
      {code && (
        <>
          <h2 className="text-lg font-bold mb-2">Generated Code</h2>
          <pre className="bg-gray-100 p-4 rounded max-h-64 overflow-auto">{code}</pre>

          <div className="mt-4 space-y-2">
            <input
              className="border p-2 w-full"
              placeholder="Branch name (e.g., test-add-user)"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            />
            <input
              className="border p-2 w-full"
              placeholder="Commit message"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
            />

            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleCreatePR}
            >
              Create PR
            </button>

            {prUrl && (
              <p className="text-green-600 mt-2">
                ✅ PR Created: <a href={prUrl} target="_blank" rel="noreferrer">{prUrl}</a>
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PRForm;
