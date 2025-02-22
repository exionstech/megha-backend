CREATE TABLE `hubs` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`address` text NOT NULL,
	`pincode` text NOT NULL,
	`hub_admin_id` text NOT NULL,
	`kycstatus` integer NOT NULL,
	`kyc_docs` text NOT NULL,
	`kyc_doc_url` text NOT NULL,
	`referencenos` blob NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`hub_admin_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `reference_numbers` (
	`id` text PRIMARY KEY NOT NULL,
	`prefix` text NOT NULL,
	`start` text NOT NULL,
	`end` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`password` text NOT NULL,
	`role` text DEFAULT 'USER' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);