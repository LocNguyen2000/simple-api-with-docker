export const mockOrderQuery = {
    "orderNumber": 10298,
    "orderDate": "2004-09-27T00:00:00.000Z",
    "requiredDate": "2004-10-05T00:00:00.000Z",
    "shippedDate": null,
    "status": "Resolved",
    "customerNumber": 103,
    "comments": "Order in In Process",
    "OrderDetails": [
        {
            "orderNumber": 10298,
            "productCode": "S10_2016",
            "quantityOrdered": 39,
            "priceEach": 105.86,
            "orderLineNumber": 1,
            "createdBy": null,
            "updatedBy": null,
            "createdAt": null,
            "updatedAt": null,
            "deleted": null
        },
        {
            "orderNumber": 10298,
            "productCode": "S18_2625",
            "quantityOrdered": 32,
            "priceEach": 60.57,
            "orderLineNumber": 2,
            "createdBy": null,
            "updatedBy": null,
            "createdAt": null,
            "updatedAt": null,
            "deleted": null
        }
    ]
}

export const mockOrderRequest = {
    "order": {
        "orderNumber": 10434,
        "orderDate": "2004-09-27T00:00:00.000Z",
        "requiredDate": "2004-10-05T00:00:00.000Z",
        "shippedDate": null,
        "status": "COD",
        "comments": "Nguyen Huu Loc order",
        "customerNumber": 103
    },
    "details": [
        {
            "productCode": "S24_2022",
            "quantityOrdered": 43,
            "priceEach": 38.98,
            "orderLineNumber": 1
        }
    ],
    "payment": {
        "customerNumber": 103,
        "amount": 123.01,
        "paymentDate": "2022-10-09T17:00:00.000Z",
        "updatedBy": "LocNH12",
        "createdBy": "LocNH12",
        "updatedAt": "2022-10-10T03:50:29.570Z",
        "createdAt": "2022-10-10T03:50:29.570Z"
    }
}