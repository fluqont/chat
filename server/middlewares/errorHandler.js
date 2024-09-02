export default function errorHandler(err, req, res, next) {
  console.error(err.message, err.stack);

  const statusCode = err.statusCode ?? 500;
  res.status(statusCode).json({ error: err.message });
}
