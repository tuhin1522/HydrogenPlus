import { UserRole } from "@/generated/prisma";
import { prisma } from "../lib/prisma";
import { envVars } from "../config/envVars";
import bcryptjs from "bcryptjs";

export const seedSuperAdmin = async () => {
    try {
        // Check if a super admin already exists
        const isSuperAdminExist = await prisma.user.findFirst({
            where: { role: UserRole.SUPER_ADMIN },
        });

        if (isSuperAdminExist) {
            console.log("Super admin already exists. Skipping seeding.");
            return;
        }

        // Hash the password before storing
        const hashedPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD, 12);
        const superAdminPhone = envVars.SUPER_ADMIN_PHONE ?? "01000000000";

        const superAdmin = await prisma.$transaction(async (tx) => {
            // Create the super admin User directly via Prisma
            const user = await tx.user.create({
                data: {
                    name: "Super Admin",
                    email: envVars.SUPER_ADMIN_EMAIL,
                    password: hashedPassword,
                    phone: superAdminPhone,
                    role: UserRole.SUPER_ADMIN,
                    emailVerified: true,
                    isActive: true,
                },
            });

            // Create the Admin profile
            const admin = await tx.admin.create({
                data: {
                    userId: user.id,
                    name: "Super Admin",
                    email: envVars.SUPER_ADMIN_EMAIL,
                    contactNumber: superAdminPhone,
                }
            });

            return { user, admin };
        });

        console.log("✅ Super Admin seeded successfully:", {
            id: superAdmin.user.id,
            email: superAdmin.user.email,
            role: superAdmin.user.role,
            adminProfileId: superAdmin.admin.id
        });
    } catch (error) {
        console.error("❌ Error seeding super admin:", error);
    }
};