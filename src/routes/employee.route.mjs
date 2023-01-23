import { Router } from 'express';
import { ROLE } from '../config/variables.mjs';

import { addEmployee, deleteEmployee, getEmployee, updateEmployee } from '../controllers/employee.controller.mjs';
import { verifyToken, isAccess } from '../middlewares/authenticate.mjs';

const router = Router();

router.get('/', verifyToken, isAccess(ROLE.PRESIDENT, ROLE.MANAGER, ROLE.LEADER), getEmployee);
router.post('/', verifyToken, isAccess(ROLE.PRESIDENT), addEmployee);
router.put('/:id', verifyToken, isAccess(ROLE.PRESIDENT, ROLE.MANAGER), updateEmployee);
router.delete('/:id', verifyToken, isAccess(ROLE.PRESIDENT), deleteEmployee);

export default router;
