import Brand from "../models/Brand.js";

export const getAllBrands = async () => {
  return Brand.find().sort({ name: 1 });
};

export const createBrand = async (data) => {
  return Brand.create(data);
};

export const updateBrand = async (id, data) => {
  const brand = await Brand.findByIdAndUpdate(id, data, { new: true });
  if (!brand) throw new Error("Brand not found");
  return brand;
};

export const deleteBrand = async (id) => {
  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) throw new Error("Brand not found");
  return brand;
};