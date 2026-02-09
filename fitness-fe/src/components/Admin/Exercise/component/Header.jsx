import { useState } from "react";
import ExerciseModal from "../modals/ExerciseModal";
import { HiPlus } from "react-icons/hi";

export default function Header() {
    const [openForm, setOpenForm] = useState(false)
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl text-purple-800 font-bold">Exercise Management</h1>
                    <p className="text-md text-purple-500">
                        Manage exercises and workout details
                    </p>
                </div>

                <button
                    onClick={() => { setOpenForm(true)}}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg"
                >
                    <HiPlus /> Thêm bài tập mới
                </button>
            </div>
            <ExerciseModal open={openForm} onClose={()=>setOpenForm(false)} title="Thêm bài tập"/>
        </div>
    );
}