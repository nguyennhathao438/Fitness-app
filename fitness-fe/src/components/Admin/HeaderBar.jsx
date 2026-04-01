import Notification from "./Notification";

export default function HeaderBar(){
    return(
        <div className="relative h-16 flex items-center justify-end px-6 bg-white shadow z-50">
            <Notification/>
        </div>
    )
}