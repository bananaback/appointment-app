import UserAccount from '../models/UserAccount.js';

export const createAdminIfNotExist = async () => {
    try {
        // Check if an admin user already exists
        const existingAdmin = await UserAccount.findOne({ role: 'Admin' });

        if (!existingAdmin) {
            // Define admin details
            const adminData = {
                firstName: 'Admin',
                lastName: 'User',
                email: 'votrongtin8820034@gmail.com',  // Update this to a preferred admin email
                phone: '1234567890',
                password: 'admin',  // Set a secure password
                role: 'Admin',
                dob: new Date('1990-01-01'),
                gender: 'Other',
                address: {
                    street: '123 Admin St',
                    city: 'Admin City',
                    state: 'Admin State',
                    zip: '12345',
                }
            };

            // Create a new admin user
            const newAdmin = new UserAccount(adminData);
            await newAdmin.save();

            console.log('Admin user created successfully.');
        } else {
            console.log('Admin user already exists.');
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
};
