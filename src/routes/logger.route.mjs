import { Router } from 'express';
import { addLog, getLog, updateLog } from '../controllers/logger.controller.mjs';
import { isAccess, verifyToken } from '../middlewares/authenticate.mjs';
import { ROLE } from '../config/variables.mjs';

const router = Router();

router.get('/', verifyToken, isAccess(ROLE.MANAGER, ROLE.PRESIDENT, ROLE.LEADER), getLog);
router.post('/', verifyToken, isAccess(ROLE.MANAGER, ROLE.PRESIDENT, ROLE.LEADER), addLog);
router.put('/:id', verifyToken, isAccess(ROLE.MANAGER, ROLE.PRESIDENT, ROLE.LEADER), updateLog);

export default router;
