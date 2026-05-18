"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEyeSlash,
  faEye,
  faImages
} from "@fortawesome/free-solid-svg-icons";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons/faCircleUser";

interface User {
  id: number;
  nama: string;
  gambar: string | null;
}

export default function ProfileForm({ 
  user, 
  updateProfile 
}: { 
  user: User; 
  updateProfile: (formData: FormData) => Promise<void> 
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={updateProfile} className="space-y-8">
      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-6">
        <div className="relative group">
          <div className="avatar">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2.5rem] border-2 border-white/10 group-hover:border-orange-500/50 transition-all shadow-2xl overflow-hidden flex items-center justify-center">
              {user.gambar ? (
                <img
                  src={user.gambar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCircleUser}
                  className="text-[6rem] sm:text-[8rem] text-slate-400"
                />
              )}
            </div>
          </div>
          <label
            className="absolute bottom-1 right-1 w-10 h-10 sm:w-12 sm:h-12 btn btn-primary glass rounded-2xl flex items-center justify-center text-white cursor-pointer hover:bg-orange-500 transition-all shadow-xl group-hover:scale-110 border-none"
            style={{ backgroundColor: "rgb(234 88 12)" }}
          >
            <FontAwesomeIcon
              icon={faImages}
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
            <input
              type="file"
              name="gambar"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          Klik ikon kamera untuk ganti foto
        </p>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 gap-6">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text flex items-center gap-2 text-slate-300 font-medium">
              <FontAwesomeIcon
                icon={faUser}
                className="text-orange-500 w-3.5 h-3.5"
              />
              Nama User
            </span>
          </label>
          <input
            name="nama"
            type="text"
            defaultValue={user?.nama}
            placeholder="Nama Lengkap Anda"
            className="input input-bordered glass w-full text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500/50 transition-all duration-200"
            required
          />
        </div>

        <div className="form-control w-full relative">
          <label className="label">
            <span className="label-text flex items-center gap-2 text-slate-300 font-medium">
              <FontAwesomeIcon icon={faLock} className="text-orange-500 w-3.5 h-3.5" />
              Kata Sandi Baru
            </span>
          </label>

          <input
            name="kata_sandi"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="input input-bordered glass w-full text-white placeholder-white focus:ring-2 focus:ring-orange-500/50 transition-all duration-200 pr-10"
          />

          <button
            type="button"
            className="absolute right-3 top-[55%] text-slate-400 hover:text-orange-500 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="pt-6 flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          className="btn btn-primary glass flex-1 h-14 font-bold text-white bg-orange-600 border-none hover:bg-orange-500 active:scale-95 transition-all shadow-lg shadow-orange-600/20"
          style={{ backgroundColor: "rgb(234 88 12)" }}
        >
          Simpan Perubahan
        </button>
        <Link
          href="/presensi"
          className="btn btn-ghost glass flex-1 h-14 font-bold text-slate-200 border border-white/10 hover:bg-white/10 transition-all active:scale-95"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
