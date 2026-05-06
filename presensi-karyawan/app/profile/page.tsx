import React from "react";
import prisma from "../lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import ProfileForm from "./ProfileForm";

export default async function Page() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId, 10) },
  });

  if (!user) {
    redirect("/");
  }

  async function updateProfile(formData: FormData) {
    "use server";
    const nama = formData.get("nama") as string;
    const kata_sandi_baru = formData.get("kata_sandi") as string;
    const file = formData.get("gambar") as File | null;

    let gambarPath = user?.gambar || null;

    // Handle Image Upload
    if (file && file.size > 0 && user) {
      const fs = await import("fs/promises");
      const path = await import("path");

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public", "uploads");
      try {
        await fs.access(uploadDir);
      } catch (e) {
        await fs.mkdir(uploadDir, { recursive: true });
      }

      const filename = `${user.id}-${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const filePath = path.join(uploadDir, filename);

      await fs.writeFile(filePath, buffer);
      gambarPath = `/uploads/${filename}`;
    }

    if (user && nama) {
      const updateData: any = {
        nama,
        gambar: gambarPath
      };

      // Hanya update password jika diisi (dan hash dengan bcrypt)
      if (kata_sandi_baru && kata_sandi_baru.trim() !== "") {
        const salt = await bcrypt.genSalt(10);
        updateData.kata_sandi = await bcrypt.hash(kata_sandi_baru, salt);
      }

      await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });
    }

    revalidatePath("/profile");
    redirect("/presensi");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 flex items-center justify-center p-4">
      {/* Background Animated Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orange-600/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />

      {/* Profile Card */}
      <div className="card glass backdrop-blur-2xl relative z-10 w-full max-w-xl p-8 sm:p-12 shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-white bg-linear-to-r from-white to-white/70">
            Profil Saya
          </h1>
          <p className="text-slate-400">Atur profil dan informasi akun Anda</p>
        </div>

        <ProfileForm user={user} updateProfile={updateProfile} />
      </div>
    </main>
  );
}
