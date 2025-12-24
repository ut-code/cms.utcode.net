CREATE TABLE "user_preference" (
	"user_id" text PRIMARY KEY NOT NULL,
	"default_author_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_preference" ADD CONSTRAINT "user_preference_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preference" ADD CONSTRAINT "user_preference_default_author_id_member_id_fk" FOREIGN KEY ("default_author_id") REFERENCES "public"."member"("id") ON DELETE set null ON UPDATE no action;