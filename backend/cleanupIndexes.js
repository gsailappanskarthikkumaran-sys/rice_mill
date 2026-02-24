const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const cleanup = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const collections = await mongoose.connection.db.listCollections({ name: 'stocks' }).toArray();
        if (collections.length > 0) {
            console.log('Dropping indexes for "stocks" collection...');
            await mongoose.connection.db.collection('stocks').dropIndexes();
            console.log('Successfully dropped all indexes for "stocks"');
        } else {
            console.log('Collection "stocks" does not exist.');
        }

    } catch (error) {
        console.error('Cleanup failed:', error);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

cleanup();
