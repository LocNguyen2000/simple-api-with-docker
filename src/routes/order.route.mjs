import { Router } from 'express';
import { addOrder, getOrder, updateOrder, deleteOrder } from '../controllers/orders.controller.mjs';
import { isAccess, verifyToken } from '../middlewares/authenticate.mjs';
import { ROLE } from '../config/variables.mjs';

const router = Router();

router.get('/', verifyToken, isAccess(ROLE.PRESIDENT, ROLE.MANAGER, ROLE.LEADER, ROLE.STAFF, ROLE.CUSTOMER) ,getOrder);
router.post('/', verifyToken, isAccess(ROLE.PRESIDENT, ROLE.MANAGER, ROLE.LEADER), addOrder);
router.put('/:id', verifyToken, isAccess(ROLE.PRESIDENT, ROLE.MANAGER, ROLE.LEADER), updateOrder);
router.delete('/:id', verifyToken, isAccess(ROLE.PRESIDENT, ROLE.MANAGER, ROLE.LEADER), deleteOrder);

export default router;
