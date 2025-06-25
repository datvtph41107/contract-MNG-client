import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import react-router-dom hooks
import ProgressBarHeader from "./components/ProgressBarHeader/ProgressBarHeader";
import Stage1Draft from "./components/stages/StageDraft";
import Stage2Parties from "./components/stages/StageParties";
import Stage3Milestones from "./components/stages/Milestones/StageMilestones";
import Stage4Preview from "./components/stages/StagePreview";
import { useContractStore } from "~/store/contract-store";
import styles from "./ContractDaft.module.scss";
import classNames from "classnames/bind";
import { routes } from "~/config/routes.config";

const cx = classNames.bind(styles);

const ContractDaft = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const currentStage = Number.parseInt(params.get("stage") || "1");
    const currentContractType = params.get("type") || "basic";
    const { contractData, validateStage } = useContractStore();

    const [isVisible, setIsVisible] = useState(true);
    const [isAtTop, setIsAtTop] = useState(true);

    const lastScrollYRef = useRef(0);
    const tickingRef = useRef(false);
    const isVisibleRef = useRef(true);
    const isAtTopRef = useRef(true);

    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        const scrollThreshold = 100;
        const atTop = currentScrollY <= scrollThreshold;

        // Check if isAtTop has changed
        if (atTop !== isAtTopRef.current) {
            setIsAtTop(atTop);
            isAtTopRef.current = atTop;
        }

        if (atTop) {
            if (!isVisibleRef.current) {
                setIsVisible(true);
                isVisibleRef.current = true;
            }
        } else {
            const scrollingUp = currentScrollY < lastScrollYRef.current;
            const scrollingDown = currentScrollY > lastScrollYRef.current;

            if (Math.abs(currentScrollY - lastScrollYRef.current) > 10) {
                if (scrollingUp && !isVisibleRef.current) {
                    setIsVisible(true);
                    isVisibleRef.current = true;
                } else if (scrollingDown && isVisibleRef.current) {
                    setIsVisible(false);
                    isVisibleRef.current = false;
                }
            }
        }

        lastScrollYRef.current = currentScrollY;
    };

    useEffect(() => {
        const onScroll = () => {
            if (!tickingRef.current) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    tickingRef.current = false;
                });
                tickingRef.current = true;
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    useEffect(() => {
        if (currentStage < 1 || currentStage > 4) {
            navigate(`/${routes.createContract}?stage=1`); // Use navigate from react-router-dom
        }
    }, [currentStage, navigate]);

    useEffect(() => {
        if (currentStage > 1) {
            for (let i = 1; i < currentStage; i++) {
                if (!validateStage(i)) {
                    navigate(`/${routes.createContract}?stage=${i}`); // Use navigate to redirect
                    return;
                }
            }
        }
    }, [currentStage, validateStage, navigate]);

    const renderStage = () => {
        switch (currentStage) {
            case 1:
                return <Stage1Draft />;
            // case 2:
            //     return <Stage2Parties />;
            case 2:
                return <Stage3Milestones />;
            case 3:
                return <Stage4Preview />;
            default:
                return <Stage1Draft />;
        }
    };

    return (
        <div className={cx("wrapper", { collapse: isVisible })}>
            {currentContractType === "editor" && <ProgressBarHeader currentStage={currentStage} isVisible={isVisible} isAtTop={isAtTop} />}
            <div className={cx("container")}>{renderStage()}</div>
        </div>
    );
};

export default ContractDaft;
