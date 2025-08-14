const axios = require("axios");
const { Octokit } = require("@octokit/rest");

const generateSummaries = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { owner, repo, filePaths } = req.body;

  if (!token || !owner || !repo || !filePaths?.length) {
    return res.status(400).json({ error: "Missing required inputs" });
  }

  try {
    let combinedContent = "";

    for (const path of filePaths) {
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
      const fileRes = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const content = Buffer.from(fileRes.data.content, "base64").toString();
      combinedContent += `\n\n// File: ${path}\n` + content;
    }

    const prompt = `
You're a test case generation assistant.
Given the following code files, generate a high-level summary of test cases that could be written.

Respond in JSON array format. Each item should be:
{
  "file": "<file_path>",
  "summary": "<what to test>"
}

${combinedContent}
`;

    const aiRes = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    const text = aiRes.data.candidates[0].content.parts[0].text;

    // Strip markdown
    const cleanText = text.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleanText); // ✅ Convert to JS object
    } catch (e) {
      return res
        .status(500)
        .json({ error: "Failed to parse AI response", raw: cleanText });
    }

    res.json({ summaries: parsed }); // ✅ Send JSON object (not string)
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to generate summaries", details: err.message });
  }
};
const generateTestCode = async (req, res) => {
  const { summary } = req.body;
  if (!summary) return res.status(400).json({ error: "Missing summary" });

  try {
    const prompt = `
You're a test case generator. Given the following summary, generate detailed test code:
"${summary}"

Respond with only code. No explanation.
`;

    const aiRes = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    const code = aiRes.data.candidates[0].content.parts[0].text;
    res.json({ code }); // ✅ return code in "code" key
  } catch (err) {
    res
      .status(500)
      .json({ error: "Code generation failed", details: err.message });
  }
};

const createPR = async (req, res) => {
  const { owner, repo, files } = req.body;
  const token = req.headers.authorization?.split(" ")[1];
  console.log(owner, repo, files, token);
  if (!owner || !repo || !files || files.length === 0) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const octokit = new Octokit({ auth: token });

    const branch = `ai-test-${Date.now()}`;
    const baseBranch = "master"; // or 'master'

    // Step 1: Get latest commit SHA of main
    const { data: refData } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${baseBranch}`,
    });

    const latestCommitSha = refData.object.sha;

    // Step 2: Create a new branch
    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branch}`,
      sha: latestCommitSha,
    });

    // Step 3: Create blobs and tree
    const blobs = await Promise.all(
      files.map(async (file) => {
        const blob = await octokit.rest.git.createBlob({
          owner,
          repo,
          content: file.content,
          encoding: "utf-8",
        });
        return {
          path: file.path,
          mode: "100644",
          type: "blob",
          sha: blob.data.sha,
        };
      })
    );

    const { data: baseTree } = await octokit.rest.git.getCommit({
      owner,
      repo,
      commit_sha: latestCommitSha,
    });

    const { data: newTree } = await octokit.rest.git.createTree({
      owner,
      repo,
      base_tree: baseTree.tree.sha,
      tree: blobs,
    });

    // Step 4: Create a commit
    const commitMessage = "Add AI-generated test cases";
    const { data: newCommit } = await octokit.rest.git.createCommit({
      owner,
      repo,
      message: commitMessage,
      tree: newTree.sha,
      parents: [latestCommitSha],
    });

    // Step 5: Update ref to point to new commit
    await octokit.rest.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: newCommit.sha,
    });

    // Step 6: Create a PR
    const { data: pr } = await octokit.rest.pulls.create({
      owner,
      repo,
      title: commitMessage,
      head: branch,
      base: baseBranch,
      body: "This PR contains AI-generated test files.",
    });

    res.json({ pr_url: pr.html_url });
  } catch (err) {
    console.error("❌ PR creation error:", err);
    res
      .status(500)
      .json({ error: "Failed to create PR", details: err.message });
  }
};

module.exports = { generateSummaries, generateTestCode, createPR };
