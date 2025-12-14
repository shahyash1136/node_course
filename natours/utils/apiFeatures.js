class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  //1) Filtering
  filter() {
    //1A) Filtering
    const queryObj = { ...this.queryString };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => {
      delete queryObj[el];
    });

    //1B) Advance Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // {difficulty:'easy',duration:{$gte:5}}
    //{ difficulty: 'easy', duration: { gte: '5' } }

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  //2) Sorting
  sort() {
    //for descending sort add - at the story of the sort query
    // {sort: -price}
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  //3) Field Limiting
  fieldLimitig() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      //- is used to exclued the key.
      this.query = this.query.select('-__v');
    }
    return this;
  }

  //4) Pagination
  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
