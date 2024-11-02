import bcrypt from "bcrypt";

// Hash Password Function
export const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.log("Error hashing password:", error);
    throw new Error("Error hashing password");
  }
};

// Compare Password Function
export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.log("Error comparing passwords:", error);
    throw new Error("Error comparing passwords");
  }
};
