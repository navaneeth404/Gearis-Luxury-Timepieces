import User from "../models/User.js";

export const updateProfile = async (userId, { name, email, phone }) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (email && email !== user.email) {
    const existing = await User.findOne({ email });
    if (existing) throw new Error("That email is already in use");
    user.email = email;
  }

  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;

  await user.save();
  return user;
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) throw new Error("Current password is incorrect");

  user.password = newPassword;
  await user.save();
  return user;
};

export const addAddress = async (userId, addressData) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.addresses.push(addressData);
  await user.save();
  return user;
};

export const updateAddress = async (userId, addressId, addressData) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const address = user.addresses.id(addressId);
  if (!address) throw new Error("Address not found");

  Object.assign(address, addressData);
  await user.save();
  return user;
};

export const deleteAddress = async (userId, addressId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const address = user.addresses.id(addressId);
  if (!address) throw new Error("Address not found");

  address.deleteOne();
  await user.save();
  return user;
};