#!/bin/bash

sleep 400

postgres psql -c "ALTER USER postgres WITH ENCRYPTED PASSWORD '$POSTGRES_PASSWORD';"

#!/bin/bash

sleep 400

#!/bin/bash
Connect as postgres and set password
psql -U postgres -d postgres <<EOF
ALTER USER postgres WITH ENCRYPTED PASSWORD '$POSTGRES_PASSWORD';
EOF

# Create database and user
psql -U postgres -d postgres <<EOF
CREATE DATABASE $DB_NAME;
CREATE USER $POSTGRES_USER WITH ENCRYPTED PASSWORD '$POSTGRES_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $POSTGRES_USER;
EOF

# You might consider removing the following line if you don't need to change the root password
psql -U postgres -d postgres <<EOF
ALTER USER postgres WITH ENCRYPTED PASSWORD '$POSTGRES_ROOT_PASSWORD';
EOF

# Connect to the newly created database
psql -U $POSTGRES_USER -d $DB_NAME