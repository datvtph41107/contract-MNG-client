import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./CreateContract.module.scss";
import classNames from "classnames/bind";
// import { FaGoogle, FaFileImport, FaPlus } from "react-icons/fa";
import { faArrowPointer, faPlus } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

const CreateContract = () => {
    // const cards = [
    //     {
    //         icon: <FaGoogle size={28} />,
    //         title: "Create from Google Slides",
    //         description: "Use the Quizly slide Add-on",
    //         onClick: () => alert("Create from Google Slides"),
    //     },
    //     {
    //         icon: <FaFileImport size={28} />,
    //         title: "Import Slides",
    //         description: "From Google Drive or upload any PDF",
    //         onClick: () => alert("Import Slides"),
    //     },
    //     {
    //         icon: <FaPlus size={40} />,
    //         title: "Create from scratch",
    //         description: "Start by adding a new Slide",
    //         onClick: () => alert("Create from scratch"),
    //     },
    // ];

    return (
        <div className={cx("wrapper")}>
            <div className={cx("lesson-title")}>
                <span>Create a new Lesson</span>
            </div>
            <div className={cx("lesson-content")}>
                <div className={cx("lesson")}>
                    <div className={cx("description")}>
                        <h3>Create from Google Slides</h3>
                        <span>Use the Quizly slide Add-on</span>
                    </div>
                </div>
                <div className={cx("lesson")}>
                    <div className={cx("description")}>
                        <h3>Import Slides</h3>
                        <span>from Google Driver or upload any PDF</span>
                    </div>
                </div>
                <div className={cx("lesson")}>
                    <div className={cx("content")}>
                        <div className={cx("bg")}>
                            <FontAwesomeIcon className={cx("icon")} icon={faPlus} />
                        </div>
                    </div>
                    <div className={cx("poin")}>
                        <FontAwesomeIcon icon={faArrowPointer} />
                    </div>
                    <div className={cx("description")}>
                        <h3>Create from scratch</h3>
                        <span>Start by adding a new Slide</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateContract;
