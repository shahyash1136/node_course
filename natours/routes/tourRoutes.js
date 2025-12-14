const express = require('express');
const {
  getAllTour,
  createTour,
  deleteTour,
  updateTour,
  getTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourController');

const router = express.Router();

/* router.param('id', checkID); */

router.route('/top-5-cheap').get(aliasTopTours, getAllTour);

router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
//Post is having multiple custom middleware chaining called checkBody
router.route('/').get(getAllTour).post(/* checkBody, */ createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
