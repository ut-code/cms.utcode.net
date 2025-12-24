CREATE TABLE "article_slug_redirect" (
	"id" text PRIMARY KEY NOT NULL,
	"old_slug" text NOT NULL,
	"new_slug" text NOT NULL,
	"article_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "member" ADD COLUMN "view_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "view_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "article_slug_redirect" ADD CONSTRAINT "article_slug_redirect_article_id_article_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."article"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "article_slug_redirect_oldSlug_idx" ON "article_slug_redirect" USING btree ("old_slug");--> statement-breakpoint
CREATE INDEX "article_slug_redirect_articleId_idx" ON "article_slug_redirect" USING btree ("article_id");