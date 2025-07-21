// middleware/debugLogger.js
export const debugUploadFields = (req, res, next) => {
  req.on('data', chunk => {
    console.log('🧩 Incoming chunk:', chunk.toString());
  });

  req.on('end', () => {
    console.log('✅ Finished receiving request.');
  });

  next();
};
