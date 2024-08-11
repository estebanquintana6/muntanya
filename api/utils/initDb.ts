import User from "../models/User";
import { hashPassword } from "./passwordUtils";

const createAdmin = async (username: string) => {
    const { FIRST_ADMIN_PASSWORD: adminPassword  } = process.env;

    const adminExist = await User.findOne({ username });

    if (adminExist || !adminPassword) return;

    const hashedPassword = await hashPassword(adminPassword);

    const newAdmin = new User({
        username,
        password: hashedPassword,
        name: "Esteban Quintana",
        role: "SUPERADMIN"
    });

    const response = await newAdmin.save();

    if (response.id) console.log("FIRST ADMIN CREATED:", username);
}

export const initDb = async () => {
    const { ADMIN_USERNAME: adminUsername  } = process.env;

    if (adminUsername) {
        await createAdmin(adminUsername);
    }
}