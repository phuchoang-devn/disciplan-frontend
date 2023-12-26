import "./home_week.css"
import { TaskContext } from "../home.js";
import updateTask from "../crud/update_task.js";

import moment from 'moment';
import { FaCaretLeft } from "react-icons/fa";
import { FaCaretRight } from "react-icons/fa6";
import { useState, useEffect, useContext, memo } from "react";
import { useOutletContext } from "react-router-dom";
import { MdOutlineLtePlusMobiledata } from "react-icons/md";


const HomeWeek = (props) => {
    const [weekdays, setWeekdays] = useState([]);
    const [
        datePointer,
        taskRepo,
        loading,
        setdatePointer,
        setViewRender,
        checkedPriorities,
        checkedTags
    ] = useOutletContext();

    const [taskNoTime, setTaskNoTime] = useState([]);
    const [tasks0Day, setTasks0Day] = useState([]);
    const [tasks1Day, setTasks1Day] = useState([]);
    const [tasks2Day, setTasks2Day] = useState([]);
    const [tasks3Day, setTasks3Day] = useState([]);
    const [tasks4Day, setTasks4Day] = useState([]);
    const [tasks5Day, setTasks5Day] = useState([]);
    const [tasks6Day, setTasks6Day] = useState([]);

    const [movingTask, setMovingTask] = useState(undefined);

    useEffect(() => {
        //set Weekdays
        let prevMonday = new Date(datePointer);
        prevMonday.setDate(datePointer.getDate() - (datePointer.getDay() + 6) % 7);
        let newWeek = [prevMonday];

        for (let i = 0; i < 6; i++) {
            var nextDay = new Date(newWeek[i]);
            nextDay.setDate(nextDay.getDate() + 1);
            newWeek.push(nextDay);
        }

        setWeekdays(newWeek);

        // set ViewRender
        let view = newWeek[0].toLocaleString('default', { month: 'short', year: "numeric" })

        if (newWeek[0].getMonth() !== newWeek[6].getMonth())
            view += (" - " + newWeek[6].toLocaleString('default', { month: 'short', year: "numeric" }));
        setViewRender(view);
    }, [datePointer]);

    useEffect(() => {
        if (loading) return

        let foundTasksOfWeek = [];
        weekdays.forEach(day => {
            let foundTasks = taskRepo.current.filter(task => (
                (task.date_start === moment(day).format('YYYY-MM-DD'))
                && (task.time_start !== null)
                && checkedPriorities.includes(task.priority)
                && (
                    (checkedTags.includes(-1) && task.tags.length === 0)
                    || (task.tags.filter(tag => checkedTags.includes(tag.id)).length !== 0)
                )
            ));
            foundTasksOfWeek.push(foundTasks);
        });
        setTasks0Day(foundTasksOfWeek[0]);
        setTasks1Day(foundTasksOfWeek[1]);
        setTasks2Day(foundTasksOfWeek[2]);
        setTasks3Day(foundTasksOfWeek[3]);
        setTasks4Day(foundTasksOfWeek[4]);
        setTasks5Day(foundTasksOfWeek[5]);
        setTasks6Day(foundTasksOfWeek[6]);

        let foundTasksNoTime = taskRepo.current.filter(task => (
            (moment(task.date_start).isSameOrAfter(weekdays[6], 'day')) &&
            (moment(task.date_start).isSameOrBefore(weekdays[0], 'day'))
        ));
        setTaskNoTime(foundTasksNoTime);
    }, [weekdays, loading, checkedPriorities, checkedTags])

    const setLastWeek = () => {
        let date = new Date(datePointer);
        setdatePointer(new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000));
    }

    const setNextWeek = () => {
        let date = new Date(datePointer);
        setdatePointer(new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000));
    }

    return (
        <div className="home-week-container">
            <div className="home-week-edit-container">

            </div>

            <div className="weekday-bar">
                <div className="weekday-bar__pn">
                    <div onClick={setLastWeek}
                        className="pn__btn">
                        <FaCaretLeft />
                    </div>
                    <div onClick={setNextWeek}
                        className="pn__btn">
                        <FaCaretRight />
                    </div>
                </div>
                {
                    weekdays.map((weekday) => {
                        let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
                        let today = moment(new Date()).format('MM/DD/YYYY');
                        let wdMoment = moment(weekday).format('MM/DD/YYYY');

                        return (
                            <div key={weekday}
                                className="weekday-bar__days"
                                style={{
                                    backgroundColor: (today === wdMoment) ? "#8c0200" : "transparent",
                                    color: (today === wdMoment) ? "white" : "rgb(55, 55, 55)"
                                }}>
                                <div className="noselect"><b>{days[weekday.getDay()]}</b></div>
                                <div className="hw-weekday__date-num noselect"><b>{weekday.getDate()}</b></div>
                            </div>
                        )
                    })
                }
            </div>
            <div className="no-time">
                <div className="no-time__timezones">
                </div>
                <div className="no-time__tasks">
                </div>
            </div>
            <div id="home-week__timeline-container" className="timeline-container">
                <div id="hw-time" className="time">
                    {
                        [...Array(24)].map((x, index) => {
                            index += 1;
                            let mt = 100;
                            if (index === 1) mt = 110;
                            else if (index === 24) mt = 90;
                            if (index < 10) index = "0" + index;
                            return (
                                <div key={index} className="hour noselect" style={{ marginTop: mt + "px" }}>
                                    <b>{index}:00</b>
                                </div>
                            )
                        })
                    }
                </div>

                <TaskColumn orderWeekDay={0} tasks={tasks0Day} setTasksNDay={setTasks0Day} date={weekdays[0]} movingTask={movingTask} setMovingTask={setMovingTask} />
                <TaskColumn orderWeekDay={1} tasks={tasks1Day} setTasksNDay={setTasks1Day} date={weekdays[1]} movingTask={movingTask} setMovingTask={setMovingTask} />
                <TaskColumn orderWeekDay={2} tasks={tasks2Day} setTasksNDay={setTasks2Day} date={weekdays[2]} movingTask={movingTask} setMovingTask={setMovingTask} />
                <TaskColumn orderWeekDay={3} tasks={tasks3Day} setTasksNDay={setTasks3Day} date={weekdays[3]} movingTask={movingTask} setMovingTask={setMovingTask} />
                <TaskColumn orderWeekDay={4} tasks={tasks4Day} setTasksNDay={setTasks4Day} date={weekdays[4]} movingTask={movingTask} setMovingTask={setMovingTask} />
                <TaskColumn orderWeekDay={5} tasks={tasks5Day} setTasksNDay={setTasks5Day} date={weekdays[5]} movingTask={movingTask} setMovingTask={setMovingTask} />
                <TaskColumn orderWeekDay={6} tasks={tasks6Day} setTasksNDay={setTasks6Day} date={weekdays[6]} movingTask={movingTask} setMovingTask={setMovingTask} />

            </div>
        </div>
    )
}

