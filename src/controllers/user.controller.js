import { v4 as uuidv4 } from 'uuid';

const users = [];

export const userController = () => {
	const allUsers = () => {
		console.log(users);
		return users;
	};

	const getUserById = (userId) => {
		const user = users.find((user) => user.id === userId);
		return user;
	};

	const createNewUser = (username, age, hobbies) => {
		const id = uuidv4();
		const newUser = {
			id,
			username,
			age,
			hobbies,
		};
		users.push(newUser);
		console.log(users);
		return newUser;
	};

	const updateUser = (userId, newData) => {
		const user = users.find((user) => user.id === userId);
		console.log(newData);
		if (user) {
			user.username = newData.username || user.username;
			user.age = newData.age || user.age;
			user.hobbies = newData.hobbies || user.hobbies;
			return user;
		}
		return null;
	};

	const deleteUser = (userId) => {
		const index = users.findIndex((user) => user.id === userId);

		if (index !== -1) {
			const deletedUser = users.splice(index, 1)[0];
			return deletedUser;
		}
		return null;
	};

	return {
		allUsers,
		getUserById,
		createNewUser,
		updateUser,
		deleteUser,
	};
};
