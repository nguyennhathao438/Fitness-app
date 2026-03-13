// export default function Stepper({ step }) {
//   const steps = ["Current PT", "Save History", "Update Info"];

//   return (
//     <div className="flex items-center justify-center gap-8 py-6">
//       {steps.map((label, index) => {
//         const number = index + 1;
//         const active = step === number;
//         const done = step > number;

//         return (
//           <div key={label} className="flex flex-col items-center gap-2">
//             <div
//               className={`
//                 size-10 rounded-full flex items-center justify-center font-semibold
//                 ${active && "bg-fuchsia-500 text-white"}
//                 ${done && "bg-fuchsia-500 text-white"}
//                 ${!active && !done && "bg-gray-200 text-gray-500"}
//               `}
//             >
//               {number}
//             </div>
//             <span
//               className={`text-sm ${
//                 active ? "text-fuchsia-600 font-medium" : "text-gray-400"
//               }`}
//             >
//               {label}
//             </span>
//           </div>
//         );
//       })}
//     </div>
//   );
// }
