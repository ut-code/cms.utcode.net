CREATE TABLE "view_log" (
	"id" text PRIMARY KEY NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" text NOT NULL,
	"viewed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "view_log_resourceType_resourceId_idx" ON "view_log" USING btree ("resource_type","resource_id");--> statement-breakpoint
CREATE INDEX "view_log_viewedAt_idx" ON "view_log" USING btree ("viewed_at");