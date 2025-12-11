const express = require('express');
const {
  getAllTour,
  createTour,
  deleteTour,
  updateTour,
  getTour,
  checkID,
  checkBody,
} = require('../controllers/tourController');

const router = express.Router();

router.param('id', checkID);

//Post is having multiple custom middleware chaining called checkBody
router.route('/').get(getAllTour).post(checkBody, createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
