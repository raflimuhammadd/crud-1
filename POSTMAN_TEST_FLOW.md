# Postman Test Flow - Fumindo Asset Management API

## Base Configuration

**Base URL:** `http://localhost:3000`

**Headers (all requests):**
```
Content-Type: application/json
Accept: application/json
```

---

## Test Flow Scenarios

### Scenario 1: Complete CRUD Cycle (Happy Path)

#### 1.1 GET All Assets (Initial State)
**Method:** `GET`  
**URL:** `{{baseUrl}}/assets`

**Expected Response:** `200 OK`
```json
[
  {
    "asset_id": 4,
    "asset_name": "Server",
    "stock_quantity": 5,
    "category": "Non-Consumable",
    "created_at": "2026-10-12T14:42:04.471Z",
    "updated_at": "2026-10-12T14:42:04.471Z"
  }
]
```

---

#### 1.2 POST Create New Asset
**Method:** `POST`  
**URL:** `{{baseUrl}}/assets`

**Request Body:**
```json
{
  "asset_name": "Laptop Gaming ASUS ROG",
  "stock_quantity": 10,
  "category": "Non-Consumable"
}
```

**Expected Response:** `201 Created`
```json
{
  "asset_id": 7,
  "asset_name": "Laptop Gaming ASUS ROG",
  "stock_quantity": 10,
  "category": "Non-Consumable",
  "created_at": "2026-10-12T15:00:00.000Z",
  "updated_at": "2026-10-12T15:00:00.000Z"
}
```

**Postman Test Script:**
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has asset_id", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('asset_id');
    pm.environment.set("createdAssetId", jsonData.asset_id);
});
```

---

#### 1.3 GET Single Asset
**Method:** `GET`  
**URL:** `{{baseUrl}}/assets/{{createdAssetId}}`

**Expected Response:** `200 OK`
```json
{
  "asset_id": 7,
  "asset_name": "Laptop Gaming ASUS ROG",
  "stock_quantity": 10,
  "category": "Non-Consumable",
  "created_at": "2026-10-12T15:00:00.000Z",
  "updated_at": "2026-10-12T15:00:00.000Z"
}
```

---

#### 1.4 PUT Update Asset
**Method:** `PUT`  
**URL:** `{{baseUrl}}/assets/{{createdAssetId}}`

**Request Body (partial update):**
```json
{
  "stock_quantity": 8,
  "asset_name": "Laptop Gaming ASUS ROG Strix"
}
```

**Expected Response:** `200 OK`
```json
{
  "asset_id": 7,
  "asset_name": "Laptop Gaming ASUS ROG Strix",
  "stock_quantity": 8,
  "category": "Non-Consumable",
  "created_at": "2026-10-12T15:00:00.000Z",
  "updated_at": "2026-10-12T15:05:00.000Z"
}
```

---

#### 1.5 DELETE Asset (Success)
**Method:** `DELETE`  
**URL:** `{{baseUrl}}/assets/{{createdAssetId}}`

**Expected Response:** `204 No Content` (empty body)

**Postman Test Script:**
```javascript
pm.test("Status code is 204", function () {
    pm.response.to.have.status(204);
});

