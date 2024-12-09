import React, { useEffect, useState } from "react";
import { fetchGowns, addGown, editGown, deleteGown } from "../services/api"; // API functions

const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [newGown, setNewGown] = useState({
    name: "",
    category: "",
    price: "",
  });
  const [editGownData, setEditGownData] = useState(null); // State for editing gown

  // Fetch all gowns on component mount
  useEffect(() => {
    const loadInventory = async () => {
      try {
        const data = await fetchGowns();
        setInventory(data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };
    loadInventory();
  }, []);

  // Add a new gown
  const handleAddGown = async () => {
    try {
      const response = await addGown(newGown);
      setInventory([...inventory, response]); // Add the new gown to the inventory
      setNewGown({ name: "", category: "", price: "" }); // Reset the form
    } catch (error) {
      console.error("Error adding gown:", error);
    }
  };

  // Delete a gown
  const handleDeleteGown = async (gownId) => {
    try {
      await deleteGown(gownId);
      setInventory(inventory.filter((item) => item._id !== gownId)); // Remove the gown from inventory
    } catch (error) {
      console.error("Error deleting gown:", error);
    }
  };

  // Open the edit modal
  const handleEditGown = (gown) => {
    setEditGownData(gown); // Set the selected gown for editing
  };

  // Update a gown
  const handleUpdateGown = async () => {
    try {
      const updatedGown = await editGown(editGownData._id, editGownData); // Call the API to update the gown
      setInventory(
        inventory.map((item) =>
          item._id === updatedGown._id ? updatedGown : item
        )
      );
      setEditGownData(null); // Close the edit modal
    } catch (error) {
      console.error("Error updating gown:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Inventory Management</h1>

      {/* Add Gown Form */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Add New Gown</h2>
        <input
          type="text"
          placeholder="Name"
          value={newGown.name}
          onChange={(e) => setNewGown({ ...newGown, name: e.target.value })}
          className="border px-4 py-2 mb-2 mr-2"
        />
        <input
          type="text"
          placeholder="Category"
          value={newGown.category}
          onChange={(e) =>
            setNewGown({ ...newGown, category: e.target.value })
          }
          className="border px-4 py-2 mb-2 mr-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={newGown.price}
          onChange={(e) => setNewGown({ ...newGown, price: e.target.value })}
          className="border px-4 py-2 mb-2 mr-2"
        />
        <button
          onClick={handleAddGown}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400"
        >
          Add Gown
        </button>
      </div>

      {/* Inventory Table */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Gown ID</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Category</th>
            <th className="px-4 py-2 border">Price</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item._id}>
              <td className="px-4 py-2 border">{item._id}</td>
              <td className="px-4 py-2 border">{item.name}</td>
              <td className="px-4 py-2 border">{item.category}</td>
              <td className="px-4 py-2 border">₱{item.price}</td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => handleEditGown(item)}
                  className="bg-yellow-400 px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteGown(item._id)}
                  className="bg-red-500 px-2 py-1 rounded text-white ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Gown Modal */}
      {editGownData && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Gown</h2>
            <input
              type="text"
              placeholder="Name"
              value={editGownData.name}
              onChange={(e) =>
                setEditGownData({ ...editGownData, name: e.target.value })
              }
              className="border px-4 py-2 mb-2 mr-2"
            />
            <input
              type="text"
              placeholder="Category"
              value={editGownData.category}
              onChange={(e) =>
                setEditGownData({ ...editGownData, category: e.target.value })
              }
              className="border px-4 py-2 mb-2 mr-2"
            />
            <input
              type="number"
              placeholder="Price"
              value={editGownData.price}
              onChange={(e) =>
                setEditGownData({ ...editGownData, price: e.target.value })
              }
              className="border px-4 py-2 mb-2 mr-2"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleUpdateGown}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400"
              >
                Save
              </button>
              <button
                onClick={() => setEditGownData(null)}
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

export default AdminInventory;
 