const TaskColumn = memo((props) => {
    const { orderWeekDay, tasks, setTasksNDay, date, movingTask, setMovingTask } = props;

    const [addingTask, setAddingTask] = useState(undefined);
    const [movedinTask, setMovedinTask] = useState(undefined);
    const [timeStart, setTimeStart] = useState(undefined);
    const [timeEnd, setTimeEnd] = useState(undefined);
    const [lessThan15Min, setLessThan15Min] = useState(true);
    const [isDragingDown, setIsDragingDown] = useState(undefined);

    const [, , , setTaskEdit, , , , defaultColor] = useContext(TaskContext);

    useEffect(() => {
        if (!movingTask) {
            setMovedinTask(undefined);
            return 
        }

        if (date === movingTask[0]) setTasksNDay(data => data.filter(task => task.id !== movingTask[2].id));

        if (orderWeekDay === movingTask[1]) setMovedinTask(movingTask.slice(2));
        else if (!!movedinTask) setMovedinTask(undefined);
    }, [movingTask])

    return (
        <div className="home-week-column"
            onMouseDown={e => {
                var isMouseDown = true;
                const taskContainer = document.getElementById("home-week__timeline-container");
                const containerRect = taskContainer.getBoundingClientRect();

                const firstRect = e.target.getBoundingClientRect();
                var columnRect = e.target.getBoundingClientRect();
                const unitPixel = columnRect.height / (24 * 12);

                var lastY = e.clientY;

                var lastChoosenStart = undefined;
                var lastChoosenEnd = undefined;

                const setValue = () => {
                    var startInUnit = Math.round((e.clientY - firstRect.top) / unitPixel);
                    var endInUnit = Math.round((lastY - columnRect.top) / unitPixel);
                    if (endInUnit < 0) endInUnit = 0;
                    if (endInUnit > 24 * 12) endInUnit = 24 * 12;
                    if (startInUnit === endInUnit) return

                    var hourStart = parseInt(startInUnit / 12);
                    var minuteStart = (startInUnit % 12) * 5;
                    var hourEnd = parseInt(endInUnit / 12);
                    var minuteEnd = (endInUnit % 12) * 5;

                    var height = (endInUnit - startInUnit) * unitPixel;
                    if (Math.abs(startInUnit - endInUnit) > 3) setLessThan15Min(false);
                    else setLessThan15Min(true);

                    if (startInUnit < endInUnit) setIsDragingDown(true);
                    else setIsDragingDown(false);

                    if (height > 0) {
                        lastChoosenStart = `${(hourStart < 10) ? "0" + hourStart : hourStart}:${(minuteStart < 10) ? "0" + minuteStart : minuteStart}`;
                        setTimeStart(lastChoosenStart);
                        lastChoosenEnd = `${(hourEnd < 10) ? "0" + hourEnd : hourEnd}:${(minuteEnd < 10) ? "0" + minuteEnd : minuteEnd}`;
                        setTimeEnd(lastChoosenEnd);
                        setAddingTask([startInUnit * unitPixel, height]);
                    } else {
                        lastChoosenStart = `${(hourEnd < 10) ? "0" + hourEnd : hourEnd}:${(minuteEnd < 10) ? "0" + minuteEnd : minuteEnd}`;
                        setTimeStart(lastChoosenStart);
                        lastChoosenEnd = `${(hourStart < 10) ? "0" + hourStart : hourStart}:${(minuteStart < 10) ? "0" + minuteStart : minuteStart}`;
                        setTimeEnd(lastChoosenEnd);
                        setAddingTask([endInUnit * unitPixel, -height]);
                    }
                }

                const scrollContainer = () => {
                    var relativeY = lastY - columnRect.top
                    if (lastY < containerRect.top) {
                        taskContainer.scrollTo({
                            top: lastY - columnRect.top,
                            left: 0,
                            behavior: "auto",
                        });
                    }
                    if ((lastY > containerRect.bottom) && (relativeY <= firstRect.height)) {
                        taskContainer.scrollTo({
                            top: relativeY - containerRect.height,
                            left: 0,
                            behavior: "auto",
                        });
                    }
                }

                const handleMouseMove = (event) => {
                    if (!isMouseDown) return

                    lastY = event.clientY;
                    setValue();
                    scrollContainer();
                }

                const handleScroll = () => {
                    if (!isMouseDown) return

                    columnRect = e.target.getBoundingClientRect();
                    setValue();
                    scrollContainer();
                }

                function handleMouseUp() {
                    isMouseDown = false;
                    setAddingTask(undefined);
                    setLessThan15Min(true);
                    setIsDragingDown(undefined);

                    if (lastChoosenStart && lastChoosenEnd)
                        setTaskEdit({
                            type: "add",
                            task: {
                                name: "",
                                description: "",
                                priority: "medium",
                                date_start: moment(date).format("YYYY-MM-DD"),
                                date_end: moment(date).format("YYYY-MM-DD"),
                                time_start: `${lastChoosenStart}:00`,
                                time_end: `${lastChoosenEnd}:00`,
                                status: 0,
                                notification: null,
                                is_archived: false,
                                tags: [],
                                color: defaultColor.current["medium"],
                                repetition_group: null
                            }
                        });

                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                    taskContainer.removeEventListener('scroll', handleScroll);
                }

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
                taskContainer.addEventListener('scroll', handleScroll);
            }}>
            <div className="home-week-column__task-container">
                {
                    !!movedinTask ?
                        <div className="home-week-task hw__moving-task"
                            style={{
                                backgroundColor: movedinTask[0].color,
                                height: movedinTask[2] + "%",
                                top: movedinTask[1] + "px"
                            }}>
                            <div className="home-week-task__header">
                                <div><b>{movedinTask[0].name}</b></div>
                                <div className="home-week-task__header-time">
                                    {moment(movedinTask[0].time_start, "HH:mm:ss").format("HH:mm")}
                                    - {moment(movedinTask[0].time_end, "HH:mm:ss").format("HH:mm")}
                                </div>
                            </div>
                            <div className="home-week-task__footer">
                                <div className="home-week-task__tag-container">
                                    {
                                        movedinTask[0].tags.map(tag => (
                                            <div key={tag.id}
                                                className="home-week-task__tag"
                                                style={{
                                                    backgroundColor: tag.color
                                                }}><b>#{tag.name}</b></div>
                                        ))
                                    }
                                </div>
                                <div className="home-week-task__status-bar">
                                    <div className="hw-task__status-completed" style={{ width: movedinTask[0].status + "%" }}>
                                        {
                                            (movedinTask[0].status >= 50) ?
                                                <div className="hw-task__status-titleOver50"><b>{movedinTask[0].status}%</b></div>
                                                : null
                                        }
                                    </div>
                                    {
                                        (movedinTask[0].status < 50) ?
                                            <div className="hw-task__status-titleUnder50"><b>{movedinTask[0].status}%</b></div>
                                            : null
                                    }
                                </div>
                            </div>
                        </div>
                        : null
                }
                {
                    !!addingTask ?
                        <div className="home-week__adding-task"
                            style={{
                                top: addingTask[0] + "px",
                                height: addingTask[1] + "px",
                                backgroundColor: defaultColor.current["medium"]
                            }}>
                            <div draggable="false"
                                className="home-week__adding-task-time noselect"
                                style={{
                                    position: "absolute",
                                    transform: lessThan15Min ? "translateY(-100%)" : "unset",
                                    bottom: isDragingDown && !lessThan15Min ? "0" : "unset"
                                }}><b>{timeStart} - {timeEnd}</b></div>
                        </div>
                        : null
                }
                {
                    tasks ?
                        tasks.map(task => {
                            let time_start = moment(task.time_start, "HH:mm:ss");
                            let time_end = moment(task.time_end, "HH:mm:ss");
                            let dayStart = moment("00:00:00", "HH:mm:ss");

                            let t = time_start.diff(dayStart, 'minutes') * 100 / (24 * 60);
                            let l = 0;
                            let h = 0;

                            let dateDuration = moment(task.date_end).diff(moment(task.date_start), 'days');
                            if (dateDuration === 1) {
                                let dayEnd = moment("23:59:00", "HH:mm:ss");
                                h = dayEnd.diff(time_start, 'minutes') * 100 / (24 * 60);
                            } else h = time_end.diff(time_start, 'minutes') * 100 / (24 * 60);

                            return <Task
                                key={task.id}
                                columnIndex={orderWeekDay}
                                t={t}
                                l={l}
                                h={h}
                                task={task}
                                setMovingTask={setMovingTask}
                                dateStart={date}
                                setTasksNDay={setTasksNDay}
                            />
                        })
                        : null
                }
            </div>
        </div>
    )
})

