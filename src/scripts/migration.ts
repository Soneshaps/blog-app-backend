import AWS from 'aws-sdk'

const dynamoDb = new AWS.DynamoDB({
    endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8080',
    region: process.env.AWS_REGION || 'us-west-2',
    accessKeyId: 'fake', //  dummy values
    secretAccessKey: 'fake123', //  dummy values
})

const tableParams: AWS.DynamoDB.CreateTableInput = {
    TableName: 'BlogApp',
    AttributeDefinitions: [
        // Main table attributes
        { AttributeName: 'PK', AttributeType: 'S' },
        { AttributeName: 'SK', AttributeType: 'S' },

        // GSI attributes
        { AttributeName: 'type', AttributeType: 'S' },
        { AttributeName: 'createdAt', AttributeType: 'S' },
    ],
    KeySchema: [
        { AttributeName: 'PK', KeyType: 'HASH' }, // Partition Key
        { AttributeName: 'SK', KeyType: 'RANGE' }, // Sort Key
    ],
    GlobalSecondaryIndexes: [
        {
            IndexName: 'GSI_Articles_By_Created',
            KeySchema: [
                { AttributeName: 'type', KeyType: 'HASH' }, // Partition Key for GSI
                { AttributeName: 'createdAt', KeyType: 'RANGE' }, // Sort Key for GSI
            ],
            Projection: {
                ProjectionType: 'ALL',
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
            },
        },
    ],
    // For a provisioned mode table. If you're using on-demand, omit this.
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
    },
}

/**
 * Creates the BlogApp table with the specified GSI if it does not exist already.
 */
async function createTableIfNotExists() {
    try {
        // Check if the table already exists
        const existingTables = await dynamoDb.listTables().promise()
        if (existingTables.TableNames?.includes(tableParams.TableName)) {
            console.log(
                `Table "${tableParams.TableName}" already exists. Skipping creation.`
            )
            return
        }

        // Table doesn't exist, so create it
        const result = await dynamoDb.createTable(tableParams).promise()
        console.log(
            `Table "${tableParams.TableName}" created successfully:`,
            result.TableDescription?.TableName
        )
    } catch (error) {
        console.error('Error creating table:', error)
        process.exit(1)
    }
}

async function runMigrations() {
    console.log('Starting DynamoDB migrations...')
    await createTableIfNotExists()
    console.log('DynamoDB migrations completed.')
}

runMigrations().catch((err) => {
    console.error('Migration script failed:', err)
    process.exit(1)
})
