import { Router } from 'express';
import { ROLE } from '../config/variables.mjs';

import { addCustomer, deleteCustomer, getCustomer, updateCustomer } from '../controllers/customer.controller.mjs';
import { verifyToken, isAccess } from '../middlewares/authenticate.mjs';

const router = Router();

router.get('/', verifyToken, isAccess(ROLE.PRESIDENT, ROLE.MANAGER, ROLE.LEADER, ROLE.STAFF, ROLE.CUSTOMER), getCustomer);
router.post('/', verifyToken, isAccess(ROLE.PRESIDENT, ROLE.MANAGER, ROLE.LEADER), addCustomer);
router.put('/:id', verifyToken, isAccess(ROLE.PRESIDENT, ROLE.MANAGER, ROLE.LEADER, ROLE.CUSTOMER), updateCustomer);
router.delete('/:id', verifyToken, isAccess(ROLE.PRESIDENT, ROLE.MANAGER, ROLE.LEADER), deleteCustomer);

export default router;
