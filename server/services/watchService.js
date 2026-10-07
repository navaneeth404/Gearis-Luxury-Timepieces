import Watch from "../models/Watch.js";

export const getAllWatches = async (filters = {}) => {
  const query = {};

  if (filters.search) query.name = { $regex: filters.search, $options: "i" };
  if (filters.brand) query.brand = filters.brand;
  if (filters.gender) query.gender = filters.gender;
  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
    if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
  }

  return Watch.find(query).populate("brand", "name logo");
};

export const getFeaturedWatches = async () => {
  return Watch.find({ isFeatured: true }).populate("brand", "name logo").limit(8);
};

export const getWatchById = async (id) => {
  const watch = await Watch.findById(id).populate("brand", "name logo description");
  if (!watch) throw new Error("Watch not found");
  return watch;
};

export const createWatch = async (data) => {
  return Watch.create(data);
};

export const updateWatch = async (id, data) => {
  const watch = await Watch.findByIdAndUpdate(id, data, { new: true });
  if (!watch) throw new Error("Watch not found");
  return watch;
};

export const deleteWatch = async (id) => {
  const watch = await Watch.findByIdAndDelete(id);
  if (!watch) throw new Error("Watch not found");
  return watch;
};