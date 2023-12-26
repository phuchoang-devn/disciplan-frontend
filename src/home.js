import './home.css';
import env from './env';
import TaskInfo from "./components/home_task_info";
import TaskEdit from "./components/home_task_edit";
import TagEdit from './components/home_tag_edit';

import { FaHourglassEnd } from "react-icons/fa6";
import { HiOutlineMenu } from "react-icons/hi";
import { FaXmark } from "react-icons/fa6";
import { PiPlusSquareFill } from "react-icons/pi";
import { FaInfoCircle } from "react-icons/fa";

import moment from 'moment';
import { useState, useEffect, useRef, createContext, useMemo, memo } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

export const TaskContext = createContext();

const Home = (props) => {
    const { loggedIn, email } = props

    const [datePointer, setDatePointer] = useState(new Date());
    const taskRepo = useRef([]);
    const repetitionRepo = useRef([]);
    const [tagRepo, setTagRepo] = useState([]);
    const defaultColor = useRef({});

    const appStartPoint = useMemo(() => new Date(), []);
    const fetchedDates = useRef([]);

    const [viewRender, setViewRender] = useState("");

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [taskInfo, setTaskInfo] = useState(NaN);
    const [taskEdit, setTaskEdit] = useState(undefined);
    const [tagEdit, setTagEdit] = useState(undefined);

    const [optionWindow, setOptionWindow] = useState(false);
    const [checkedPriorities, setCheckedPriorities] = useState(["low", "medium", "high", "critical"]);
    const [checkedTags, setCheckedTags] = useState([]);

    const user = JSON.parse(localStorage.getItem("disciplan_user"));

    useEffect(() => {
        if (!loggedIn || !user) {
            navigate("/login");
            return
        }
        getAllTags();
        getDefaultColor();
    }, [loggedIn])

    useEffect(() => {
        if (!loggedIn || !user) return

        let diff = moment(datePointer).diff(moment(appStartPoint), 'days');
        let start = ((diff > 0) ? diff + 1 : diff) - env.MAX_VIEW_RADIUS;
        let fetchLength = 2 * env.MAX_VIEW_RADIUS + 1;
        let calcToFetch = Array.from({ length: fetchLength }, (_, i) => i + start);
        let arrDiff = calcToFetch.filter(x => !fetchedDates.current.includes(x));

        if (arrDiff.length !== 0) {
            getTasks(
                moment(datePointer).add(Math.min(...arrDiff), 'days'),
                moment(datePointer).add(Math.max(...arrDiff), 'days'),
                arrDiff
            );
        }
    }, [datePointer])

    const logOut = () => {
        localStorage.removeItem("disciplan_user");
        props.setLoggedIn(false);
        sessionStorage.clear();
        navigate("/login");
    }

    const getDefaultColor = async () => {
        await fetch("http://" + env.BACKEND_SERVER + "/users/default-color", {
            headers: {
                'Authorization': user.token
            }
        })
            .then(r => {
                if (r.ok) return r.json();
                throw new Error('Failed: GET default color');
            })
            .then(json => defaultColor.current = json)
            .catch(e => console.log(e.message));
    }

    const getAllTags = async () => {
        await fetch("http://" + env.BACKEND_SERVER + "/tags/all", {
            headers: {
                'Authorization': user.token
            }
        })
            .then(r => {
                if (r.ok) return r.json();
                throw new Error('Failed: GET all tags');
            })
            .then(json => {
                setTagRepo(json);
                var tagIds = [...json.map(tag => tag.id), -1];
                setCheckedTags(tagIds);
            })
            .catch(e => console.log(e.message));
    }

    const getTasks = async (viewStart, viewEnd, newData) => {
        let url = "http://" + env.BACKEND_SERVER + "/tasks/period/?from=" +
            viewStart.format('YYYY-MM-DD') + "&to=" + viewEnd.format('YYYY-MM-DD');
        if (!loading) setLoading(true)
        await fetch(url, {
            headers: {
                'Authorization': user.token
            }
        })
            .then(r => {
                if (r.ok) {
                    fetchedDates.current = [...fetchedDates.current, ...newData];
                    return r.json();
                }
                throw new Error('Failed: GET TASKS');
            })
            .then(json => {
                taskRepo.current = taskRepo.current.concat(json.tasks);
                repetitionRepo.current = repetitionRepo.current.concat(json.repetitions);
            }).then(() => setLoading(false))
            .catch(e => console.log(e.message));
    }

    const todayBtn = () => {
        if (moment(datePointer).format('YYYY-MM-DD') !== moment(new Date()).format('YYYY-MM-DD'))
            setDatePointer(new Date());
    }

    const HomeDropDown = (props) => {
        return (
            <div className='home-dropdown noselect'>
                <div className='home-dropdown-btn home-nav-btn'
                    style={{
                        borderRadius: "20px",
                        backgroundColor: props.is_email ? "var(--main-50-opacity)" : "transparent"
                    }}>
                    <b>{props.btn_name}</b>
                </div>
                <div className="home_dropdown-content">
                    {props.link_content.map(
                        ([k, v]) => (<Link key={k} to={v}>{k}</Link>)
                    )}
                    {props.btn_content.map(
                        ([k, v]) => (<div key={k} onClick={v}>{k}</div>)
                    )}
                </div>
            </div>
        )
    }

    const handlePriortyChechbox = (priority) => {
        if (checkedPriorities.includes(priority)) setCheckedPriorities(data => data.filter(pri => pri !== priority));
        else setCheckedPriorities(data => [...data, priority]);
    }

    return (
        <div className='home-container'>
            <div className="home-nav">
                <div className='home-nav__start'>
                    <div className='home-nav__option-icon'
                        style={{
                            visibility: optionWindow ? "hidden" : "visible"
                        }}
                        onClick={() => setOptionWindow(data => !data)}>
                        <HiOutlineMenu />
                    </div>
                    <span className='home-nav__brand noselect'>Disciplan</span>
                </div>
                <div className='home-nav__task-button-group'>
                    <div className='home-view noselect'><b>{viewRender}</b></div>
                    <div type="button"
                        className='home-nav-btn noselect'
                        onClick={todayBtn}>
                        <b>Today</b>
                    </div>

                    <HomeDropDown
                        btn_name="View"
                        is_email={false}
                        link_content={[
                            ["Day", "/day"],
                            ["Week", "/week"],
                            ["Month", "/month"],
                            ["Year", "/year"],
                            ["Tasks", "/tasks"],
                        ]}
                        btn_content={[]}
                    />
                </div>
                <div className='home-nav__system-button-group'>
                    <div className='home-nav__loading-icon'
                        style={{
                            visibility: loading ? "visible" : "hidden"
                        }}>
                        <FaHourglassEnd />
                    </div>
                    <HomeDropDown
                        btn_name={email}
                        is_email={true}
                        link_content={[
                            ["Settings", "1"],
                        ]}
                        btn_content={[
                            ["Logout", logOut]
                        ]}
                    />
                </div>
            </div>
            {
                optionWindow ?
                    <div className='home-option'>
                        <div className='home-option__start'>
                            <div className='home-option__close-icon'
                                onClick={() => setOptionWindow(data => !data)}>
                                <FaXmark />
                            </div>
                            <span className='home-option__brand noselect'>Disciplan</span>
                        </div>
                        <div className='home-option__priority-tag'>
                            <div className='home-option__priority__checkbox-container'>
                                <div className='home-option__priority__checkbox'
                                    style={{
                                        backgroundColor: defaultColor.current["critical"]
                                    }}>
                                    <input type="checkbox"
                                        checked={checkedPriorities.includes("critical")}
                                        onChange={() => handlePriortyChechbox("critical")} />
                                    <span><b>Critical</b></span>
                                </div>
                                <div className='home-option__priority__checkbox'
                                    style={{
                                        backgroundColor: defaultColor.current["high"]
                                    }}>
                                    <input type="checkbox"
                                        checked={checkedPriorities.includes("high")}
                                        onChange={() => handlePriortyChechbox("high")} />
                                    <span><b>High</b></span>
                                </div>
                                <div className='home-option__priority__checkbox'
                                    style={{
                                        backgroundColor: defaultColor.current["medium"]
                                    }}>
                                    <input type="checkbox"
                                        checked={checkedPriorities.includes("medium")}
                                        onChange={() => handlePriortyChechbox("medium")} />
                                    <span><b>Medium</b></span>
                                </div>
                                <div className='home-option__priority__checkbox'
                                    style={{
                                        backgroundColor: defaultColor.current["low"]
                                    }}>
                                    <input type="checkbox"
                                        checked={checkedPriorities.includes("low")}
                                        onChange={() => handlePriortyChechbox("low")} />
                                    <span><b>Low</b></span>
                                </div>
                            </div>
                            <div className='home-option__tag__checkbox-container'>
                                <div className='home-option__no-tag noselect'>
                                    <input type="checkbox"
                                        onChange={() => {
                                            if (checkedTags.includes(-1)) setCheckedTags(data => data.filter(tagId => tagId !== -1));
                                            else setCheckedTags(data => [...data, -1]);
                                        }}
                                        checked={checkedTags.includes(-1)} />
                                    <span><b>No Tag</b></span>
                                </div>
                                {
                                    tagRepo.map(tag => (
                                        <div key={tag.id}
                                            className='home-option__tag__checkbox'
                                            style={{
                                                backgroundColor: tag.color
                                            }}>
                                            <input type="checkbox"
                                                onChange={() => {
                                                    if (checkedTags.includes(tag.id)) setCheckedTags(data => data.filter(tagId => tagId !== tag.id));
                                                    else setCheckedTags(data => [...data, tag.id]);
                                                }}
                                                checked={checkedTags.includes(tag.id)} />
                                            <span><b>#{tag.name}</b></span>
                                            <div className='home-option__tag__info-icon'
                                                onClick={() => setTagEdit({
                                                    type: "update",
                                                    tag: tag
                                                })}>
                                                <FaInfoCircle />
                                            </div>
                                        </div>
                                    ))
                                }
                                <div className='home-option__tag__add noselect'
                                    onClick={() => setTagEdit({
                                        type: "add",
                                        tag: {
                                            name: "",
                                            color: defaultColor.current["tag"]
                                        }
                                    })}>
                                    <div className='home-option__tag__add-icon'><PiPlusSquareFill /></div>
                                    <span><b>Add New Tag</b></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    : null
            }
            <TaskContext.Provider value={[taskRepo, repetitionRepo, setTaskInfo, setTaskEdit, loading, setLoading, datePointer, defaultColor]}>
                {
                    tagEdit ?
                        <TagEdit
                            tagEdit={tagEdit}
                            setTagEdit={setTagEdit}
                            tagRepo={tagRepo}
                            setTagRepo={setTagRepo}
                            setCheckedTags={setCheckedTags} />
                        : null
                }
                {
                    (!isNaN(taskInfo)) ?
                        <TaskInfo
                            id={taskInfo} />
                        : null
                }
                {
                    taskEdit ?
                        <TaskEdit
                            taskEdit={taskEdit}
                            tagsRepo={tagRepo} />
                        : null
                }
                <Outlet context={[
                    datePointer,
                    taskRepo,
                    loading,
                    setDatePointer,
                    setViewRender,
                    checkedPriorities,
                    checkedTags
                ]} />
            </TaskContext.Provider>
        </div>
    )
}

export default memo(Home);