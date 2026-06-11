-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'matchmaker',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "city" TEXT NOT NULL,
    "languages" TEXT NOT NULL,
    "motherTongue" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "college" TEXT,
    "degree" TEXT,
    "company" TEXT,
    "designation" TEXT,
    "profession" TEXT,
    "income" REAL,
    "maritalStatus" TEXT NOT NULL DEFAULT 'Never Married',
    "religion" TEXT,
    "caste" TEXT,
    "siblings" INTEGER,
    "familyType" TEXT,
    "familyValues" TEXT,
    "diet" TEXT,
    "smoking" TEXT DEFAULT 'No',
    "drinking" TEXT DEFAULT 'No',
    "horoscope" TEXT,
    "manglik" TEXT,
    "lifestyle" TEXT,
    "personality" TEXT,
    "hobbies" TEXT,
    "interests" TEXT,
    "wantsKids" BOOLEAN NOT NULL DEFAULT true,
    "openToRelocate" BOOLEAN NOT NULL DEFAULT false,
    "openToPets" BOOLEAN NOT NULL DEFAULT false,
    "prefAgeMin" INTEGER,
    "prefAgeMax" INTEGER,
    "prefCity" TEXT,
    "prefReligion" TEXT,
    "prefCaste" TEXT,
    "prefEducation" TEXT,
    "prefIncomeMin" REAL,
    "prefIncomeMax" REAL,
    "status" TEXT NOT NULL DEFAULT 'New',
    "journeyStep" INTEGER NOT NULL DEFAULT 0,
    "colorIdx" INTEGER NOT NULL DEFAULT 0,
    "profilePool" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MatchHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerId" INTEGER NOT NULL,
    "matchId" INTEGER NOT NULL,
    "score" REAL NOT NULL,
    "compatibility" TEXT NOT NULL,
    "reasons" TEXT NOT NULL,
    "introMessage" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Sent',
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MatchHistory_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MatchHistory_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Note" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerId" INTEGER NOT NULL,
    "userId" INTEGER,
    "text" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Note',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Note_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
