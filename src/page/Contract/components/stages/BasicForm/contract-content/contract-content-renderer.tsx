import { EmploymentContent } from "./employment-content";
import { ServiceContent } from "./service-content";
import { PartnershipContent } from "./partnership-content";
import { RentalContent } from "./rental-content";
import { ConsultingContent } from "./consulting-content";
import { TrainingContent } from "./training-content";
import { NdaContent } from "./nda-content";

interface ContractContentRendererProps {
    contractType: string;
}

export const ContractContentRenderer = ({ contractType }: ContractContentRendererProps) => {
    switch (contractType) {
        case "employment":
            return <EmploymentContent />;
        case "service":
            return <ServiceContent />;
        case "partnership":
            return <PartnershipContent />;
        case "rental":
            return <RentalContent />;
        case "consulting":
            return <ConsultingContent />;
        case "training":
            return <TrainingContent />;
        case "nda":
            return <NdaContent />;
        default:
            return null;
    }
};
