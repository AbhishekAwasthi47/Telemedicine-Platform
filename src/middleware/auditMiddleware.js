const AuditLog = require('../models/AuditLog');

/**
 * Middleware to log actions that access or mutate Protected Health Information (PHI).
 * Expects req.user to be populated by the auth middleware.
 * @param {string} actionDescriptor - A clear description of the action being taken (e.g., 'READ_MEDICAL_RECORD').
 */
const auditLogPHI = (actionDescriptor) => {
  return async (req, res, next) => {
    // Capture the original send to intercept the response status if needed
    const originalSend = res.send;
    
    res.send = function (data) {
      // Restore original send
      res.send = originalSend;

      // Only log if the action was successful or partially successful
      // If unauthorized or bad request before hitting controller, we might not want it here, 
      // but for strict compliance we log it anyway.
      
      const logEntry = {
        userId: req.user ? req.user.id : 'UNAUTHENTICATED',
        ipAddress: req.ip || req.connection.remoteAddress,
        action: actionDescriptor,
        resource: req.originalUrl,
        details: {
          method: req.method,
          statusCode: res.statusCode,
          params: req.params,
          query: req.query
        }
      };

      // Fire and forget logging (don't block the response)
      AuditLog.create(logEntry).catch(err => {
        console.error('Failed to write audit log:', err);
      });

      // Continue with sending response
      return res.send.apply(res, arguments);
    };

    next();
  };
};

module.exports = {
  auditLogPHI
};
