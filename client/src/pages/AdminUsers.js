import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUser, editUser } from "../services/api"; // Ensure editUser is imported

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [editUserData, setEditUserData] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter((user) => user._id !== userId)); // Remove the deleted user from state
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (user) => {
    setEditUserData(user); // Set the selected user for editing
  };

  const handleUpdate = async () => {
    try {
      const updatedUser = await editUser(editUserData._id, editUserData); // Call API to update user
      setUsers(
        users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user // Update the user in the state
        )
      );
      setEditUserData(null); // Close the edit modal
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">User Management</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-4 py-2 border">User ID</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Role</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="px-4 py-2 border">{user._id}</td>
              <td className="px-4 py-2 border">{user.name}</td>
              <td className="px-4 py-2 border">{user.email}</td>
              <td className="px-4 py-2 border">{user.role}</td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-yellow-400 px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editUserData && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <input
              type="text"
              placeholder="Name"
              value={editUserData.name}
              onChange={(e) =>
                setEditUserData({ ...editUserData, name: e.target.value })
              }
              className="border px-4 py-2 mb-2 mr-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={editUserData.email}
              onChange={(e) =>
                setEditUserData({ ...editUserData, email: e.target.value })
              }
              className="border px-4 py-2 mb-2 mr-2"
            />
            <select
              value={editUserData.role}
              onChange={(e) =>
                setEditUserData({ ...editUserData, role: e.target.value })
              }
              className="border px-4 py-2 mb-2 mr-2"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex space-x-2">
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400"
              >
                Save
              </button>
              <button
                onClick={() => setEditUserData(null)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
