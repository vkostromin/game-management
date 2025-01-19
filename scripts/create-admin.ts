import bcrypt from "bcryptjs";

const main = async () => {
  const hashedPassword = await bcrypt.hash("werbwrt!@f3", 12);
  console.log(hashedPassword);
};

main().catch(console.error);
