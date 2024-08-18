-- CreateTable
CREATE TABLE "storyIdea" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "storyIdea_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "storyIdea" ADD CONSTRAINT "storyIdea_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
