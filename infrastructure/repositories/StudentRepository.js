const { Student, StudentOccupancy, Room, Dormitory } = require('../../infrastructure/database/models');

class StudentRepository {
    async create(studentData) {
        return await Student.create(studentData);
    }

    async findAll(options) {
        return await Student.findAll({
        ...options,
        include: options.include || [],
        });
    }

    async findById(id) {
        throw new Error("Method 'findById' must be implemented");
    }

    /** async create(studentData) {
        throw new Error("Method 'create' must be implemented");
    }**/

    async update(id, studentData) {
        throw new Error("Method 'update' must be implemented");
    }

    async delete(id) {
        throw new Error("Method 'delete' must be implemented");
    }
}

module.exports = StudentRepository;