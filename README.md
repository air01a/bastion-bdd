# Bastion-BDD

Bastion to manage rights on BDD

## Usage

This application allow users authenticated with google to obtain credentials for databases.

Create database users in every databases (with RO or RW rights), enter these users in the app (Manage DB Users).

Add users (only need their email) and give them rights (Manage Rights). A right is a link between a final user, a database and a role (RO/RW). 

When a user wants to get credentials, the app will find an available DB user with the requested right and expose the credentials to the final user. 

The final user has to indicate how long he needs the credentials. At the end of this period, the application will disconnect the user and change its password. 

Each database user can only have only one concurrent access. Consequently, if you have only one RW DB users for a database, and 2 final users wants to connect as the same time, the second final user will have the error message (no remaining db user)

## Installation

Step to install : 

1 - Create database using the export bastion_api.sql

2 - Add manually a user in the table users (just add an email and set the user as admin (user_is_admin = true))

3 - Configure Cognito 


4 - Build the docker image (docker build -t bastion-bdd .)

5 - Run with environnement variables (docker run --env-file ./env -p 443:443 bastion-bdd): 

config for bastion datbase (created in step1)

- DBUSER= 

- DBHOST=

- DBNAME=

- DBPASSWORD=

config for password encryption (set whatever you want, it is used for db encryption)

- AESENCKEY=ffffffffffffffffffffffffffffffff

- AESIV=ffffffffffffffff

- AESPASSPHRASE=who let the dogs out

config for cognito (set as explained in procedure step 3)

- COGNITOURL=

- AWSREGION=
 
- AWSPOOLID=

6 - Create Database users (exemple CITA_USER1_RO, CITA_USER1_RW, ...) for every database

7 - Create these users in the application


### Database users
Users in database must have pg_monitor role (when the program change a database user password, it also cut all active connections, therefore it requires he pg_monitor role).

Configure user in database to activate queries logging : 

postgresql : https://aws.amazon.com/fr/premiumsupport/knowledge-center/rds-postgresql-pgaudit/

aurora : https://aws.amazon.com/fr/blogs/database/auditing-an-amazon-aurora-cluster/

