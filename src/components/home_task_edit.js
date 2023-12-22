import "./home_task_edit.css"
import { TaskContext } from "../home.js";
import UpdateForGroup from "./update_type.js"
import updateTask from "../crud/update_task.js"

import moment from 'moment';
import { useState, useContext, useEffect, memo } from "react";
import DatePicker from "react-datepicker";

import { PiPlusSquareFill } from "react-icons/pi";
import { PiMinusSquareFill } from "react-icons/pi";
import { PiBellSimpleFill } from "react-icons/pi";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { FaTag } from "react-icons/fa";
import { FaMinusCircle } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { FaArchive } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import { GrPowerReset } from "react-icons/gr";
import { FaPlus } from "react-icons/fa";

import "react-datepicker/dist/react-datepicker.css";



const TaskEdit = (props) => {
    const { taskEdit, tags, defColor } = props;
    const [tasks, repetitions, , setTaskEdit, loading, setLoading, datePointer] = useContext(TaskContext);
    const allPriority = ["low", "medium", "high", "critical"];
    const allTimeUnit = ["Minutes", "Hours", "Days", "Weeks"];
    const allMainFreqUnit = ["day", "week", "month", "year"];

    const isUpdate = taskEdit.type === "update"
    const [tName, setTName] = useState(isUpdate ? taskEdit.task.name : "");
    const [desc, setDesc] = useState(isUpdate ? taskEdit.task.description : "");
    const [priority, setPriority] = useState(isUpdate ? taskEdit.task.priority : "medium");
    const [dateStart, setDateStart] = useState(isUpdate ? taskEdit.task.date_start : taskEdit.date_start);
    const [dateEnd, setDateEnd] = useState(isUpdate ? taskEdit.task.date_end : taskEdit.date_end);
    const [timeStart, setTimeStart] = useState(isUpdate ? taskEdit.task.time_start : taskEdit.time_start);
    const [timeEnd, setTimeEnd] = useState(isUpdate ? taskEdit.task.time_end : taskEdit.time_end);
    const [status, setStatus] = useState(isUpdate ? taskEdit.task.status : 0);
    const [notification, setNotification] = useState(isUpdate ? taskEdit.task.notification : null);
    const [notifiTimeUnitIndex, setNotifiTimeUnitIndex] = useState(0);
    const [isArchived, setIsArchived] = useState(isUpdate ? taskEdit.task.is_archived : false);
    const [selectedTagIds, setSelectedTagIds] = useState(isUpdate ? taskEdit.task.tags.map(tag => tag.id) : []);
    const [tColor, setTColor] = useState(isUpdate ? taskEdit.task.color : defColor.current[priority]);

    const [hasRepe, setHasRepe] = useState(isUpdate && (taskEdit.task.repetition_group !== null));
    const [repeEnd, setRepeEnd] = useState(hasRepe ? taskEdit.repe.repetition_end : taskEdit.date_start);
    const [freq, setFreq] = useState(hasRepe ? taskEdit.repe.frequency : 1);
    const [freqUnit, setFreqUnit] = useState(hasRepe ? taskEdit.repe.frequency_unit : "day");
    const [mainFreqUnit, setMainFreqUnit] = useState(allMainFreqUnit.includes(freqUnit) ? freqUnit : allMainFreqUnit[2]);
    const [subFreqUnit, setSubFreqUnit] = useState();

    const [updateTypeWindow, setUpdateTypeWindow] = useState(false);
    const [updateType, setUpdateType] = useState(undefined);

    useEffect(() => {
        var value = !allMainFreqUnit.includes(freqUnit) ? getSubFreqValue(freqUnit, dateStart) : getSubFreqValue("month", dateStart);
        setSubFreqUnit(value);
    }, [])

    const getSubFreqValue = (freqU, date) => {
        date = moment(date, "YYYY-MM-DD");
        if (freqU === "order_of_week") {
            var weekday = date.format("dddd");
            var order = parseInt((date.date() - 1) / 7 + 1);
            if (order === 5) return undefined
            return `Monthly on ${order}. ${weekday}`
        }
        if (freqU === "last_week_month") {
            var numberDatesInMonth = date.daysInMonth();
            var order = parseInt((date.date() - 1) / 7 + 1);
            if ((order <= 3) || (date.date() + 7 <= numberDatesInMonth)) return undefined
            var weekday = date.format("dddd");
            return `Monthly on last ${weekday}`
        }
        if (freqU === "month") {
            return `Monthly on ${date.date()}.`
        }
        if (freqU === "all") {
            var returnValue = [
                ["month", `Monthly on ${date.date()}.`]
            ];
            var last = getSubFreqValue("last_week_month", date);
            var orderInMonth = getSubFreqValue("order_of_week", date);
            if (orderInMonth) returnValue.push(["order_of_week", orderInMonth]);
            if (last) returnValue.push(["last_week_month", last]);
            return returnValue;
        }
    }

    const handleSubmit = () => {
        var changeOnInfo = false;
        var changeOnRepe = false;

        var newNotification =
            (notification === null) ? notification :
                (notifiTimeUnitIndex === "Minutes") ? notification :
                    (notifiTimeUnitIndex === "Hours") ? notification * 60 :
                        (notifiTimeUnitIndex === "Days") ? notification * 60 * 24 :
                            notification * 60 * 24 * 7;

        var old_tags = taskEdit.task.tags.map(tag => tag.id);

        if (tName !== taskEdit.task.name
            || desc !== taskEdit.task.description
            || priority !== taskEdit.task.priority
            || dateStart !== taskEdit.task.date_start
            || dateEnd !== taskEdit.task.date_end
            || timeStart !== taskEdit.task.time_start
            || timeEnd !== taskEdit.task.time_end
            || status !== taskEdit.task.status
            || newNotification !== taskEdit.task.notification
            || isArchived !== taskEdit.task.is_archived
            || tColor !== taskEdit.task.color
            || old_tags.filter(id => !selectedTagIds.includes(id)).length !== 0
            || selectedTagIds.filter(id => !old_tags.includes(id)).length !== 0) changeOnInfo = true

        if (changeOnInfo && !!taskEdit.task.repetition_group && !updateType) {
            setUpdateTypeWindow(true);
            return
        }

        if (!!taskEdit.task.repetition_group !== hasRepe
            || taskEdit.repe.repetition_end !== repeEnd
            || taskEdit.repe.frequency !== freq
            || taskEdit.repe.frequency_unit !== freqUnit) changeOnRepe = true

        if (!changeOnInfo && !changeOnRepe) setTaskEdit(undefined)
        else {
            var info = changeOnInfo ?
                {
                    name: tName,
                    description: desc,
                    priority: priority,
                    date_start: dateStart,
                    time_start: timeStart,
                    date_end: dateEnd,
                    time_end: timeEnd,
                    status: status,
                    color: tColor,
                    notification: newNotification,
                    is_archived: isArchived,
                    tags: selectedTagIds
                }
                : null

            var repetition = changeOnRepe ?
                {
                    repetition_end: repeEnd,
                    frequency: freq,
                    frequency_unit: freqUnit
                }
                : null

            var data = {
                info: info,
                repetition: repetition
            }
            updateTask(taskEdit.task, data, updateType, tasks, repetitions, loading, setLoading, datePointer);
        }
    }

    return (
        <div className="task-edit-container" onClick={() => setTaskEdit(undefined)} style={{ background: "radial-gradient(#000000BF, " + tColor + "BF)" }}>
            {
                updateTypeWindow ?
                    <UpdateForGroup
                        setUpdateTypeWindow={setUpdateTypeWindow}
                        updateType={updateType}
                        setUpdateType={setUpdateType}
                        handleSubmit={handleSubmit} 
                        setTaskEdit={setTaskEdit} />
                    : null
            }
            <div className="task-edit" onClick={e => e.stopPropagation()}>
                <div className="task-edit__header">
                    <div className="task-edit__meta">
                        <div className="task-edit__start">
                            <div className="task-edit__start-icon"><AiFillEdit /></div>
                            <p className="task-edit__name-container">
                                <input className="task-edit__name"
                                    type="text"
                                    placeholder="Task Name"
                                    defaultValue={tName}
                                    onChange={e => setTName(e.target.value)} />
                            </p>
                        </div>
                        <div className="task-edit__datepicker">
                            <h4 className="task-edit__datepicker-title" > From </h4>
                            <DatePicker
                                className="task-edit__datepicker-input"
                                selected={new Date(dateStart)}
                                dateFormat="MMMM d, yyyy"
                                onChange={e => setDateStart(moment(e).format("YYYY-MM-DD"))}
                            />
                            <h4 className="task-edit__datepicker-title" > to </h4>
                            <DatePicker
                                className="task-edit__datepicker-input"
                                selected={new Date(dateEnd)}
                                dateFormat="MMMM d, yyyy"
                                onChange={e => setDateEnd(moment(e).format("YYYY-MM-DD"))}
                            />
                        </div>
                        <div className="task-edit__timepicker">
                            <h4 className="task-edit__datepicker-title" > Start </h4>
                            <input
                                type="time"
                                className="timepicker__input"
                                defaultValue={timeStart}
                                onChange={e => setTimeStart(e.target.value + ":00")}
                            ></input>
                            <h4 className="task-edit__datepicker-title" > to </h4>
                            <input
                                type="time"
                                className="timepicker__input"
                                defaultValue={timeEnd}
                                onChange={e => setTimeEnd(e.target.value + ":00")}
                            ></input>
                        </div>
                        <p className="task-edit__desc-container">
                            <textarea
                                className="task-edit__desc"
                                placeholder="Description"
                                defaultValue={desc}
                                onChange={desc => setDesc(desc)}
                            ></textarea >
                        </p>

                        <div className='task-edit__priority-color'>
                            <div
                                className="task-edit__priority-btn"
                                onClick={() => {
                                    let currentValue = allPriority.indexOf(priority);
                                    if (currentValue - 1 >= 0) {
                                        let newValue = allPriority[currentValue - 1];
                                        setPriority(newValue);
                                        if (tColor === defColor.current[priority]) setTColor(defColor.current[newValue]);
                                    }
                                }}
                            ><PiMinusSquareFill /></div>
                            <div
                                className='task-edit__priority-selected'
                                style={{ background: defColor.current[priority] + "BF" }}
                            ><b>{priority}</b></div>
                            <div
                                className="task-edit__priority-btn"
                                onClick={() => {
                                    let currentValue = allPriority.indexOf(priority);
                                    if (currentValue + 1 < allPriority.length) {
                                        let newValue = allPriority[currentValue + 1];
                                        setPriority(newValue);
                                        if (tColor === defColor.current[priority]) setTColor(defColor.current[newValue]);
                                    }
                                }}
                            ><PiPlusSquareFill /></div>
                            <span className="task-edit__color-title">Color</span>
                            <input
                                className="task-edit__color-input"
                                type="color"
                                value={tColor}
                                onChange={(e) => setTColor(e.target.value)} />
                            <div className="task-edit__color-reset"
                                onClick={() => { setTColor(defColor.current[priority]) }}><GrPowerReset /></div>
                        </div>
                        <div className="task-edit__notification">
                            {
                                !notification ?
                                    <div
                                        type="button"
                                        className="task-edit__notification-modify"
                                        onClick={() => setNotification(1)}>
                                        <div className="task-edit__notification-modify-icon"><PiBellSimpleFill /></div>
                                        <span>Add notification</span>
                                    </div>
                                    :
                                    <>
                                        <div
                                            type="button"
                                            className="task-edit__notification-modify"
                                            style={{ backgroundColor: "#8e0000" }}
                                            onClick={() => setNotification(null)}>
                                            <div className="task-edit__notification-modify-icon"><FaXmark /></div>
                                            <span>Clear notification</span>
                                        </div>
                                        <div className="task-edit__repe-edit">
                                            <input
                                                className='task-edit__notification-number'
                                                type="number"
                                                min="1"
                                                value={notification}
                                                onChange={e => setNotification(e.target.value)} />
                                            <div type="button"
                                                className="task-edit__notification-btn"
                                                onClick={() => {
                                                    let newValue = notifiTimeUnitIndex - 1;
                                                    if (newValue >= 0) setNotifiTimeUnitIndex(newValue);
                                                }}
                                            ><FaChevronLeft /></div>
                                            <div className='task-edit__notification-selected'><b>{allTimeUnit[notifiTimeUnitIndex]}</b></div>
                                            <div type="button"
                                                className="task-edit__notification-btn"
                                                onClick={() => {
                                                    let newValue = notifiTimeUnitIndex + 1;
                                                    if (newValue < allTimeUnit.length) setNotifiTimeUnitIndex(newValue);
                                                }}
                                            ><FaChevronRight /></div>
                                        </div>
                                    </>

                            }
                        </div>
                        <div className="task-edit__repe">
                            {
                                !hasRepe ?
                                    <div
                                        type="button"
                                        className="task-edit__repe-modify"
                                        onClick={() => setHasRepe(data => !data)}>
                                        <div className="task-edit__repe-modify-icon"><FaPlus /></div>
                                        <span>Add Repetition</span>
                                    </div>
                                    :
                                    <>
                                        <div
                                            type="button"
                                            className="task-edit__repe-modify"
                                            style={{ backgroundColor: "#8e0000" }}
                                            onClick={() => setHasRepe(data => !data)}>
                                            <div className="task-edit__repe-modify-icon"><FaXmark /></div>
                                            <span>Clear Repetition</span>
                                        </div>
                                        <div className="task-edit__repe_end">
                                            <h4 className="task-edit__repe-end-title" > End </h4>
                                            <DatePicker
                                                className="task-edit__datepicker-input"
                                                selected={new Date(repeEnd)}
                                                dateFormat="MMMM d, yyyy"
                                                onChange={e => setRepeEnd(moment(e).format("YYYY-MM-DD"))}
                                            />
                                        </div>
                                        <div className="task-edit__repe-edit">
                                            <span>Every</span>
                                            <input type="number"
                                                min="1"
                                                className="task-edit__freq" value={freq}
                                                onChange={e => setFreq(e.target.value)} />
                                            <div className="task-edit__freq-unit-dropdown">
                                                <input type="button" className='task-edit__freq-unit' defaultValue={mainFreqUnit} />
                                                <div className="task-edit__freq-unit-dropdown-content">
                                                    {
                                                        allMainFreqUnit.map((value, index) => (
                                                            <div
                                                                key={index}
                                                                onClick={() => {
                                                                    setFreqUnit(value);
                                                                    setMainFreqUnit(value);
                                                                }}
                                                            ><b>{value}</b></div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                            {
                                                (mainFreqUnit == allMainFreqUnit[2]) ?
                                                    <div className="task-edit__repe-sub-dropdown">
                                                        <input type="button" className='task-edit__repe-sub-freq' value={subFreqUnit} />
                                                        <div className="task-edit__repe-sub-dropdown-content">
                                                            {
                                                                getSubFreqValue("all", dateStart).map(
                                                                    (value, index) => (
                                                                        <div
                                                                            key={index}
                                                                            onClick={() => {
                                                                                setFreqUnit(value[0]);
                                                                                setSubFreqUnit(value[1]);
                                                                            }}
                                                                        ><b>{value[1]}</b></div>)
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                    : null
                                            }
                                        </div>
                                    </>
                            }

                        </div>
                    </div >
                    <div className="task-edit__option">
                        <div onClick={() => setTaskEdit(undefined)}><FaXmark /></div>
                        <div className="task-edit__save"
                            onClick={() => handleSubmit()}><FaCheck /></div>
                        <div onClick={() => setIsArchived(value => !value)}
                            style={{
                                color: isArchived ? "#eb8f34" : "black",
                                fontSize: isArchived ? "40px" : "32px"
                            }}><FaArchive /></div>
                    </div>
                </div>
                <div className="task-edit__footer">
                    <div className="task-edit__tag">
                        <div className="task-edit__tag-icon"><FaTag /></div>
                        <div className="task-edit__tag-container">
                            {
                                selectedTagIds.map(id => {
                                    let tag = tags.filter(tag => tag.id === id)[0];
                                    return (
                                        tag ?
                                            <div key={id}
                                                className="task-edit__selected-tag"
                                                style={{ backgroundColor: tag.color }}>
                                                <span><b>#{tag.name}</b></span>
                                                <div className="task-edit__remove-tag-btn"
                                                    onClick={() => {
                                                        let newValue = selectedTagIds.filter(addedId => addedId !== id);
                                                        setSelectedTagIds(newValue);
                                                    }}><FaMinusCircle /></div>
                                            </div>
                                            : null
                                    )
                                })
                            }
                            <div className='task-edit__tag-dropdown'>
                                {
                                    (tags.length > selectedTagIds.length) ?
                                        <>
                                            <input type="button" className='task-edit__tag-btn' value="Add Tag" />
                                            <div className="task-edit__tag-dropdown-content">
                                                {
                                                    tags.filter(tag => !selectedTagIds.includes(tag.id)).map(
                                                        tag => (
                                                            <div
                                                                key={tag.id}
                                                                onClick={e => setSelectedTagIds(added => [...added, tag.id])}
                                                                style={{ backgroundColor: tag.color }}
                                                            ><b>#{tag.name}</b></div>)
                                                    )
                                                }
                                            </div>
                                        </>
                                        : null
                                }
                            </div>
                        </div>
                    </div>
                    <div className="task-edit__status">
                        <div type="button"
                            id="task-edit-status-bar"
                            className="task-edit__status-bar">
                            <div type="button"
                                className="task-edit__status-completed"
                                style={{ width: status + "%" }}>
                                {
                                    (status >= 50) ?
                                        <div type="button" className="task-edit__status-titleOver50 noselect"><b>Completed {status}%</b></div>
                                        : null
                                }
                            </div>
                            <button
                                className="task-edit__status-thumb"
                                onMouseDown={e => {
                                    let isMouseDown = true;
                                    const statusbar = document.getElementById("task-edit-status-bar");

                                    const handleMouseMove = (event) => {
                                        if (!isMouseDown) return
                                        var newValue = Math.round((event.clientX - statusbar.offsetLeft) / statusbar.offsetWidth * 100);
                                        if (newValue > 100) newValue = 100
                                        if (newValue < 0) newValue = 0
                                        setStatus(newValue);
                                    }

                                    function handleMouseUp() {
                                        isMouseDown = false;
                                    }

                                    document.addEventListener('mousemove', handleMouseMove);
                                    document.addEventListener('mouseup', handleMouseUp);
                                }}></button>
                            {
                                (status < 50) ?
                                    <div type="button" className="task-edit__status-titleUnder50 noselect"><b>Completed {status}%</b></div>
                                    : null
                            }
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default memo(TaskEdit);