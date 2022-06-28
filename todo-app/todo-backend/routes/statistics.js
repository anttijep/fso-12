
const express = require('express');
const router = express.Router();
const redis = require('../redis')

router.get('/', async (req, res) => {
  const added_todos = parseInt(await redis.getAsync('added_todos')) || 0
  res.json({added_todos})
})

module.exports = router