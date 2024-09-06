/*
  Warnings:

  - A unique constraint covering the columns `[userId,requestedUserId]` on the table `FriendRequest` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[groupId,userId]` on the table `GroupRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_userId_requestedUserId_key" ON "FriendRequest"("userId", "requestedUserId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupRequest_groupId_userId_key" ON "GroupRequest"("groupId", "userId");
