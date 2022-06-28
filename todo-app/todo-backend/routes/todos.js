const express = require('express');
const { Todo } = require('../mongo')
const redis = require('../redis')
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  let added_todos = parseInt(await redis.getAsync('added_todos'), 10) + 1 || 1
  redis.setAsync('added_todos', added_todos)
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200)
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.json(req.todo) // Implement this
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  if (req.body.hasOwnProperty('text')) {
    req.todo.text = req.body.text
  }
  if (req.body.hasOwnProperty('done')) {
    req.todo.done = req.body.done
  }
  const modified = await req.todo.save()
  res.json(modified) // Implement this
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
