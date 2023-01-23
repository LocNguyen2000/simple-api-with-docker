import { Router } from 'express';
import { ROLE } from '../config/variables.mjs';

import { addProductLine, deleteProductLine, getProductLine, updateProductLine } from '../controllers/product-lines.controller.mjs';
import { verifyToken, isAccess } from '../middlewares/authenticate.mjs';
const router = Router();

router.get('/', verifyToken, isAccess(ROLE.PRESIDENT, ROLE.LEADER, ROLE.MANAGER, ROLE.STAFF), getProductLine);
router.post('/', verifyToken, isAccess(ROLE.PRESIDENT, ROLE.LEADER, ROLE.MANAGER, ROLE.STAFF), addProductLine);
router.put('/:id', verifyToken, isAccess(ROLE.PRESIDENT, ROLE.LEADER, ROLE.MANAGER, ROLE.STAFF), updateProductLine);
router.delete('/:id', verifyToken, isAccess(ROLE.PRESIDENT, ROLE.LEADER, ROLE.MANAGER, ROLE.STAFF), deleteProductLine);

export default router;
