const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  userId: {
    type: String, // String to accommodate unauthenticated or different types of users
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  resource: {
    type: String,
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  // Immutable trail for compliance: disable updates and deletes if possible at app level
  capped: { size: 1024 * 1024 * 100 } // Example: Capped collection (100MB) can prevent deletes
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