const Task = memo((props) => {
    const { columnIndex, t, l, h, task, setMovingTask, dateStart, setTasksNDay } = props;
    const [, , setTaskInfo,] = useContext(TaskContext);

    return (
        <div className="home-week-task"
            onMouseDown={e => {
                e.stopPropagation()
                var isMouseDown = true;

                var seeInfo = true;
                const setSeeInfo = setTimeout(() => {
                    seeInfo = false;
                    setValue(0);
                }, 500)

                const hwTimeRect = document.getElementById("hw-time").getBoundingClientRect();
                const taskContainer = document.getElementById("home-week__timeline-container");
                const taskContainerRect = taskContainer.getBoundingClientRect();
                const unitPixel = hwTimeRect.height / (12 * 24);
                const columnWidth = (document.body.clientWidth - hwTimeRect.width) / 7;

                var currentY = e.clientY;
                var currentYTaskStart = hwTimeRect.height * t / 100;
                var currentYTaskEnd = currentYTaskStart + hwTimeRect.height * h / 100;
                var currentScrollTop = taskContainer.scrollTop;

                var toColumn = columnIndex;
                var daysDiff = 0;

                var newTask = JSON.parse(JSON.stringify(task));
                const taskTimeDuration = moment(task.time_end, "HH:mm:ss").diff(moment(task.time_start, "HH:mm:ss"), 'minutes');

                const setValue = (delta) => {
                    currentYTaskStart += delta;
                    currentYTaskEnd += delta;

                    if ((currentYTaskStart >= 0) && (currentYTaskEnd <= hwTimeRect.height)) {
                        var yStartInUnit = Math.round(currentYTaskStart / unitPixel);
                        var hourStart = parseInt(yStartInUnit / 12);
                        var minuteStart = (yStartInUnit % 12) * 5;
                        newTask.time_start = `${(hourStart < 10) ? "0" + hourStart : hourStart}:${(minuteStart < 10) ? "0" + minuteStart : minuteStart}:00`;
                        newTask.time_end = moment(newTask.time_start, "HH:mm:ss").add(taskTimeDuration, "minutes").format("HH:mm:ss");
                        setMovingTask([dateStart, toColumn, newTask, yStartInUnit * unitPixel, h]);
                    } else if (currentYTaskStart < 0) {
                        newTask.time_start = "00:00:00";
                        newTask.time_end = moment("00:00:00", "HH:mm:ss").add(taskTimeDuration, "minutes").format("HH:mm:ss");
                        setMovingTask([dateStart, toColumn, newTask, 0, h]);
                    } else if (currentYTaskEnd > hwTimeRect.height) {
                        newTask.time_end = "00:00:00";
                        newTask.time_start = moment("00:00:00", "HH:mm:ss").add(-taskTimeDuration, "minutes").format("HH:mm:ss");
                        setMovingTask([dateStart, toColumn, newTask, hwTimeRect.height * (100 - h) / 100, h]);
                    }
                }

                const scrollContainer = () => {
                    if (currentYTaskStart < currentScrollTop) {
                        taskContainer.scrollTo({
                            top: currentYTaskStart,
                            left: 0,
                            behavior: "auto",
                        });
                    }
                    if (currentYTaskEnd > currentScrollTop + taskContainerRect.height) {
                        taskContainer.scrollTo({
                            top: currentYTaskEnd - taskContainerRect.height,
                            left: 0,
                            behavior: "auto",
                        });
                    }
                }

                const handleMouseMove = (event) => {
                    if (!isMouseDown || seeInfo) return

                    toColumn = parseInt((event.clientX - hwTimeRect.width) / columnWidth);
                    toColumn = Math.min(Math.max(toColumn, 0), 6);
                    setValue(event.clientY - currentY);
                    currentY = event.clientY;
                    scrollContainer();
                }

                const handleScroll = (event) => {
                    if (!isMouseDown || seeInfo) return

                    setValue(event.target.scrollTop - currentScrollTop);
                    currentScrollTop = event.target.scrollTop;
                    scrollContainer();
                }

                function handleMouseUp() {
                    isMouseDown = false;

                    if (seeInfo) {
                        clearTimeout(setSeeInfo);
                        setTaskInfo(task.id);
                    } else {
                        setMovingTask(undefined);

                        var newDateStart = moment(task.date_start, 'YYYY-MM-DD').add(daysDiff + toColumn - columnIndex, 'days');
                        if((task.date_start === newDateStart.format('YYYY-MM-DD')) && (task.time_start === newTask.time_start)) setTasksNDay(data => [...data, task]);
                        else {
                            const taskDateDuration = moment(task.date_end, "YYYY-MM-DD").diff(moment(task.date_start, "YYYY-MM-DD"), 'days');
                            var newDateEnd = newDateStart.add(taskDateDuration, 'days');
                            newTask.date_start = newDateStart.format('YYYY-MM-DD');
                            newTask.date_end = newDateEnd.format('YYYY-MM-DD');
                            updateTask(task, newTask, )
                        }
                    }


                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                    taskContainer.removeEventListener('scroll', handleScroll);
                }

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
                taskContainer.addEventListener('scroll', handleScroll);
            }}
            style={{
                top: t + "%",
                left: l + "%",
                height: h + "%",
                width: 90 - l + "%",
                backgroundColor: task.color
            }}>
            <div className="home-week-task__header">
                <div><b>{task.name}</b></div>
                <div className="home-week-task__header-time">
                    {moment(task.time_start, "HH:mm:ss").format("HH:mm")}
                    - {moment(task.time_end, "HH:mm:ss").format("HH:mm")}
                </div>
            </div>
            <div className="home-week-task__footer">
                <div className="home-week-task__tag-container">
                    {
                        task.tags.map(tag => (
                            <div key={tag.id}
                                className="home-week-task__tag"
                                style={{
                                    backgroundColor: tag.color
                                }}><b>#{tag.name}</b></div>
                        ))
                    }
                </div>
                <div className="home-week-task__status-bar">
                    <div className="hw-task__status-completed" style={{ width: task.status + "%" }}>
                        {
                            (task.status >= 50) ?
                                <div className="hw-task__status-titleOver50"><b>{task.status}%</b></div>
                                : null
                        }
                    </div>
                    {
                        (task.status < 50) ?
                            <div className="hw-task__status-titleUnder50"><b>{task.status}%</b></div>
                            : null
                    }
                </div>
            </div>
        </div>
    )
})

export default memo(HomeWeek);