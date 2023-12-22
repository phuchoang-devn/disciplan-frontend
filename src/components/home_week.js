import "./home_week.css"
import { TaskContext } from "../home.js";

import moment from 'moment';
import { FaCaretLeft } from "react-icons/fa";
import { FaCaretRight } from "react-icons/fa6";
import { useState, useEffect, useContext, memo } from "react";
import { useOutletContext } from "react-router-dom";

const HomeWeek = (props) => {
    const [weekdays, setWeekdays] = useState([]);
    const [
        datePointer,
        tasks,
        repetitions,
        loading,
        setdatePointer,
        setViewRender
    ] = useOutletContext();

    const [taskNoTime, setTaskNoTime] = useState([]);
    const [tasksOfDate0, settasksOfDate0] = useState([]);
    const [tasksOfDate1, settasksOfDate1] = useState([]);
    const [tasksOfDate2, settasksOfDate2] = useState([]);
    const [tasksOfDate3, settasksOfDate3] = useState([]);
    const [tasksOfDate4, settasksOfDate4] = useState([]);
    const [tasksOfDate5, settasksOfDate5] = useState([]);
    const [tasksOfDate6, settasksOfDate6] = useState([]);

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

        if (newWeek[0].getMonth() != newWeek[6].getMonth())
            view += (" - " + newWeek[6].toLocaleString('default', { month: 'short', year: "numeric" }));
        setViewRender(view);
    }, [datePointer]);

    useEffect(() => {
        if (loading) return

        let tasksOfWeek = [];
        weekdays.forEach(day => {
            let foundTasks = tasks.current.filter(task => (
                (task.date_start === moment(day).format('YYYY-MM-DD')) &&
                (task.time_start !== null)
            ));
            tasksOfWeek.push(foundTasks);
        });

        let foundTasksNoTime = tasks.current.filter(task => (
            (moment(task.date_start).isSameOrAfter(weekdays[6], 'day')) &&
            (moment(task.date_start).isSameOrBefore(weekdays[0], 'day'))
        ));
        setTaskNoTime(foundTasksNoTime);

        settasksOfDate0(tasksOfWeek[0]);
        settasksOfDate1(tasksOfWeek[1]);
        settasksOfDate2(tasksOfWeek[2]);
        settasksOfDate3(tasksOfWeek[3]);
        settasksOfDate4(tasksOfWeek[4]);
        settasksOfDate5(tasksOfWeek[5]);
        settasksOfDate6(tasksOfWeek[6]);
    }, [weekdays, loading])

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
                                    backgroundColor: (today === wdMoment) ? "#8c0200" : "var(--secondary-50-opacity)",
                                    color: (today === wdMoment) ? "white" : "rgb(55, 55, 55)"
                                }}>
                                <div><b>{days[weekday.getDay()]}</b></div>
                                <div><b>{weekday.getDate()}</b></div>
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
            <div className="timeline-container">
                <div className="time">
                    {
                        [...Array(24)].map((x, index) => {
                            index += 1;
                            let mt = 100;
                            if (index === 1) mt = 110;
                            else if (index === 24) mt = 90;
                            if (index < 10) index = "0" + index;
                            return (
                                <div key={index} className="hour" style={{ marginTop: mt + "px" }}>
                                    <b>{index}:00</b>
                                </div>
                            )
                        })
                    }
                </div>

                <TaskColumn taskArray={tasksOfDate0} />
                <TaskColumn taskArray={tasksOfDate1} />
                <TaskColumn taskArray={tasksOfDate2} />
                <TaskColumn taskArray={tasksOfDate3} />
                <TaskColumn taskArray={tasksOfDate4} />
                <TaskColumn taskArray={tasksOfDate5} />
                <TaskColumn taskArray={tasksOfDate6} />

            </div>
        </div>
    )
}

const TaskColumn = memo((props) => {
    return (
        <div className="home-week-column">
            <div className="home-week-column__task-container">
                {
                    props.taskArray ?
                        props.taskArray.map(task => {
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
                                id={task.id}
                                t={t}
                                l={l}
                                h={h}
                                color={task.color}
                                name={task.name}
                                start={moment(task.time_start, "HH:mm:ss").format("HH:mm")}
                                end={moment(task.time_end, "HH:mm:ss").format("HH:mm")}
                                status={task.status}
                                tags={task.tags}
                            />
                        })
                        : null
                }
            </div>
        </div>
    )
})

const Task = memo((props) => {
    const [ , , setTaskInfo, ] = useContext(TaskContext);

    return (
        <div className="home-week-task"
            onClick={() => setTaskInfo(props.id)}
            style={{
                top: props.t + "%",
                left: props.l + "%",
                height: props.h + "%",
                width: 100 - props.l + "%",
                backgroundColor: props.color
            }}>
            <div className="home-week-task__header">
                <div><b>{props.name}</b></div>
                <div className="home-week-task__header-time">{props.start} - {props.end}</div>
            </div>
            <div className="home-week-task__footer">
                <div className="home-week-task__tag-container">
                    {
                        props.tags.map(tag => (
                            <div key={tag.id}
                                className="home-week-task__tag"
                                style={{
                                    backgroundColor: tag.color
                                }}><b>#{tag.name}</b></div>
                        ))
                    }
                </div>
                <div className="home-week-task__percent"
                    style={{
                        backgroundImage: "linear-gradient(to right, var(--main-color) " + props.status + "%, var(--secondary-50-opacity) " + (100 - props.status) + "%)"
                    }}
                >{props.status}%</div>
            </div>
        </div>
    )
})

export default memo(HomeWeek);