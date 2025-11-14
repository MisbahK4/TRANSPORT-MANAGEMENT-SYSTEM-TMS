import React, { useState } from "react";
import API from "../api";
import {
  Send,
  Package,
  FileText,
  MapPin,
  Weight,
  IndianRupee,
  Image,
} from "lucide-react";

// Desktop Field Component
const Field = ({ icon: Icon, label, children }) => (
  <div className="space-y-1">
    <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
      <span className="bg-indigo-100 text-indigo-600 p-1.5 rounded-full">
        <Icon size={16} />
      </span>
      {label}
    </label>
    {children}
  </div>
);

// Mobile Field Component (smaller)
const MobileField = ({ icon: Icon, label, children }) => (
  <div className="space-y-1">
    <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
      <span className="bg-indigo-100 text-indigo-600 p-1 rounded-full">
        <Icon size={14} />
      </span>
      {label}
    </label>
    {children}
  </div>
);

const Section = ({ title, icon: Icon, children }) => (
  <div className="space-y-6 animate-fade-in">
    <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2 mb-2">
      <Icon size={20} />
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  </div>
);

const CreatePackage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pickup_location: "",
    drop_location: "",
    weight: "",
    price_expectation: "",
    images: null,
  });

  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, images: file }));
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    data.append("status", "Available");

    try {
      await API.post("packages/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Package created successfully!");
      setFormData({
        title: "",
        description: "",
        pickup_location: "",
        drop_location: "",
        weight: "",
        price_expectation: "",
        images: null,
      });
      setPreview(null);
    } catch (error) {
      setMessage(
        error.response
          ? "❌ Error: " + JSON.stringify(error.response.data, null, 2)
          : "❌ Something went wrong!"
      );
    }
  };

  return (
    <div className="px-4 py-6 sm:py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-block bg-gradient-to-tr from-indigo-500 to-blue-500 text-white p-4 rounded-full shadow-lg">
            <Send size={28} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Create Shipment</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Fill in the details to dispatch your package
          </p>
        </div>

        {/* ✅ Desktop Form */}
        <form onSubmit={handleSubmit} className="space-y-10 hidden md:block">
          {/* Package Info */}
          <Section title="Package Info" icon={Package}>
            <Field icon={Package} label="Package Title">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Electronics Box"
                className="w-full border border-slate-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </Field>

            <Field icon={Weight} label="Weight (kg)">
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g. 12.5"
                className="w-full border border-slate-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </Field>
          </Section>

          {/* Locations */}
          <Section title="Pickup & Drop" icon={MapPin}>
            <Field icon={MapPin} label="Pickup Location">
              <input
                type="text"
                name="pickup_location"
                value={formData.pickup_location}
                onChange={handleChange}
                placeholder="e.g. Mumbai Warehouse"
                className="w-full border border-slate-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </Field>

            <Field icon={MapPin} label="Drop Location">
              <input
                type="text"
                name="drop_location"
                value={formData.drop_location}
                onChange={handleChange}
                placeholder="e.g. Delhi Hub"
                className="w-full border border-slate-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </Field>
          </Section>

          {/* Pricing */}
          <Section title="Pricing" icon={IndianRupee}>
            <Field icon={IndianRupee} label="Expected Price (₹)">
              <input
                type="number"
                name="price_expectation"
                value={formData.price_expectation}
                onChange={handleChange}
                placeholder="e.g. 1500"
                className="w-full border border-slate-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </Field>
          </Section>

          {/* Description */}
          <Field icon={FileText} label="Package Description">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Brief description of the package contents"
              className="w-full border border-slate-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </Field>

          {/* Image Upload */}
          <Field icon={Image} label="Package Image">
            <input
              type="file"
              name="images"
              onChange={handleFileChange}
              className="w-full border border-slate-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
              accept="image/*"
            />
          </Field>
          {preview && (
            <div className="mt-4 flex justify-center">
              <img
                src={preview}
                alt="Preview"
                className="rounded-xl shadow-md max-h-56 object-cover border border-slate-200"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 via-blue-600 to-indigo-500 text-white py-3 rounded-full font-semibold flex items-center justify-center gap-2 hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            <Send size={18} className="animate-pulse" />
            Submit Package
          </button>
        </form>

        {/* ✅ Mobile Form (Compact & Improved) */}
        <form onSubmit={handleSubmit} className="space-y-4 block md:hidden">
          {/* Package Info Card */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 shadow-sm border border-indigo-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-indigo-500 p-1.5 rounded-lg">
                <Package size={16} className="text-white" />
              </div>
              <h3 className="text-base font-bold text-indigo-800">Package Details</h3>
            </div>
            
            <div className="space-y-3">
              <MobileField icon={Package} label="Title">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Electronics"
                  className="w-full border border-slate-300 px-3 py-2 rounded-md text-sm focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </MobileField>
              
              <MobileField icon={Weight} label="Weight (kg)">
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="e.g. 12.5"
                  className="w-full border border-slate-300 px-3 py-2 rounded-md text-sm focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </MobileField>
              
              <MobileField icon={FileText} label="Description">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Package contents"
                  className="w-full border border-slate-300 px-3 py-2 rounded-md text-sm focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </MobileField>
            </div>
          </div>

          {/* Locations Card */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 shadow-sm border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-blue-500 p-1.5 rounded-lg">
                <MapPin size={16} className="text-white" />
              </div>
              <h3 className="text-base font-bold text-blue-800">Locations</h3>
            </div>
            
            <div className="space-y-3">
              <MobileField icon={MapPin} label="Pickup">
                <input
                  type="text"
                  name="pickup_location"
                  value={formData.pickup_location}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai"
                  className="w-full border border-slate-300 px-3 py-2 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
                  required
                />
              </MobileField>

              <MobileField icon={MapPin} label="Drop">
                <input
                  type="text"
                  name="drop_location"
                  value={formData.drop_location}
                  onChange={handleChange}
                  placeholder="e.g. Delhi"
                  className="w-full border border-slate-300 px-3 py-2 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
                  required
                />
              </MobileField>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 shadow-sm border border-amber-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-amber-500 p-1.5 rounded-lg">
                <IndianRupee size={16} className="text-white" />
              </div>
              <h3 className="text-base font-bold text-amber-800">Pricing</h3>
            </div>
            
            <MobileField icon={IndianRupee} label="Price (₹)">
              <input
                type="number"
                name="price_expectation"
                value={formData.price_expectation}
                onChange={handleChange}
                placeholder="e.g. 1500"
                className="w-full border border-slate-300 px-3 py-2 rounded-md text-sm focus:ring-1 focus:ring-amber-500"
                required
              />
            </MobileField>
          </div>

          {/* Image Card */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 shadow-sm border border-purple-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-purple-500 p-1.5 rounded-lg">
                <Image size={16} className="text-white" />
              </div>
              <h3 className="text-base font-bold text-purple-800">Image</h3>
            </div>
            
            <div className="flex gap-3 items-center">
              <div className="flex-1">
                <input
                  type="file"
                  name="images"
                  onChange={handleFileChange}
                  className="w-full text-xs border border-slate-300 px-3 py-2 rounded-md focus:ring-1 focus:ring-purple-500"
                  accept="image/*"
                />
              </div>
              
              {preview && (
                <div className="flex-shrink-0">
                  <img
                    src={preview}
                    alt="Preview"
                    className="rounded-lg shadow h-14 w-14 object-cover border border-slate-200"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:scale-[1.01] hover:shadow-md transition-all duration-300 mt-2"
          >
            <Send size={16} />
            Create Shipment
          </button>
        </form>

        {/* Message */}
        {message && (
          <div
            className={`mt-6 p-3 rounded-lg text-xs ${
              message.startsWith("✅")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePackage;

