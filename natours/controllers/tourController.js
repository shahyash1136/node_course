const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

/* const checkID = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);
  if (val * 1 > Tour.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
}; */

//crete a checkbody middleware;
//check if body contains the name and price property
// if not, send back 400 (bad request);
// add it to the post handler stack
/* const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
}; */

// 2) Route Handlers
const getAllTour = catchAsync(async (req, res, next) => {
  console.log(req.query);
  //Build
  /* const query = await Tour.find()
  .where('duration')
  .equals(5)
  .where('difficulty')
  .equals('easy'); */

  //Execute Query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .fieldLimitig()
    .pagination();
  const tours = await features.query;

  //Send Response
  res.status(200).json({
    status: 'success',
    reseutls: tours.length,
    data: {
      tours,
    },
  });
});

const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tours: tour,
    },
  });
});

const updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

const createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tours: newTour,
    },
  });
});

const deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 },
      },
    },
    {
      $group: {
        //_id: '$ratingsAverage',
        _id: { $toUpper: '$difficulty' },
        num: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        avgPrice: 1,
      },
    },
    /* {
      $match: {
        _id: { $ne: 'EASY' },
      },
    }, */
  ]);
  res.status(200).json({
    status: 'success',
    data: stats,
  });
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: {
          $month: '$startDates',
        },
        numTourStarts: { $sum: 1 },
        tours: {
          $push: '$name',
        },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTourStarts: -1,
      },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: plan,
  });
});

module.exports = {
  getAllTour,
  getTour,
  deleteTour,
  createTour,
  updateTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
};
