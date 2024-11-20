export default function errorHandler(error, req, res, next) {
    let status = error.code | error.status ?? 500;
    if (status === 0) {
      status = 500;
    }
    console.log('EEE', status);
    console.error(error);
    return res.status(status).json({
      path: req.path,
      method: req.method,
      message: error.message ?? 'Internal Server Error',
      data: error.data ?? undefined,
      date: new Date(),
    });
  }
  