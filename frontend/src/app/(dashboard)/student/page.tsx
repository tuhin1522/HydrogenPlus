// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function StudentDashboard() {
//   const [user, setUser] = useState<any>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     const token = localStorage.getItem("token");

//     if (!token || !userData) {
//       router.push("/login");
//       return;
//     }

//     try {
//       setUser(JSON.parse(userData));
//     } catch (e) {
//       router.push("/login");
//     }
//   }, [router]);

//   if (!user) {
//     return <div className="flex h-screen items-center justify-center bg-[#081717] text-[#F3F7F6]">Loading...</div>;
//   }

//   return (
//     <div className="min-h-screen bg-[#081717] text-[#F3F7F6]">
//       <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
//         <div className="rounded-3xl border border-[#1D3E3E] bg-[#0A2324] p-8 shadow-2xl">
//           <h1 className="text-3xl font-bold">
//             Welcome My student <span className="text-[#86F05C]">{user.name}</span>
//           </h1>
//           <p className="mt-4 text-[#A9B7B4]">
//             This is your student dashboard. You have successfully logged in.
//           </p>
//         </div>
//       </main>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/app/modules/super-admin/types";


export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser: User = JSON.parse(userData);
      setUser(parsedUser);
    } catch {
      router.push("/login");
    }
  }, [router]);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#081717] text-[#F3F7F6]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#081717] text-[#F3F7F6]">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[#1D3E3E] bg-[#0A2324] p-8 shadow-2xl">
          <h1 className="text-3xl font-bold">
            Welcome My Student{" "}
            <span className="text-[#86F05C]">{user.name}</span>
          </h1>

          <p className="mt-4 text-[#A9B7B4]">
            This is your student dashboard. You have successfully logged in.
          </p>

          <div className="mt-8 space-y-2 rounded-xl border border-[#1D3E3E] bg-[#081717] p-4">
            <p>
              <span className="font-semibold">Name:</span> {user.name}
            </p>

            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>

            <p>
              <span className="font-semibold">Role:</span> {user.role}
            </p>

            {user.phone && (
              <p>
                <span className="font-semibold">Phone:</span> {user.phone}
              </p>
            )}

            <p>
              <span className="font-semibold">Status:</span>{" "}
              {user.isActive ? "Active" : "Inactive"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}