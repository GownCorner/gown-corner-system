import React, { useEffect, useState } from "react";
import axios from "../services/api";

const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [newGown, setNewGown] = useState({
    name: "",
    category: "",
    price: "",
  });

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get("/gowns");
        setInventory(response.data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };

    fetchInventory();
  }, []);

  const handleAddGown = async () => {
    try {
      const response = await axios.post("/gowns", newGown);
      setInventory([...inventory, response.data]);
      setNewGown({ name: "", category: "", price: "" }); // Reset form
    } catch (error) {
      console.error("Error adding gown:", error);
    }
  };

  const handleDeleteGown = async (gownId) => {
    try {
      await axios.delete(`/gowns/${gownId}`);
      setInventory(inventory.filter((item) => item._id !== gownId));
    } catch (error) {
      console.error("Error deleting gown:", error);
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
          onChange={(e) => setNewGown({ ...newGown, category: e.target.value })}
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
                <button className="bg-yellow-400 px-2 py-1 rounded">Edit</button>
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
    </div>
  );
};

export default AdminInventory;
