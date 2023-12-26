import "./home_task_info.css"
import { TaskContext } from "../home.js";
import deleteTask from "../crud/delete_task.js"
import UpdateForGroupWindow from "./update_group_window.js"

import { MdModeEditOutline } from "react-icons/md";
import { FaXmark } from "react-icons/fa6";
import { IoTrashBinSharp } from "react-icons/io5";
import { useContext, memo, useState } from "react";

import moment from 'moment';


const TaskInfo = (props) => {
    const { id } = props
    const [tasks, repetitions, setTaskInfo, setTaskEdit, loading, setLoading, datePointer] = useContext(TaskContext);
    const [updateTypeWindow, setUpdateTypeWindow] = useState(false);
    const [updateType, setUpdateType] = useState(undefined);

    const foundTask = tasks.current.filter(task => task.id === id)[0];
    const foundRepe = (foundTask.repetition_group) ? repetitions.current.filter(repe => repe.id === foundTask.repetition_group)[0] : undefined;

    const handleDelete = () => {
        if (!!foundRepe && !updateType) {
            setUpdateTypeWindow(true);
            return
        }
        deleteTask(foundTask, updateType, tasks, repetitions, loading, setLoading, datePointer);
        setTaskInfo(NaN);
    }

    return (
        <div className="task-info-container" onMouseDown={() => setTaskInfo(NaN)} style={{ background: "radial-gradient(#000000BF, " + foundTask.color + "BF)" }} >
            {
                updateTypeWindow ?
                    <UpdateForGroupWindow
                        setUpdateTypeWindow={setUpdateTypeWindow}
                        updateType={updateType}
                        setUpdateType={setUpdateType}
                        handleSubmit={handleDelete} />
                    : null
            }
            <div className="task-info" onMouseDown={(e) => { e.stopPropagation() }} >
                <div className="task-info__header">
                    <div className="task-info__meta">
                        <div className="task-info__name">{foundTask.name}</div>
                        {
                            (foundTask.date_start === foundTask.date_end) ?
                                <div><b>{moment(foundTask.date_start).format("D MMM YYYY")}</b></div>
                                : <div><b>{moment(foundTask.date_start).format("D MMM YYYY")} - {moment(foundTask.date_end).format("D MMM YYYY")}</b></div>
                        }
                        {
                            foundTask.time_start ?
                                <div><b>{moment(foundTask.time_start, "HH:mm:ss").format("HH:mm")} - {moment(foundTask.time_end, "HH:mm:ss").format("HH:mm")}</b></div>
                                : null
                        }
                        {
                            foundRepe ?
                                <div>Every {foundRepe.frequency} {foundRepe.frequency_unit}</div>
                                : null
                        }
                        {
                            foundTask.description ?
                                <div className="task-info__desc">{foundTask.description}</div>
                                : null
                        }
                    </div>
                    <div className="task-info__option">
                        <div onClick={() => setTaskInfo(NaN)}><FaXmark /></div>
                        <div onClick={() => {
                            setTaskInfo(NaN);
                            setTaskEdit({
                                type: "update",
                                task: foundTask,
                                repe: foundRepe
                            });
                        }}><MdModeEditOutline /></div>
                        <div onClick={() => handleDelete()}><IoTrashBinSharp /></div>
                    </div>
                </div>
                <div className="task-info-footer">
                    <div className="task-info__tag-container">
                        {
                            foundTask.tags ?
                                foundTask.tags.map((tag) => (
                                    <div key={tag.id}
                                        className="task-info__tag"
                                        style={{
                                            backgroundColor: tag.color
                                        }}><b>#{tag.name}</b></div>
                                ))
                                : null
                        }
                    </div>
                    <div className="task-info__status-bar">
                        <div className="task-info__status-completed" style={{ width: foundTask.status + "%" }}>
                            {
                                (foundTask.status >= 50) ?
                                    <div className="task-info__status-titleOver50"><b>{foundTask.status}%</b></div>
                                    : null
                            }
                        </div>
                        {
                            (foundTask.status < 50) ?
                                <div className="task-info__status-titleUnder50"><b>{foundTask.status}%</b></div>
                                : null
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(TaskInfo);