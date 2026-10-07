import * as brandService from "../services/brandService.js";

export const getBrands = async (req, res) => {
  try {
    const brands = await brandService.getAllBrands();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addBrand = async (req, res) => {
  try {
    const brand = await brandService.createBrand(req.body);
    res.status(201).json(brand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const editBrand = async (req, res) => {
  try {
    const brand = await brandService.updateBrand(req.params.id, req.body);
    res.json(brand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const removeBrand = async (req, res) => {
  try {
    await brandService.deleteBrand(req.params.id);
    res.json({ message: "Brand deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};