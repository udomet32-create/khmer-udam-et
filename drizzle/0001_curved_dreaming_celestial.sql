CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(180) NOT NULL,
	`code` varchar(80) NOT NULL,
	`category` varchar(80) NOT NULL,
	`description` text,
	`priceCents` int NOT NULL,
	`oldPriceCents` int,
	`imageUrl` text,
	`videoUrl` text,
	`badge` varchar(40),
	`isActive` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_code_unique` UNIQUE(`code`)
);
