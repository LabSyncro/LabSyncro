# Database design

## Draft design

### Gray areas 

These are to be determined later when the query pattern and the DBMS is known:

* Generic data types:
  * UID: A data type for representing a unique identifier
  * MUID: A data type for representing a unique identifier + metadata
  * stext (structured text): A data type for a semi-structure text field 
  * enum: A data type for enumerated fields
* A PK UID field exists only logically, physically, another group of key fields can be chosen to be the PK.
* Some denormalized fields are placed in `stext` fields, can be normalized later to other relations if that make sense.
* Handling of slowly changing dimensions (SCDs).

### Diagram

```mermaid
erDiagram
    Category {
        UID id PK
        stext name "Format: Faculty -> Level 1/Level 2/Level 3"
    }

    DeviceKind {
        UID id PK
        UID categoryId
        string name
        stext metadata "Arbitrary metadata for the device kind"
        stext availableQuantity "A computed map from location to quantity"
    }

    Device {
        UID kind FK
        UID id PK
        int quantity
        string unit
        UID lab
        int availableQuantity "Computed attribute"
        enum status "[]"
        enum quality "[Healthy, Needs Fixing, Broken, Lost]"
        enum borrowableStatus ""
        stext metadata
        UID borrowerId FK
    }

    Lab {
        UID id PK
        string name
        string faculty
        string room
        string branch
        stext timetable "An array of open hours"
        UID adminId FK
    }

    User {
        UID id PK
        MUID labs
        string name
        enum defaultRole "[]"
        stext metadata
        MUID[] borrowedDevices "A computed array of currently borrowed devices"
    }

    Reservation {
        UID id PK
        UID userId FK
        stext devices "A map of device kind to quantity. Note: Devices at different locations will create multiple reservations"
        TimeRange pickupTimeRange
        TimeRange returnTimeRange
        UID lab
        enum status "[Pending, Approved, Cancelled]"
        DateTime createdAt
        DateTime updatedAt                
    }

    RoleHistory {
        UID id PK
        UID granteeId FK
        UID granterId FK
        enum[] permissions "[]"
        TimeRange effectiveTime
    }

    Shipment {
        UID id PK
        DateTime startDate
        DateTime arriveDate
        MUID[] deviceIds
        UID startLocation FK
        UID arriveLocation FK
    }

    InventoryAssessment {
        UID id PK
        DateTime finishedAt
        UID lab
        UID accountant FK
        MUID[] deviceIds
    }

    Receipt {
        UID id PK
        UID borrowerId FK
        UID checkerId FK
        int quantity
        DateTime borrowedAt
        DateTime expectedReturnedAt
        DateTime returnedAt
        UID deviceId FK
        UID lab
    }

    ExpirationExtensionRequest {
        UID id PK
        UID userId FK
        UID receiptId FK
        enum status
        DateTime returnTime
    }

    DeviceKind ||--|{ Device : has
    Lab ||--o{ Device : owns
    Receipt }o--|{ Device: has
    User || --o{ Lab: manages
    User ||--o{ Reservation: has
    User ||--o{ Receipt: has
    User ||--o{ Receipt: accept
    User ||--o{ RoleHistory: grants
    User ||--o{ RoleHistory: has
    User |o--o{ Device: borrows
    InventoryAssessment |o--|{ Device: has
    DeviceKind }|--o{ Reservation: has
    DeviceKind }o--|| Category: in
    Shipment ||--|{ Device: has
    User ||--o{ InventoryAssessment: checks
    ExpirationExtensionRequest }o--|| User: has
    ExpirationExtensionRequest }o--|| Receipt: extends
```

## Query pattern

## SCD handling