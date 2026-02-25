-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'COUPLE_OWNER', 'COUPLE_EDITOR');

-- CreateEnum
CREATE TYPE "public"."RSVPStatus" AS ENUM ('YES', 'NO');

-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('PENDING_PAYMENT', 'AWAITING_CONFIRMATION', 'PAID', 'CANCELED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."GiftMode" AS ENUM ('UNIQUE', 'REPEATABLE');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'COUPLE_OWNER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Couple" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Couple_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CoupleMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'COUPLE_OWNER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoupleMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Wedding" (
    "id" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "story" TEXT,
    "eventDate" TIMESTAMP(3),
    "location" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "isRsvpOpen" BOOLEAN NOT NULL DEFAULT false,
    "rsvpRestricted" BOOLEAN NOT NULL DEFAULT true,
    "rsvpPasscode" TEXT,
    "templateId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wedding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Template" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "previewUrl" TEXT,
    "tokensJson" JSONB NOT NULL,
    "layoutJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WeddingSection" (
    "id" TEXT NOT NULL,
    "weddingId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "WeddingSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GalleryPhoto" (
    "id" TEXT NOT NULL,
    "weddingId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "GalleryPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Guest" (
    "id" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "maxCompanions" INTEGER NOT NULL DEFAULT 0,
    "passcode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Rsvp" (
    "id" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "guestName" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "status" "public"."RSVPStatus" NOT NULL,
    "companions" INTEGER NOT NULL DEFAULT 0,
    "message" TEXT,
    "source" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rsvp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PixSetting" (
    "id" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "pixKey" TEXT NOT NULL,
    "receiverName" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "txidPrefix" TEXT NOT NULL DEFAULT 'WED',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PixSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GiftCatalogItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageStyle" TEXT NOT NULL,
    "imagePrompt" TEXT NOT NULL,
    "imageUrl" TEXT,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GiftCatalogItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WeddingGift" (
    "id" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "catalogItemId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "priceCents" INTEGER NOT NULL DEFAULT 0,
    "giftMode" "public"."GiftMode" NOT NULL DEFAULT 'UNIQUE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeddingGift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GiftOrder" (
    "id" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "weddingGiftId" TEXT NOT NULL,
    "giverName" TEXT NOT NULL,
    "message" TEXT,
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "amountCents" INTEGER NOT NULL,
    "pixTxid" TEXT NOT NULL,
    "reservedUntil" TIMESTAMP(3),
    "markedPaidAt" TIMESTAMP(3),
    "markedPaidByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GiftOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "userId" TEXT,
    "coupleId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Couple_slug_key" ON "public"."Couple"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CoupleMember_userId_coupleId_key" ON "public"."CoupleMember"("userId", "coupleId");

-- CreateIndex
CREATE UNIQUE INDEX "Wedding_coupleId_key" ON "public"."Wedding"("coupleId");

-- CreateIndex
CREATE UNIQUE INDEX "Template_key_key" ON "public"."Template"("key");

-- CreateIndex
CREATE INDEX "Guest_coupleId_normalizedName_idx" ON "public"."Guest"("coupleId", "normalizedName");

-- CreateIndex
CREATE UNIQUE INDEX "PixSetting_coupleId_key" ON "public"."PixSetting"("coupleId");

-- CreateIndex
CREATE UNIQUE INDEX "WeddingGift_coupleId_catalogItemId_key" ON "public"."WeddingGift"("coupleId", "catalogItemId");

-- CreateIndex
CREATE UNIQUE INDEX "GiftOrder_pixTxid_key" ON "public"."GiftOrder"("pixTxid");

-- AddForeignKey
ALTER TABLE "public"."CoupleMember" ADD CONSTRAINT "CoupleMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CoupleMember" ADD CONSTRAINT "CoupleMember_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "public"."Couple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Wedding" ADD CONSTRAINT "Wedding_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "public"."Couple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Wedding" ADD CONSTRAINT "Wedding_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WeddingSection" ADD CONSTRAINT "WeddingSection_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "public"."Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GalleryPhoto" ADD CONSTRAINT "GalleryPhoto_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "public"."Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Guest" ADD CONSTRAINT "Guest_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "public"."Couple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rsvp" ADD CONSTRAINT "Rsvp_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "public"."Couple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PixSetting" ADD CONSTRAINT "PixSetting_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "public"."Couple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WeddingGift" ADD CONSTRAINT "WeddingGift_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "public"."Couple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WeddingGift" ADD CONSTRAINT "WeddingGift_catalogItemId_fkey" FOREIGN KEY ("catalogItemId") REFERENCES "public"."GiftCatalogItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GiftOrder" ADD CONSTRAINT "GiftOrder_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "public"."Couple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GiftOrder" ADD CONSTRAINT "GiftOrder_weddingGiftId_fkey" FOREIGN KEY ("weddingGiftId") REFERENCES "public"."WeddingGift"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GiftOrder" ADD CONSTRAINT "GiftOrder_markedPaidByUserId_fkey" FOREIGN KEY ("markedPaidByUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "public"."Couple"("id") ON DELETE SET NULL ON UPDATE CASCADE;
