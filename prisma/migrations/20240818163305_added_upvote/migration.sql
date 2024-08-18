-- CreateTable
CREATE TABLE "storyUpvote" (
    "id" SERIAL NOT NULL,
    "story_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "upvote" BOOLEAN NOT NULL,

    CONSTRAINT "storyUpvote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "storyUpvote_story_id_user_id_key" ON "storyUpvote"("story_id", "user_id");

-- AddForeignKey
ALTER TABLE "storyUpvote" ADD CONSTRAINT "storyUpvote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storyUpvote" ADD CONSTRAINT "storyUpvote_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "storyIdea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
