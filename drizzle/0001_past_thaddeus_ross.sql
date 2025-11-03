CREATE TABLE `orderItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` int NOT NULL,
	`quantity` int NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orderItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`storeId` int NOT NULL,
	`userId` int NOT NULL,
	`totalPrice` decimal(10,2) NOT NULL,
	`status` enum('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
	`paymentStatus` enum('pending','paid','failed') DEFAULT 'pending',
	`customerName` varchar(255) NOT NULL,
	`customerEmail` varchar(320) NOT NULL,
	`customerPhone` varchar(20),
	`shippingAddress` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `productSuppliers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`supplierId` int NOT NULL,
	`supplierSku` varchar(100),
	`supplierPrice` decimal(10,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `productSuppliers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`storeId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`price` decimal(10,2) NOT NULL,
	`costPrice` decimal(10,2),
	`image` varchar(500),
	`stock` int DEFAULT 0,
	`sku` varchar(100),
	`category` varchar(100),
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`logo` varchar(500),
	`website` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`storeId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`website` varchar(500),
	`address` text,
	`city` varchar(100),
	`country` varchar(100),
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `suppliers_id` PRIMARY KEY(`id`)
);
