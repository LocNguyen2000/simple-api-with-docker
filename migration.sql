DROP TABLE IF EXISTS `role`;

CREATE TABLE
    `role` (
        `id` int NOT NULL AUTO_INCREMENT,
        `role` varchar(50) NOT NULL,
        `createdAt` datetime DEFAULT NULL,
        `updatedAt` datetime DEFAULT NULL,
        `createdBy` varchar(50) DEFAULT NULL,
        `updatedBy` varchar(50) DEFAULT NULL,
        PRIMARY KEY (`id`),
        UNIQUE KEY `role` (`role`)
    ) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = latin1;

LOCK TABLES `role` WRITE;

INSERT INTO `role`
VALUES (
        1,
        'President',
        NULL,
        NULL,
        NULL,
        NULL
    ), (
        2,
        'Manager',
        NULL,
        NULL,
        NULL,
        NULL
    ), (
        3,
        'Leader',
        NULL,
        NULL,
        NULL,
        NULL
    ), (
        4,
        'Staff',
        NULL,
        NULL,
        NULL,
        NULL
    ), (
        5,
        'Customer',
        NULL,
        NULL,
        NULL,
        NULL
    );

UNLOCK TABLES;