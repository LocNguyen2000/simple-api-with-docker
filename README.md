# Company Management API

- A RESTful API for managing employees, customers, products, orders.

## Getting started

Prerequisites:

```
NodeJS 16.14.2 - MongoDB 5.0.4 - MySQL - Docker - VSCode Community (or any other IDE is good)
```

Installation steps:

```
git clone https://github.com/LocNguyen2000/simple-api-with-docker.git

- Development:
docker compose up -d mysql0 mongo0
npm run start:dev

- Or build docker image
docker compose up -d
```

Use file `.env.example` as template to create an enviroment file `.env`

```
HOST=`App Host`
PORT=`App port`
SECRET_KEY=`Signature for encrypting and decrypting JWT`

# main db
SQL_HOST=`Host name for SQL Database`
SQL_PORT=`Port used for SQL Database`
SQL_USER=`Username for SQL Database `
SQL_PASSWORD=`Password for authenticating Database`
SQL_DB_NAME=`SQL Database name`

# logger db
MONG0_HOST=`Host name for Mongo Database`
MONGO_PORT=`Port used for Mongo Database`
MONGO_DB_NAME=`Mongo Database name`
```

## Testing

Run `npm test` for unit testing
Test API by importing JSON file at folder `postman` into Postman
Or Test API by using the [Swagger document](https://localhost:{PORT}/api-docs)

## API routes

### Users APIs

```
Register: POST - user/register
Login: POST - user/login
```

### Employees APIs

```
Get list employees by pagination and query: GET - /employees
Create a new employee: POST - /employees
Update infomation of employee: PUT- /employees/:id
Delete a employee: DELETE - /employees/:id
```

### Logs APIs

```
Get all logs: GET - /logs
```

### Customers APIs

```
Get list customers by pagination and query: GET - /customers
Create a new customer: POST - /customers
Update infomation of customer: PUT- /customers/:id
Delete a customer: DELETE - /customers/:id
```

### Offices APIs

```
Get list offices by pagination and query: GET - /offices
Create a new office: POST - /offices
Update infomation of office: PUT- /offices/:id
Delete a office: DELETE - /offices/:id
```

### Product lines APIs

```
Get list product lines by pagination and query: GET - /product-lines
Create a new product line: POST - /product-lines
Update infomation of product line: PUT- /product-lines/:id
Delete a product line: DELETE - /product-lines/:id
```

### Product APIs

```
Get list products by pagination and query: GET - /products
Create a new product: POST - /products
Update infomation of product: PUT- /products/:id
Delete a product: DELETE - /products/:id
```

### Orders APIs

```
Get list orders by pagination and query: GET - /orders
Create a new order: POST - /orders
Update infomation oforder: PUT- /orders/:id
Delete a order: DELETE - /orders/:id
```
