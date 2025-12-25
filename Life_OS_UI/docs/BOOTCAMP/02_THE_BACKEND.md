# ⚙️ Lesson 2: The Backend (The Engine)

In this lesson, we will build the foundation of the "Pet Tracker" module. We start with the **Data Layer** because "Data dominates Code" (if your data structure is wrong, your code will be messy).

## Step 1: The Schema (Prisma)

We need to tell our database what a "Pet" and a "Feeding Log" look like.

1.  Open `prisma/schema.prisma`.
2.  Add the following models at the bottom:

```prisma
// --- PET ENGINE ---

model Pet {
  id        String   @id @default(uuid())
  userId    String   // Multi-tenancy: Belongs to a specific user
  name      String
  type      String   // "Dog", "Cat", etc.
  createdAt DateTime @default(now())
  logs      PetLog[] // Relation: One pet has many logs
}

model PetLog {
  id        String   @id @default(uuid())
  petId     String
  pet       Pet      @relation(fields: [petId], references: [id])
  action    String   // "Fed", "Walked", "Medication"
  note      String?
  timestamp DateTime @default(now())
}
```

3.  **Apply the Change:**
    Run this command in your terminal to update the local SQLite database:
    ```bash
    npx prisma migrate dev --name init_pet_engine
    ```

---

## Step 2: The Directory Structure

We follow the **Modular Engine** pattern. Create these folders:

```bash
mkdir -p server/modules/pet_engine/data
mkdir -p server/modules/pet_engine/core
mkdir -p server/modules/pet_engine/api
```

---

## Step 3: The Repository (Data Access)

The **Repository** is the _only_ file allowed to touch Prisma. It handles the raw database operations.

Create `server/modules/pet_engine/data/petRepository.js`:

```javascript
import prisma from '../../../shared/db.js';

const petRepository = {
    // Get all pets for a specific user (Security First!)
    getPetsByUser: async (userId) => {
        return await prisma.pet.findMany({
            where: { userId },
            include: { logs: { orderBy: { timestamp: 'desc' }, take: 5 } }, // Include recent logs
        });
    },

    createPet: async (userId, name, type) => {
        return await prisma.pet.create({
            data: { userId, name, type },
        });
    },

    addLog: async (petId, action, note) => {
        return await prisma.petLog.create({
            data: { petId, action, note },
        });
    },
};

export default petRepository;
```

---

## 🔍 Why this pattern?

- **Security:** `getPetsByUser` _requires_ a `userId`. We can't accidentally fetch everyone's pets.
- **Separation:** If we switch from SQLite to Postgres later, we only change this file, not the whole app.

---

**Next Step:** In Lesson 3, we will build the **Service Layer** and apply Zod validation.
