const mongoose = require('mongoose');
const User = require('./src/models/User');
const Tenant = require('./src/models/Tenant');
require('dotenv').config();

const seed = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);

        // Clean existing data for this test user to avoid duplicates
        await User.deleteOne({ email: 'proprietor@mill.com' });
        await Tenant.deleteOne({ slug: 'indian-mill' });

        console.log('Creating Tenant...');
        const tenant = await Tenant.create({
            name: 'Indian Rice Mill',
            slug: 'indian-mill'
        });

        console.log('Creating Admin User...');
        const user = await User.create({
            tenantId: tenant._id,
            name: 'Proprietor',
            email: 'proprietor@mill.com',
            password: 'password123',
            role: 'TenantAdmin'
        });

        console.log('--- SEED SUCCESS ---');
        console.log('Email: proprietor@mill.com');
        console.log('Password: password123');
        console.log('--------------------');

    } catch (error) {
        console.error('--- SEED ERROR ---');
        console.error(error);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

seed();
