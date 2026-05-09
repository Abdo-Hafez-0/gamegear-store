const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };
};

module.exports = asyncHandler;

// making a handler for handling all the project errors