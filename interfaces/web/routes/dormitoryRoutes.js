const express = require('express');
const DormitoryController = require('../controllers/dormitoryController');

const router = express.Router();

router.get('/dormitories', DormitoryController.getAllDormitories);
router.get('/dormitories/:id', DormitoryController.getDormitoryById);
router.get('/rooms/:dormitoryId', DormitoryController.getRoomsByDormitory);

module.exports = router;