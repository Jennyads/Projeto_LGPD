import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1701256984502 implements MigrationInterface {
    name = 'Default1701256984502'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`prodTitle\` varchar(25) NOT NULL, \`prodDescription\` varchar(80) NOT NULL, \`prodPrice\` varchar(10) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`productId\` int NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Contact\` (\`id\` int NOT NULL AUTO_INCREMENT, \`phone\` varchar(25) NOT NULL, \`email\` varchar(40) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`terms\` (\`id\` int NOT NULL AUTO_INCREMENT, \`versionDescription\` varchar(25) NOT NULL, \`userApplied\` tinyint NOT NULL, \`dateApplied\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`userTerms\` (\`id\` int NOT NULL AUTO_INCREMENT, \`termsId\` int NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userName\` varchar(25) NOT NULL, \`userCpf\` varchar(25) NOT NULL, \`DateCreate\` datetime NOT NULL, \`contactId\` int NULL, \`addressId\` int NULL, UNIQUE INDEX \`REL_6530f8ceb93f81306e5396384e\` (\`contactId\`), UNIQUE INDEX \`REL_217ba147c5de6c107f2fa7fa27\` (\`addressId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`address\` (\`id\` int NOT NULL AUTO_INCREMENT, \`street\` varchar(255) NOT NULL, \`city\` varchar(255) NOT NULL, \`neighborhood\` varchar(255) NOT NULL, \`number\` varchar(255) NOT NULL, \`country\` varchar(255) NOT NULL, \`cep\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`historic\` (\`id\` int NOT NULL AUTO_INCREMENT, \`action\` varchar(100) NOT NULL, \`timestamp\` datetime NOT NULL, \`entityType\` varchar(20) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_88991860e839c6153a7ec878d39\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_caabe91507b3379c7ba73637b84\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`userTerms\` ADD CONSTRAINT \`FK_749cbe7f593ec24f4750e0a1c05\` FOREIGN KEY (\`termsId\`) REFERENCES \`terms\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`userTerms\` ADD CONSTRAINT \`FK_3fd0381ff998d4f1c15f8950609\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_6530f8ceb93f81306e5396384e8\` FOREIGN KEY (\`contactId\`) REFERENCES \`Contact\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_217ba147c5de6c107f2fa7fa271\` FOREIGN KEY (\`addressId\`) REFERENCES \`address\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_217ba147c5de6c107f2fa7fa271\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_6530f8ceb93f81306e5396384e8\``);
        await queryRunner.query(`ALTER TABLE \`userTerms\` DROP FOREIGN KEY \`FK_3fd0381ff998d4f1c15f8950609\``);
        await queryRunner.query(`ALTER TABLE \`userTerms\` DROP FOREIGN KEY \`FK_749cbe7f593ec24f4750e0a1c05\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_caabe91507b3379c7ba73637b84\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_88991860e839c6153a7ec878d39\``);
        await queryRunner.query(`DROP TABLE \`historic\``);
        await queryRunner.query(`DROP TABLE \`address\``);
        await queryRunner.query(`DROP INDEX \`REL_217ba147c5de6c107f2fa7fa27\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`REL_6530f8ceb93f81306e5396384e\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`userTerms\``);
        await queryRunner.query(`DROP TABLE \`terms\``);
        await queryRunner.query(`DROP TABLE \`Contact\``);
        await queryRunner.query(`DROP TABLE \`order\``);
        await queryRunner.query(`DROP TABLE \`product\``);
    }

}
