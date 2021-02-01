const contactRouter = require('express').Router()
const contactManager = require('./contact_manager');
const helpers = require('./helpers');

contactRouter.get('/:id', (req, res) => {
  let contact = contactManager.get(req.params['id']);
  if (contact) {
    res.json(contact);
  } else {
    res.status(404).end();
  }
});

contactRouter.get('/', (req, res) => {
  res.json(contactManager.getAll());
});

contactRouter.post('/', (req, res) => {
  let contactAttrs = helpers.extractContactAttrs(req.body);
  let contact = contactManager.add(contactAttrs);
  if (contact) {
    res.status(201).json(contact);
  } else {
    res.status(400).end();
  }
});

contactRouter.put('/:id', (req, res) => {
  let contactAttrs = helpers.extractContactAttrs(req.body);
  let contact = contactManager.update(req.params['id'], contactAttrs);
  if (contact) {
    res.status(201).json(contact);
  } else {
    res.status(400).end();
  }
});

contactRouter.delete('/:id', (req, res) => {
  if (contactManager.remove(req.params['id'])) {
    res.status(204).end();
  } else {
    res.status(400).end();
  }
});


module.exports = contactRouter;