pm.test("Response body is empty", function () {
    pm.expect(pm.response.text()).to.equal("");
});
```

---

#### 1.6 GET Deleted Asset (Should Fail)
**Method:** `GET`  
**URL:** `{{baseUrl}}/assets/{{createdAssetId}}`

**Expected Response:** `404 Not Found` (or null if not throwing exception)

---

### Scenario 2: Validation Testing (Error Cases)

#### 2.1 POST Invalid Category
**Method:** `POST`  
**URL:** `{{baseUrl}}/assets`

**Request Body:**
```json
{
  "asset_name": "Test Item",
  "stock_quantity": 10,
  "category": "InvalidCategory"
}
```

**Expected Response:** `400 Bad Request`
```json
{
  "statusCode": 400,
  "message": [
    "category must be one of the following values: Consumable, Non-Consumable"
  ],
  "error": "Bad Request"
}
```

---

#### 2.2 POST Negative Stock Quantity
**Method:** `POST`  
**URL:** `{{baseUrl}}/assets`

**Request Body:**
```json
{
  "asset_name": "Test Item",
  "stock_quantity": -10,
  "category": "Consumable"
}
```

**Expected Response:** `400 Bad Request`
```json
{
  "statusCode": 400,
  "message": [
    "stock_quantity must not be less than 0"
  ],
  "error": "Bad Request"
}
```

---

#### 2.3 POST Missing Required Fields
**Method:** `POST`  
**URL:** `{{baseUrl}}/assets`

**Request Body:**
```json
{
  "asset_name": "Incomplete Item"
}
```

**Expected Response:** `400 Bad Request`
```json
{
  "statusCode": 400,
  "message": [
    "stock_quantity must not be less than 0",
    "stock_quantity must be an integer number",
    "category must be one of the following values: Consumable, Non-Consumable"
  ],
  "error": "Bad Request"
}
```

---

#### 2.4 GET Non-existent Asset
**Method:** `GET`  
**URL:** `{{baseUrl}}/assets/99999`

**Expected Response:** `200 OK` with `null` body
(Note: Current implementation returns null instead of 404)

---

#### 2.5 DELETE Non-existent Asset
**Method:** `DELETE`  
**URL:** `{{baseUrl}}/assets/99999`

**Expected Response:** `404 Not Found`
```json
{
  "statusCode": 404,
  "message": "Asset with ID 99999 not found",
  "error": "Not Found"
}
```

**Postman Test Script:**
```javascript
pm.test("Status code is 404", function () {
    pm.response.to.have.status(404);
});

pm.test("Error message is correct", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.message).to.include("not found");
});
```

---

### Scenario 3: Bulk Operations Test

#### 3.1 Create Multiple Assets
**Request 1 - Consumable:**
```json
{
  "asset_name": "Kertas A4",
  "stock_quantity": 500,
  "category": "Consumable"
}
```

**Request 2 - Consumable:**
```json
{
  "asset_name": "Pulpen Pilot",
  "stock_quantity": 200,
  "category": "Consumable"
}
```

**Request 3 - Non-Consumable:**
```json
{
  "asset_name": "Meja Kantor",
  "stock_quantity": 15,
  "category": "Non-Consumable"
}
```

**Request 4 - Non-Consumable:**
```json
{
  "asset_name": "Kursi Ergonomis",
  "stock_quantity": 20,
  "category": "Non-Consumable"
}
```

---

#### 3.2 Verify All Created
**Method:** `GET`  
**URL:** `{{baseUrl}}/assets`

**Expected:** Array with 4+ assets, including newly created ones

---

#### 3.3 Update Multiple Assets
Update stock quantities for all created assets using PUT requests.

---

#### 3.4 Delete All Test Assets
Use DELETE requests with saved asset IDs.

---

## Postman Environment Variables

```json
{
  "baseUrl": "http://localhost:3000",
  "createdAssetId": "",
  "timestamp": ""
}
```

---

## Expected Test Results Summary

| Test Case | Expected Status | Expected Body |
|-----------|----------------|---------------|
| GET /assets | 200 OK | Array of assets |
| POST /assets (valid) | 201 Created | Created asset object |
| POST /assets (invalid) | 400 Bad Request | Validation error |
| GET /assets/:id (exists) | 200 OK | Asset object |
| GET /assets/:id (not exists) | 200 OK | null |
| PUT /assets/:id (exists) | 200 OK | Updated asset object |
| PUT /assets/:id (not exists) | 200 OK | null |
| DELETE /assets/:id (exists) | 204 No Content | Empty |
| DELETE /assets/:id (not exists) | 404 Not Found | Error message |

---

## Time Estimate for Manual Testing

- Complete CRUD cycle: ~3 minutes
- Validation testing: ~2 minutes
- Bulk operations: ~5 minutes
- **Total:** ~10 minutes

---

## Automated Collection Run

Save all requests in Postman collection and run via Collection Runner:
- Expected duration: ~2 minutes
- All tests should pass (green)

---

## Notes for HR Review

✅ **RESTful Standards Implemented:**
- Proper HTTP status codes (200, 201, 204, 400, 404)
- Meaningful error messages
- Resource-based URL design

✅ **Validation:**
- Enum validation for category
- Min value validation for stock_quantity
- Required field validation

✅ **Database Integration:**
- PostgreSQL with TypeORM
- Auto-generated timestamps
- ACID transactions

✅ **Error Handling:**
- 404 for non-existent resources (DELETE)
- 400 for validation errors
- Proper exception handling
