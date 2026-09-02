import Link from "next/link";
import Footer from "@/components/Footer";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  Crown,
  HandHeart,
  Landmark,
  Network,
  ShieldCheck,
  Users,
} from "lucide-react";

export const metadata = {
  title: "Profile Yayasan & DKM | Masjid Raya Puri Telukjambe",
  description:
    "Profil Yayasan Masjid Raya Puri Telukjambe, visi misi, dan struktur Dewan Kemakmuran Masjid periode 2026-2030.",
};

const missions = [
  "Menyelenggarakan ibadah dengan prasarana dan sarana yang aman dan nyaman.",
  "Mengadakan kegiatan da'wah secara santun, teratur dan terencana dalam rangka membina iman, taqwa, dan akhlaq mulia.",
  "Mengadakan kegiatan ekonomi syari'ah yang berbasis ummat.",
  "Melakukan pembinaan kegiatan sosial secara amanah.",
  "Meningkatkan sistem pengelolaan manajemen masjid dengan SDM profesional, berbasis teknologi informasi.",
  "Melakukan pembinaan insan sejak usia dini untuk melahirkan generasi yang berakhlaqul kariimah.",
];

const leadership = [
  { role: "Ketua DKM", name: "Ust. Deden Sajidin, Lc.", icon: Crown },
  { role: "Wakil Ketua", name: "H. Agi Ginanjar, MA", icon: ShieldCheck },
  { role: "Sekretaris", name: "H. Wahyu Ika P.", icon: BadgeCheck },
  { role: "Humas", name: "Suhanda", icon: Users },
  { role: "Bendahara", name: "Sugito", icon: Landmark },
  {
    role: "Teknologi Informasi",
    name: "Andi Hatta & Agus Sartono",
    icon: Network,
  },
];

const divisions = [
  {
    title: "Bidang Imaroh",
    coordinator: "H. Wagiran",
    sections: [
      {
        name: "Seksi Peribadatan & Da'wah",
        people: ["H. Romeli", "Ahmad Sulton", "H. Firdaus"],
      },
      {
        name: "Seksi Maj'lis Ta'lim Tarbiyyatul Ummahat",
        people: [
          "Ketua: Hj. Nurhasanah",
          "Wakil Ketua: Hj. Herawati",
          "Sekretaris: Hj. Titin",
          "Bendahara: Hj. Sri Lestari",
        ],
      },
      {
        name: "Seksi Remaja Masjid",
        people: ["Ust. Dadang S."],
      },
    ],
  },
  {
    title: "Bidang Ri'ayah",
    coordinator: "H. Sukardi",
    sections: [
      {
        name: "Seksi Umum",
        people: ["Sriyono", "Sumadi", "Sutardi"],
      },
      {
        name: "Seksi Teknik",
        people: ["Eko Risdiyanto", "Madafi"],
      },
      {
        name: "Seksi Keamanan",
        people: ["Moelyanto", "H. Asep Kosasih", "Supriyono"],
      },
    ],
  },
];

export default function ProfileYayasanDkmPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden emerald-gradient text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,#f59e0b_0,transparent_26%),radial-gradient(circle_at_80%_0%,#ffffff_0,transparent_22%)]" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-14">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-100 hover:text-amber-300 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-400 text-emerald-950 px-3 py-1 text-[11px] font-black uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                Profile Yayasan / DKM
              </span>
              <h1 className="mt-4 text-3xl md:text-5xl font-black tracking-tight leading-tight">
                Yayasan Masjid Raya Puri Telukjambe
              </h1>
              <p className="mt-4 max-w-3xl text-sm md:text-base text-emerald-100 leading-relaxed">
                Profil kelembagaan, arah pembinaan, dan struktur Dewan
                Kemakmuran Masjid Raya Puri Telukjambe untuk periode 1 Agustus
                2026 sampai 31 Juli 2030.
              </p>
            </div>
            <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">
                Lampiran Struktur
              </p>
              <p className="mt-2 text-sm font-extrabold text-white">
                SKEP 014/YMRPTJ/VIII/2026
              </p>
              <p className="mt-1 text-xs text-emerald-200">
                Dewan Kemakmuran Masjid Raya Puri Telukjambe
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-100 card-shadow p-6 md:p-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <HandHeart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Visi
                </p>
                <h2 className="text-xl font-black text-slate-900">
                  Arah Pembinaan Masjid
                </h2>
              </div>
            </div>
            <p className="mt-6 text-2xl md:text-3xl font-black leading-tight text-emerald-900">
              Menjadi pusat pembinaan iman, Islam, ihsan, untuk mewujudkan
              ukhuwah dan kemakmuran ummat.
            </p>
            <div className="mt-6 h-1.5 w-24 rounded-full bg-amber-400" />
            <p className="mt-5 text-xs text-slate-500">
              Ditandatangani oleh H. Ashari selaku Ketua Yayasan Masjid Raya
              Puri Telukjambe.
            </p>
          </div>

          <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-100 card-shadow p-6 md:p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Misi
                </p>
                <h2 className="text-xl font-black text-slate-900">
                  Program Pengelolaan & Pembinaan
                </h2>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-50 text-emerald-800 px-3 py-1 text-[10px] font-bold">
                {missions.length} Fokus
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {missions.map((mission, index) => (
                <div
                  key={mission}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                >
                  <span className="text-[10px] font-black text-amber-600">
                    0{index + 1}
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700 font-medium">
                    {mission}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-100 card-shadow p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-7">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Struktur Organisasi
              </p>
              <h2 className="text-2xl font-black text-slate-900">
                Dewan Kemakmuran Masjid 2026-2030
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Periode 1 Agustus 2026 - 31 Juli 2030.
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 px-4 py-3 text-xs text-emerald-900 font-bold">
              Yayasan Masjid Raya Puri Telukjambe
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {leadership.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.role}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-white text-emerald-700 flex items-center justify-center border border-slate-100">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    {item.role}
                  </p>
                  <p className="mt-1 text-sm font-extrabold text-slate-900">
                    {item.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {divisions.map((division) => (
            <div
              key={division.title}
              className="rounded-2xl bg-white border border-slate-100 card-shadow p-6"
            >
              <div className="pb-4 border-b border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Bidang
                </p>
                <h3 className="text-xl font-black text-slate-900">
                  {division.title}
                </h3>
                <p className="mt-1 text-sm font-bold text-emerald-800">
                  Koordinator: {division.coordinator}
                </p>
              </div>
              <div className="mt-5 space-y-4">
                {division.sections.map((section) => (
                  <div
                    key={section.name}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <p className="text-sm font-extrabold text-slate-900">
                      {section.name}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {section.people.map((person) => (
                        <span
                          key={person}
                          className="rounded-full bg-white border border-slate-200 px-3 py-1 text-[11px] font-bold text-slate-700"
                        >
                          {person}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
