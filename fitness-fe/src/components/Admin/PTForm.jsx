import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserIcon, UploadIcon, ShieldIcon } from "lucide-react";
import { useEffect } from "react";

const baseSchema = {
  name: z.string().min(3).regex(/^[A-Za-zÀ-ỹ\s]+$/),
  phone: z.string().regex(/^0\d{9}$/),
  email: z.string().email().regex(/\.com$/),
  gender: z.enum(["male", "female", "other"]).optional(),
  birthday: z.string().optional(),
};

const addSchema = z.object({
  ...baseSchema,
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
});

const editSchema = z.object(baseSchema);


export default function PTForm({ mode = "add", onSubmit, onClose ,pt}) {
  const schema = mode === "add" ? addSchema : editSchema;
  const { register, handleSubmit,reset,formState:{errors} } = useForm({
    resolver: zodResolver(schema),
    defaultValues:  {
    name: "",
    phone: "",
    email: "",
    gender: undefined,
    birthday: "",
    password: "",
  },
  });
  useEffect(() => {
  if (mode === "edit" && pt) {
    reset({
      name: pt.name,
      phone: pt.phone,
      email: pt.email,
      gender: pt.gender,
      birthday: pt.birthday? pt.birthday.split("T")[0]: "",
    });
  }

  if (mode === "add") {
    reset({
      name: "",
      phone: "",
      email: "",
      gender: undefined,
      birthday: "",
      password: "",
    });
  }
  }, [pt, mode, reset]);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
        sm:max-w-xl lg:min-w-4xl
        h-[100dvh] sm:h-[90dvh] md:h-[90dvh]
        bg-white rounded-none sm:rounded-xl
        flex flex-col
      "
    >
      {/* Header */}
      <div className="bg-purple-600 px-6 py-4 text-white">
        <h2 className="text-xl font-semibold">
          {mode === "add" ? "Add New PT" : "Edit PT"}
        </h2>
        <p className="text-sm opacity-90">
          Fill in the information details
        </p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 overflow-y-auto flex-1">
        {/* Basic Info */}
        <div>
          <div className="flex items-center gap-2 mb-4 ">
            <UserIcon className="bg-[#DBEAFE] rounded-md w-7 h-7 text-purple-600" />
            <h3 className="font-semibold text-lg">Basic Information</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left form */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                    label="Full Name" register={register("name")} 
                    className="text-[#000000]"
                    error={errors.name}
              />
              <select
                {...register("gender")}
                className=" w-full mt-1 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none
                focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <Input 
                    label="Date of birth" 
                    register={register("birthday")} 
                    type="date"
              />
              <Input 
                    label="Phone" 
                    register={register("phone")} 
                    type="text"
                    error={errors.phone}
              />

              <Input
                label="Email"
                register={register("email")}
                error={errors.email}
              />

              {mode === "add" && <Input label="Password" type="password"  register={register("password")} error={errors.password} />}
            </div>

            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-full aspect-square bg-gray-200 rounded-lg" />
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg"
              >
                <UploadIcon className="size-4" />
                Choose image
              </button>
            </div>
          </div>
        </div>

        {/* Role / Permission */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldIcon className="size-5 text-purple-600" />
            <h3 className="font-semibold text-lg">Role</h3>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Permission name</th>
                  <th className="px-4 py-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-gray-400">
                  <td className="px-4 py-3" colSpan={2}>
                    No permissions yet
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Permissions auto-update based on role, but can be manually overridden
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-3 px-4 py-4 border-t sticky bottom-0 bg-white justify-center">
      <button className="w-32 px-4 py-3 border rounded-lg hover:bg-gray-200" onClick={onClose}>
        Huỷ
      </button>
      <button className="w-32 bg-purple-600 text-white rounded-lg hover:bg-purple-300">
        Xác nhận
      </button>
      </div>
    </form>
  );
}

/* ---------- Small UI helpers ---------- */

function Input({ label, type = "text", register, error, className = "" }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>

      <input
        type={type}
        {...register}
        className={`
          w-full mt-1 px-3 py-2 border rounded-lg outline-none font-medium
          ${error ? "border-red-500 bg-red-50" : "border-gray-300 bg-[#eeeeee]"}
          ${className}
        `}
      />

      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error.message}
        </p>
      )}
    </div>
  );
}


