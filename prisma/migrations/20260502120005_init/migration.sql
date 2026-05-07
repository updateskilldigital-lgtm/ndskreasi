-- CreateTable
CREATE TABLE "Lead" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "business_name" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "has_website" TEXT NOT NULL,
    "timeline" TEXT NOT NULL,
    "budget" TEXT,
    "need_description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
