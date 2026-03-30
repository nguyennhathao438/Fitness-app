import { useState } from "react";
import ExerciseModal from "../modals/ExerciseModal";
import { HiPlus } from "react-icons/hi";
export default function Header() {
    const [openForm, setOpenForm] = useState(false);

    return (
        <div className="mb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                {/* LEFT */}
                <div className="text-center md:text-left">
                    <div className="flex justify-center">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                            Exercise Management
                        </h1>
                    </div>

                    <p className="text-slate-500 mt-1 font-medium md:text-base">
                        Quản lý bài tập của hội viên
                    </p>
                </div>

                {/* RIGHT */}
                <button
                    onClick={() => setOpenForm(true)}
                    className="
          flex items-center justify-center gap-2
          px-4 py-2
          bg-gradient-to-r from-purple-600 to-fuchsia-600
          hover:from-purple-700 hover:to-fuchsia-700
          text-white
          rounded-xl
          shadow-sm
          transition
          text-sm md:text-base
          w-full md:w-auto
          "
                >
                    <HiPlus className="text-lg" />
                    Add Exercise
                </button>

            </div>

            <ExerciseModal
                open={openForm}
                onClose={() => setOpenForm(false)}
                title="Thêm bài tập"
            />
        </div>
    );
}