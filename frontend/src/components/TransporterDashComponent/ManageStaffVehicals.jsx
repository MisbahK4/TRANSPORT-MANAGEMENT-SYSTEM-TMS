import React, { useState, useEffect } from "react";
import API from "../../api"; // axios instance
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruck,
  faUserTie,
  faUser,
  faUsers,
  faUsersCog,
  faPen,
  faTrash,
  faTimes,
  faPhone,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";

export default function ManageStaffVehicle() {
  const [vehicles, setVehicles] = useState([]);
  const [staff, setStaff] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [isVehicleEdit, setIsVehicleEdit] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Fetch vehicles
  const fetchVehicles = async () => {
    try {
      const res = await API.get("vehicles/");
      setVehicles(res.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error.response || error);
    }
  };

  // Fetch staff
  const fetchStaff = async () => {
    try {
      const res = await API.get("staff/");
      setStaff(res.data);
    } catch (error) {
      console.error("Error fetching staff:", error.response || error);
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchStaff();
  }, []);

  // Handle delete
  const handleDelete = async (id, type) => {
    try {
      await API.delete(`${type}/${id}/`);
      if (type === "vehicles") fetchVehicles();
      else fetchStaff();
    } catch (error) {
      console.error("Delete failed:", error.response || error);
    }
  };

  // Handle update submit
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isVehicleEdit ? "vehicles" : "staff";
      await API.put(`${endpoint}/${editItem.id}/`, editItem);
      if (isVehicleEdit) fetchVehicles();
      else fetchStaff();
      setShowModal(false);
      setEditItem(null);
    } catch (error) {
      console.error("Update failed:", error.response || error);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <FontAwesomeIcon icon={faTruck} className="text-blue-600" />
        Manage Vehicles & Staff
      </h1>

      {/* VEHICLE TABLE */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
          <FontAwesomeIcon icon={faTruck} className="text-green-600" />
          Vehicle List
        </h2>
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Number</th>
              <th className="p-2 border">Model</th>
              <th className="p-2 border">Capacity</th>
              <th className="p-2 border">Wheels</th>
              <th className="p-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length > 0 ? (
              vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{v.id}</td>
                  <td className="p-2 border font-medium">{v.truck_number}</td>
                  <td className="p-2 border">{v.truck_model}</td>
                  <td className="p-2 border">{v.capacity}</td>
                  <td className="p-2 border">{v.wheels}</td>
                  <td className="p-2 border text-center space-x-2">
                    <button
                      onClick={() => {
                        setEditItem(v);
                        setIsVehicleEdit(true);
                        setShowModal(true);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button
                      onClick={() => handleDelete(v.id, "vehicles")}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-2 border text-center" colSpan="6">
                  No vehicles found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* STAFF TABLE */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
          <FontAwesomeIcon icon={faUsers} className="text-purple-600" />
          Staff List
        </h2>
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Vehicle</th>
              <th className="p-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.length > 0 ? (
              staff.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{s.id}</td>
                  <td className="p-2 border font-medium">{s.name}</td>
                  <td className="p-2 border">
                    {s.role === "driver" ? (
                      <span className="text-blue-600 font-semibold flex items-center gap-1">
                        <FontAwesomeIcon icon={faUserTie} /> Driver
                      </span>
                    ) : (
                      <span className="text-gray-700 flex items-center gap-1">
                        <FontAwesomeIcon icon={faUser} /> Helper
                      </span>
                    )}
                  </td>
                  <td className="p-2 border">{s.contact}</td>
                  <td className="p-2 border">{s.vehicle?.truck_number}</td>
                  <td className="p-2 border text-center space-x-2">
                    <button
                      onClick={() => {
                        setEditItem(s);
                        setIsVehicleEdit(false);
                        setShowModal(true);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id, "staff")}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-2 border text-center" colSpan="6">
                  No staff found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MERGED ASSIGNMENT TABLE */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
          <FontAwesomeIcon icon={faUsersCog} className="text-indigo-600" />
          Vehicle & Staff Details
        </h2>
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Vehicle Number</th>
              <th className="p-2 border">Model</th>
              <th className="p-2 border">Capacity</th>
              <th className="p-2 border">Wheels</th>
              <th className="p-2 border">Staff Name</th>
              <th className="p-2 border">Contact</th>
              <th className="p-2 border">Role</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length > 0 ? (
              vehicles.map((v) =>
                staff
                  .filter((s) => s.vehicle?.id === v.id)
                  .map((s) => (
                    <tr
                      key={`${v.id}-${s.id}`}
                      className="hover:bg-blue-50 transition duration-200"
                    >
                      <td className="p-2 border">{v.id}</td>
                      <td className="p-2 border font-medium">{v.truck_number}</td>
                      <td className="p-2 border">{v.truck_model}</td>
                      <td className="p-2 border">{v.capacity}</td>
                      <td className="p-2 border">{v.wheels}</td>
                      <td className="p-2 border flex items-center gap-2">
                        <FontAwesomeIcon icon={faUser} className="text-blue-600" />
                        {s.name}
                      </td>
                      <td className="p-2 border flex items-center gap-2">
                        <FontAwesomeIcon icon={faPhone} className="text-green-600" />
                        {s.contact}
                      </td>
                      <td className="p-2 border flex items-center gap-2">
                        <FontAwesomeIcon icon={faIdCard} className="text-purple-600" />
                        {s.role}
                      </td>
                    </tr>
                  ))
              )
            ) : (
              <tr>
                <td className="p-2 border text-center" colSpan="8">
                  No assignments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* UPDATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Update {isVehicleEdit ? "Vehicle" : "Staff"}
            </h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              {isVehicleEdit ? (
                <>
                  <input
                    type="text"
                    value={editItem.truck_number}
                    onChange={(e) =>
                      setEditItem({ ...editItem, truck_number: e.target.value })
                    }
                    placeholder="Truck Number"
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    value={editItem.truck_model}
                    onChange={(e) =>
                      setEditItem({ ...editItem, truck_model: e.target.value })
                    }
                    placeholder="Truck Model"
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="number"
                    value={editItem.capacity}
                    onChange={(e) =>
                      setEditItem({ ...editItem, capacity: e.target.value })
                    }
                    placeholder="Capacity"
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="number"
                    value={editItem.wheels}
                    onChange={(e) =>
                      setEditItem({ ...editItem, wheels: e.target.value })
                    }
                    placeholder="Wheels"
                    className="w-full p-2 border rounded"
                  />
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={editItem.name}
                    onChange={(e) =>
                      setEditItem({ ...editItem, name: e.target.value })
                    }
                    placeholder="Staff Name"
                    className="w-full p-2 border rounded"
                  />
                  <select
                    value={editItem.role}
                    onChange={(e) =>
                      setEditItem({ ...editItem, role: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="driver">Driver</option>
                    <option value="helper">Helper</option>
                  </select>
                  <input
                    type="text"
                    value={editItem.contact}
                    onChange={(e) =>
                      setEditItem({ ...editItem, contact: e.target.value })
                    }
                    placeholder="Phone"
                    className="w-full p-2 border rounded"
                  />
                </>
              )}
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
