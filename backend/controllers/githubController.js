const axios = require("axios");

// Fetch all user repos
const getUserRepos = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing access token" });

  try {
    const response = await axios.get("https://api.github.com/user/repos", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const repos = response.data.map((repo) => ({
      name: repo.name,
      full_name: repo.full_name,
      private: repo.private,
      owner: repo.owner.login,
    }));

    res.json(repos);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch repos", details: err.message });
  }
};

// Recursively fetch all files in a repo
const getRepoFiles = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { owner, repo } = req.params;

  if (!token) return res.status(401).json({ error: "Missing access token" });

  try {
    const files = [];

    async function fetchFiles(path = "") {
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      for (const item of response.data) {
        if (item.type === "file") {
          files.push({ name: item.name, path: item.path });
        } else if (item.type === "dir") {
          await fetchFiles(item.path);
        }
      }
    }

    await fetchFiles();
    res.json(files);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch repo files", details: err.message });
  }
};

const listFiles = async (req, res) => {
  const { owner, repo } = req.query;
  const authHeader = req.headers.authorization;

  if (!owner || !repo || !authHeader) {
    return res
      .status(400)
      .json({ error: "Missing owner, repo, or Authorization token" });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>

  try {
    const api = axios.create({
      baseURL: "https://api.github.com",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `token ${token}`, // 👈 AUTH HERE
      },
    });

    // Get default branch
    const repoRes = await api.get(`/repos/${owner}/${repo}`);
    const branch = repoRes.data.default_branch;

    // Get all files recursively
    const treeRes = await api.get(
      `/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
    );

    const allFiles = treeRes.data.tree;

    // Filter code files
    const codeExtensions = [
      ".js",
      ".ts",
      ".py",
      ".java",
      ".cpp",
      ".c",
      ".go",
      ".txt",
    ];
    const codeFiles = allFiles
      .filter(
        (item) =>
          item.type === "blob" &&
          codeExtensions.some((ext) => item.path.endsWith(ext))
      )
      .map((file) => ({
        path: file.path,
        url: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${file.path}`,
      }));

    res.json({ files: codeFiles });
  } catch (err) {
    console.error("❌ List Files Error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Failed to fetch file list",
      details: err.response?.data || err.message,
    });
  }
};

const listFilestwo = async (req, res) => {
  const { owner, repo, branch } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    const files = response.data.tree.filter((item) => item.type === "blob");
    res.json({ files });
  } catch (err) {
    res.status(500).json({ error: "GitHub fetch failed", detail: err.message });
  }
};

module.exports = {
  getUserRepos,
  getRepoFiles,
  listFiles,
  listFilestwo,
};
