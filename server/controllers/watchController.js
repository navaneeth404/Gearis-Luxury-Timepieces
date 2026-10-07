import * as watchService from "../services/watchService.js";

export const getWatches = async (req, res) => {
  try {
    const watches = await watchService.getAllWatches(req.query);
    res.json(watches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFeatured = async (req, res) => {
  try {
    const watches = await watchService.getFeaturedWatches();
    res.json(watches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getWatch = async (req, res) => {
  try {
    const watch = await watchService.getWatchById(req.params.id);
    res.json(watch);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const addWatch = async (req, res) => {
  try {
    const watch = await watchService.createWatch(req.body);
    res.status(201).json(watch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const editWatch = async (req, res) => {
  try {
    const watch = await watchService.updateWatch(req.params.id, req.body);
    res.json(watch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const removeWatch = async (req, res) => {
  try {
    await watchService.deleteWatch(req.params.id);
    res.json({ message: "Watch deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};