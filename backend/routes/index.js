const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const studentRoutes = require('./students');
const teacherRoutes = require('./teachers');
const classroomRoutes = require('./classrooms');
const allocationRoutes = require('./allocations');
const studentPortalRoutes = require('./studentPortal');
const teacherPortalRoutes = require('./teacherPortal');

// Mount routes under logical prefixes
router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/teachers', teacherRoutes);
router.use('/classrooms', classroomRoutes);
router.use('/allocations', allocationRoutes);
router.use('/allocations', studentPortalRoutes);
router.use('/allocations', teacherPortalRoutes);

module.exports = router;
