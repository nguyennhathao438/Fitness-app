import Modal from "@/components/ui/modal";
import { HiX } from "react-icons/hi";

export default function OpenVideoModal({ open, onClose, videoUrl}) {
    return (
        <Modal open={open} onClose={onClose} title={"Video hướng dẫn"} bgColor={"bg-white"} width="max-w-4xl">
            

                <iframe
                    className="w-full h-[400px] rounded"
                    src={videoUrl.replace("watch?v=", "embed/")}
                    title="Exercise Video"
                    allowFullScreen
                />
       
        </Modal>
    )
}