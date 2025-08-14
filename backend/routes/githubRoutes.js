const express = require('express');
const router = express.Router();
const {
  getUserRepos,
  getRepoFiles,
  listFiles,
  listFilestwo,
} = require('../controllers/githubController');

router.get('/repos', getUserRepos);
router.get('/repos/:owner/:repo/files', getRepoFiles);
router.get('/list-files', listFiles)
router.post('/list-files', listFilestwo)

module.exports = router;
