import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
    validate: {
        validator: function (value) {
          const nameRegex = /^[A-Z][a-zA-Z]{1,19}$/;
          return nameRegex.test(value);
        },
        message: 'Last name should start with an uppercase letter and contain only characters. Length should be between 2 and 20 characters.',
      },
  },
  firstName: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        const nameRegex = /^[A-Z][a-zA-Z]{1,19}$/;
        return nameRegex.test(value);
      },
      message: 'First name should start with an uppercase letter and contain only characters. Length should be between 2 and 20 characters.',
    },
  },
  dateCreated: {
    type: Date,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;