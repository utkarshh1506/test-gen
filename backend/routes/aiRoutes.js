const express = require('express');
const router = express.Router();
const { generateSummaries, generateTestCode, createPR } = require('../controllers/aiController');

router.post('/generate-summaries', generateSummaries);
router.post('/generate-test-code', generateTestCode);
router.post('/create-pr', createPR)


module.exports = router;
