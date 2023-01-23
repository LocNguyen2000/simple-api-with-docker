import { Router } from 'express';
import { ROLE } from '../config/variables.mjs';

const router = Router();

import { getProduct, addProduct, updateProduct, deleteProduct } from '../controllers/product.controller.mjs';
import { verifyToken, isAccess } from '../middlewares/authenticate.mjs';

router.get('/', verifyToken, isAccess(ROLE.PRESIDENT, ROLE.LEADER, ROLE.MANAGER, ROLE.STAFF), getProduct);
router.post('/', verifyToken, isAccess(ROLE.PRESIDENT, ROLE.LEADER, ROLE.MANAGER, ROLE.STAFF), addProduct);
router.put('/:id', verifyToken, isAccess(ROLE.PRESIDENT, ROLE.LEADER, ROLE.MANAGER, ROLE.STAFF), updateProduct);
router.delete('/:id', verifyToken, isAccess(ROLE.PRESIDENT, ROLE.LEADER, ROLE.MANAGER, ROLE.STAFF), deleteProduct);

export default router;
