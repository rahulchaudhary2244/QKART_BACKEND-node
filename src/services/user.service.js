const { User } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");

  // TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement getUserById(id)
  /**
   * Get User by id
   * - Fetch user object from Mongo using the "_id" field and return user object
   * @param {String} id
   * @returns {Promise<User>}
   */
  const getUserById = async (id) => {
    try {
      const user = await User.findById({ _id: id });
      return user;
    } catch (error) {
      throw error;
    }
  };

  // TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement getUserByEmail(email)
  /**
   * Get user by email
   * - Fetch user object from Mongo using the "email" field and return user object
   * @param {string} email
   * @returns {Promise<User>}
   */
  const getUserByEmail = async (email) => {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      throw error;
    }
  };

  // TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement createUser(user)
  /**
   * Create a user
   *  - check if the user with the email already exists using `User.isEmailTaken()` method
   *  - If so throw an error using the `ApiError` class. Pass two arguments to the constructor,
   *    1. “200 OK status code using `http-status` library
   *    2. An error message, “Email already taken”
   *  - Otherwise, create and return a new User object
   *
   * @param {Object} userBody
   * @returns {Promise<User>}
   * @throws {ApiError}
   *
   * userBody example:
   * {
   *  "name": "crio-users",
   *  "email": "crio-user@gmail.com",
   *  "password": "usersPasswordHashed"
   * }
   *
   * 200 status code on duplicate email - https://stackoverflow.com/a/53144807
   */
  const createUser = async (userBody) => {
      if (await User.isEmailTaken(userBody.email))
        throw new ApiError(httpStatus.OK, "Email already taken"); // 200
      const buildUser = {
        ...userBody,
        password: await encryptPassword(userBody.password),
      };
      return User.create(buildUser);
  }

  const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  };

  module.exports =  {createUser, getUserById, getUserByEmail}
