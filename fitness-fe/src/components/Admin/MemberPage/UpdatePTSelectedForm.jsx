import { useState } from "react";
import { CurrentPTStep } from "./CurrentPTStep";
import ExpirePTStep from "./ExpirePTStep";
import PTSelectedForm from "./PTSeletedForm";
import { UpdatePTHeader } from "./UpdatePTHeader";
import { cancelPTForMember, selectedPTForMember, updatedPTForMember } from "@/services/admin/PersonalTrainerService";
import { toast } from "react-toastify";

export default function UpdatePTSelectedForm({member,onSuccess,onChange}) {
  const [step, setStep] = useState(1);
  const activePT = member?.activept;
  const [loading, setLoading] = useState(false);
  const handleCancel = async () => {
    setLoading(true);
    try {
      console.log("pt_id",activePT.pt_id);
      await cancelPTForMember({
        member_id: member.id,
        pt_id: activePT.pt_id
      });
      onSuccess?.()
      toast.success("Bỏ PT thành công");
    } catch (e) {
      console.error("Cancel PT failed", e);
    } finally {
      setLoading(false);
    }
  } 
  const ExpiredAndSave = async () => {
    setLoading(true);
    try {
      console.log("pt_id",activePT.pt_id);
      await updatedPTForMember({
        member_id: member.id,
        pt_id: activePT.pt_id
      });
      setStep(3);
      onChange?.()  
    } catch (e) {
      console.error("expired PT and save failed", e);
    } finally {
      setLoading(false);
    }
  }
  const handleAssignNewPT = async (ptId) => {
    setLoading(true);
    try {
      await selectedPTForMember({
        member_id: member.id,
        pt_id: ptId,
      });
      onSuccess?.();
      toast.success("Thay đổi PT thành công");
    } catch (e) {
      console.error("Assign PT failed", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-xl overflow-hidden">
      <UpdatePTHeader member={member}/>

      {step === 1 && activePT?.pt && (
        <CurrentPTStep
          pt={activePT.pt}
          startDate={activePT.start_date}
          endDate={activePT.end_date}
          loading={loading}          
          onNext={() => setStep(2)}
          onRemove={handleCancel}
        />
      )}

      {step === 2 && <ExpirePTStep onBack={() => setStep(1)} onExpire={ExpiredAndSave} loading={loading}/>}

      {step === 3 && <PTSelectedForm onSubmit={handleAssignNewPT}/>}
    </div>
  );
}
