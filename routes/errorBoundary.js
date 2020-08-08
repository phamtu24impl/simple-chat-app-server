module.exports = function errorBoundary(handler) {
  return async (...args) => {
    const next = args[2]
    try {
      await handler(...args)
    } catch (error) {
      next(error)
    }
  }
}
