SET GLOBAL local_infile = 1;

DROP TABLE IF EXISTS daily_transaction;
CREATE TABLE daily_transaction (
    code char(5) NOT NULL,
    company_name varchar(50) NOT NULL,
    market varchar(50) NOT NULL,
    sector varchar(50) NOT NULL,
    date date NOT NULL,
    open decimal(10,2) unsigned DEFAULT NULL,
    highest decimal(10,2) unsigned DEFAULT NULL,
    lowest decimal(10,2) unsigned DEFAULT NULL,
    close decimal(10,2) unsigned DEFAULT NULL,
    volume decimal(10,2) unsigned DEFAULT NULL,
    PRIMARY KEY (`code`, `date`),
    KEY (`code`),
    KEY (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS company_info;
CREATE TABLE company_info (
    code char(5) NOT NULL,
    company_name varchar(50) NOT NULL,
    market varchar(50) NOT NULL,
    sector varchar(50) NOT NULL,
    PRIMARY KEY (`code`),
    KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS swing_memo;
CREATE TABLE swing_memo (
    id int(11) NOT NULL AUTO_INCREMENT,
    code char(5) NOT NULL,
    created_at datetime default current_timestamp,
    PRIMARY KEY (`id`),
    KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;