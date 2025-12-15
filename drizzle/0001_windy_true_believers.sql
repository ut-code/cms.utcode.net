DROP INDEX "account_userId_idx";--> statement-breakpoint
DROP INDEX "article_slug_unique";--> statement-breakpoint
DROP INDEX "article_authorId_idx";--> statement-breakpoint
DROP INDEX "member_user_id_unique";--> statement-breakpoint
DROP INDEX "member_slug_unique";--> statement-breakpoint
DROP INDEX "member_userId_idx";--> statement-breakpoint
DROP INDEX "project_slug_unique";--> statement-breakpoint
DROP INDEX "projectMember_pk";--> statement-breakpoint
DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "session_userId_idx";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
DROP INDEX "verification_identifier_idx";--> statement-breakpoint
ALTER TABLE `project` ALTER COLUMN "category" TO "category" text NOT NULL DEFAULT 'active';--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `article_slug_unique` ON `article` (`slug`);--> statement-breakpoint
CREATE INDEX `article_authorId_idx` ON `article` (`author_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `member_user_id_unique` ON `member` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `member_slug_unique` ON `member` (`slug`);--> statement-breakpoint
CREATE INDEX `member_userId_idx` ON `member` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `project_slug_unique` ON `project` (`slug`);--> statement-breakpoint
CREATE INDEX `projectMember_pk` ON `project_member` (`project_id`,`member_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);--> statement-breakpoint
ALTER TABLE `article` ADD `view_count` integer DEFAULT 0 NOT NULL;