import {ROLE} from '../../config/variables.mjs'
export const mockUser = {
  "id": 1,
  "username": "CuongPresident",
  "password": "123",
  "employeeNumber": 2000,
  "customerNumber": null,
  "createdBy": "John",
  "updatedBy": "John",
  "createdAt": "2022-09-29 04:31:34",
  "updatedAt": "2022-09-29 04:31:34",
  "isEmployee": true,
  Employee : {
    officeCode: "1",
    Role: {
        role: ROLE.PRESIDENT
    }
  }
};
