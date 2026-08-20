const User = require('../models/user.model');

class UserRepository {
    async create(userData) {
        return await User.create(userData);
    }

    async find(filter, options = {}) {
        let query = User.find(filter);
        if (options.excludePassword) {
            query = query.select("-password");
        }
        return await query;
    }

    async findOne(filter, options = {}) {
        let query = User.findOne(filter);
        if (options.excludePassword) {
            query = query.select("-password");
        }
        if (options.sort) {
            query = query.sort(options.sort);
        }
        return await query;
    }

    async findByIdAndUpdate(id, updateData, options) {
        return await User.findByIdAndUpdate(id, updateData, options);
    }

    async findOneAndUpdate(filter, updateData, options) {
        return await User.findOneAndUpdate(filter, updateData, options);
    }

    async findByIdAndDelete(id) {
        return await User.findByIdAndDelete(id);
    }

    async findOneAndDelete(filter) {
        return await User.findOneAndDelete(filter);
    }

    async countDocuments(filter) {
        return await User.countDocuments(filter);
    }
}

module.exports = new UserRepository();
