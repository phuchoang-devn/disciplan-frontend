import "./home_task_info.css"
import { TaskContext } from "../home.js";

import { MdModeEditOutline } from "react-icons/md";
import { FaXmark } from "react-icons/fa6";
import { IoTrashBinSharp } from "react-icons/io5";
import { PiBellSimpleFill } from "react-icons/pi";
import { useContext, memo, useEffect } from "react";

import moment from 'moment';


const TaskInfo = (props) => {
    const { id } = props
    const [ tasks, repetitions, setTaskInfo, setTaskEdit ] = useContext(TaskContext);

    let foundTask = tasks.current.filter(task => task.id === id)[0];
    let foundRepe = (foundTask.repetition_group) ? repetitions.current.filter(repe => repe.id === foundTask.repetition_group)[0] : undefined;

    return (
        <div className="task-info-container" onClick={() => setTaskInfo(NaN)} style={{background: "radial-gradient(#000000BF, "+foundTask.color+"BF)"}} >
            <div className="task-info" onClick={(e) => { e.stopPropagation() }} >
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
                        <div><IoTrashBinSharp /></div>
                        <div><PiBellSimpleFill /></div>
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
                    <div className="task-info__status"
                        style={{
                            backgroundImage: "linear-gradient(to right, var(--main-color) " + foundTask.status + "%, var(--secondary-50-opacity) " + (100 - foundTask.status) + "%)"
                        }}
                    ><b>{foundTask.status}%</b></div>
                </div>
            </div>
        </div>
    )
}

export default memo(TaskInfo);