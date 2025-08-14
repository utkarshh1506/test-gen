import React, { useState } from "react";
import axios from "axios";

const ListFiles = () => {
  const owner = localStorage.getItem("github_username");
  const token = localStorage.getItem("github_token");

  const [repo, setRepo] = useState("");
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [generatedTests, setGeneratedTests] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingCode, setLoadingCode] = useState(false);

  const fetchFiles = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/list-files`,
        {
          params: { owner, repo },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFiles(res.data.files);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch files");
    }
  };

  const handleCheckboxChange = (filePath) => {
    setSelectedFiles((prev) =>
      prev.includes(filePath)
        ? prev.filter((path) => path !== filePath)
        : [...prev, filePath]
    );
  };

  const generateTestCases = async () => {
    const summary = prompt("Enter a summary for the test cases:");
    if (!summary || selectedFiles.length === 0) {
      alert("Please enter a summary and select at least one file.");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/generate-test-code`,
        {
          summary,
          files: selectedFiles,
          framework: "jest",
        }
      );

      const { results } = res.data;

      results.forEach(({ file, code, error }) => {
        if (error) {
          console.error(`❌ Failed to generate for ${file}: ${error}`);
        } else {
          console.log(`✅ Test code for ${file}:\n${code}`);
        }
      });

      setGeneratedTests(results);
    } catch (err) {
      console.error(
        "❌ Failed to generate test cases:",
        err.response?.data || err.message
      );
      alert("Error generating test cases.");
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => alert("Code copied to clipboard!"))
      .catch((err) => alert("Failed to copy code", err));
  };

  const createPR = async () => {
    try {
      console.log("Hitting");

      const filesToUpload = generatedTests
        .filter((t) => !t.error)
        .map((t) => ({
          path: `${t.file.replace(/\.js$/, "")}.txt`, // convert filename to .txt
          content: t.code
            .trim()
            .replace(/^```(?:\w+)?\n/, "") // remove opening triple backticks
            .replace(/```$/, ""), // remove closing triple backticks
        }));
      console.log(filesToUpload);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/create-pr`,
        {
          owner,
          repo,
          files: filesToUpload,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.pr_url) {
        window.open(res.data.pr_url, "_blank");
      } else {
        alert("Pull request creation failed");
      }
    } catch (err) {
      console.error(
        "❌ PR creation failed:",
        err.response?.data || err.message
      );
      alert("Failed to create PR");
    }
  };

  const generateSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/generate-summaries`,
        {
          owner,
          repo,
          filePaths: selectedFiles,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSummaries(res.data.summaries);
    } catch (err) {
      console.error(
        "❌ Summary generation failed:",
        err.response?.data || err.message
      );
      alert("Failed to generate summaries");
    } finally {
      setLoadingSummary(false);
    }
  };

  const generateCodeFromSummary = async () => {
    if (!selectedSummary) return;
    setLoadingCode(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/generate-test-code`,
        {
          summary: selectedSummary.summary,
          files: [selectedSummary.file],
          framework: "jest",
        }
      );

      const code = res.data.code;
      console.log("🔁 Code:", code);

      // Show in preview
      setGeneratedCode(code);

      // Wrap in results format for createPR
      const result = [{
      file: selectedSummary.file,
      code,
      error: null,
    }];

      setGeneratedTests(result);
    } catch (err) {
      console.error(
        "❌ Code generation failed:",
        err.response?.data || err.message
      );
      alert("Failed to generate test code");
    } finally {
      setLoadingCode(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        List Files in GitHub Repo
      </h2>

      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          value={owner}
          disabled
          className="border border-gray-300 px-4 py-2 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
        />
        <input
          type="text"
          placeholder="Repo"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchFiles}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded transition"
        >
          Fetch Files
        </button>
      </div>

      <div className="border rounded p-4 max-h-80 overflow-y-auto bg-gray-50 mb-6">
        {files.length === 0 ? (
          <p className="text-gray-500 italic">No files to display</p>
        ) : (
          files.map((file, i) => (
            <div key={i} className="flex items-center space-x-2 py-1">
              <input
                type="checkbox"
                onChange={() => handleCheckboxChange(file.path)}
              />
              <span className="text-gray-800">{file.path}</span>
            </div>
          ))
        )}
      </div>

      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={generateTestCases}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded transition"
          >
            Generate Test Case (Manual)
          </button>
          <button
            onClick={generateSummary}
            className={`${
              loadingSummary
                ? "bg-yellow-400"
                : "bg-yellow-500 hover:bg-yellow-600"
            } text-white px-5 py-2 rounded transition`}
            disabled={loadingSummary}
          >
            {loadingSummary ? "Generating Summary..." : "Generate Summary"}
          </button>
        </div>
      )}

      {summaries.length > 0 && (
        <div className="mt-8 p-6 border bg-gray-100 rounded shadow-inner">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            AI-Generated Summaries
          </h2>
          <ul className="space-y-3">
            {summaries.map((s, idx) => (
              <li
                key={idx}
                className="p-3 border rounded bg-white hover:shadow-sm transition"
              >
                <label className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="summary"
                    onChange={() => setSelectedSummary(s)}
                  />
                  <span className="text-gray-700">
                    <strong>{s.file}</strong>: {s.summary}
                  </span>
                </label>
              </li>
            ))}
          </ul>

          <button
            onClick={generateCodeFromSummary}
            className="mt-6 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
            disabled={!selectedSummary || loadingCode}
          >
            {loadingCode ? "Generating Code..." : "Generate Test Code"}
          </button>
        </div>
      )}

      {generatedTests.map(({ file, code, error }) => (
        <div key={file} className="mt-8">
          <h3 className="font-semibold text-lg text-gray-800">{file}</h3>
          {error ? (
            <p className="text-red-600 mt-2">❌ {error}</p>
          ) : (
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto whitespace-pre-wrap mt-2 text-sm">
              {code}
            </pre>
          )}
          <button
            onClick={() => copyToClipboard(code)}
            className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm transition"
          >
            Copy to Clipboard
          </button>
        </div>
      ))}

      {generatedTests.length > 0 && (
        <div className="mt-6">
          <button
            onClick={createPR}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded transition"
          >
            Create Pull Request
          </button>
        </div>
      )}
    </div>
  );
};

export default ListFiles;
