const mongoose = require('mongoose');
const User = require('./src/models/User');
const Tenant = require('./src/models/Tenant');
const Branch = require('./src/models/Branch');
require('dotenv').config();

const seed = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);

        // Clean existing data
        await User.deleteMany({ email: /@mill.com$/ });
        await Tenant.deleteOne({ slug: 'indian-mill' });
        await Branch.deleteMany({ name: 'Main Branch' });

        console.log('Creating Tenant...');
        const tenant = await Tenant.create({
            millName: 'Indian Rice Mill',
            ownerName: 'Proprietor Name',
            contactNumber: '9988776655',
            slug: 'indian-mill'
        });

        console.log('Creating Branch...');
        const branch = await Branch.create({
            tenantId: tenant._id,
            name: 'Main Branch',
            location: 'Nellore, AP'
        });

        const roles = [
            { name: 'SuperAdmin', email: 'super@mill.com', role: 'SuperAdmin' },
            { name: 'Proprietor', email: 'proprietor@mill.com', role: 'MillOwner' },
            { name: 'Staff User', email: 'staff@mill.com', role: 'Operator', branchId: branch._id },
        ];

        console.log('Creating Users...');
        for (const roleData of roles) {
            await User.create({
                tenantId: tenant._id,
                ...roleData,
                password: 'password123'
            });
        }

        console.log('--- SEED SUCCESS ---');
        console.log('Password for all users: password123');
        roles.forEach(r => console.log(`${r.role}: ${r.email}`));
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
