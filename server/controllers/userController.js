import * as userService from "../services/userService.js";

export const updateMe = async (req, res) => {
  try {
    const user = await userService.updateProfile(req.user._id, req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const changeMyPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new password are required" });
    }
    await userService.changePassword(req.user._id, currentPassword, newPassword);
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const addMyAddress = async (req, res) => {
  try {
    const user = await userService.addAddress(req.user._id, req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateMyAddress = async (req, res) => {
  try {
    const user = await userService.updateAddress(req.user._id, req.params.addressId, req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteMyAddress = async (req, res) => {
  try {
    const user = await userService.deleteAddress(req.user._id, req.params.addressId);
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};