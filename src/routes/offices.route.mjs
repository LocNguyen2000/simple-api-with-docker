import { Router } from 'express';
import { ROLE } from '../config/variables.mjs';

import { addOffice, deleteOffice, getOffice, updateOffice } from '../controllers/offices.controller.mjs';
import { verifyToken, isAccess } from '../middlewares/authenticate.mjs';
const router = Router();

router.get('/', verifyToken, isAccess(ROLE.MANAGER, ROLE.PRESIDENT), getOffice);
router.post('/', verifyToken, isAccess(ROLE.PRESIDENT), addOffice);
router.put('/:id', verifyToken, isAccess(ROLE.PRESIDENT), updateOffice);
router.delete('/:id', verifyToken, isAccess(ROLE.MANAGER, ROLE.PRESIDENT), deleteOffice);

export default router;
